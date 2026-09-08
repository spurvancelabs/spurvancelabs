import { NextRequest, NextResponse } from 'next/server';
import { getSupabaseAdminClient } from '@/lib/supabase/server';
import { cookies } from 'next/headers';
import { verifyToken } from '@/lib/auth';
import { requireViewer, ensurePublicUserRecord } from '@/lib/lms/utils';
import { isValidRole, isAdminRole } from '@/lib/lms/roles';
import { canManageUsers, getAssignableRoles } from '@/lib/lms/permissions';

export async function GET() {
  try {
    await requireViewer();

    const supabase = getSupabaseAdminClient();

    const { data: users, error } = await supabase
      .from('users')
      .select('id, email, name, type, created_at')
      .order('created_at', { ascending: false });

    if (error) throw error;

    const { data: adminUsers } = await supabase
      .from('admin_users')
      .select('user_id, role');

    const adminRoleMap = new Map((adminUsers || []).map((a) => [a.user_id, a.role]));

    const enriched = (users || []).map((u) => ({
      ...u,
      role: adminRoleMap.get(u.id) || u.type || 'USER',
    }));

    return NextResponse.json({ users: enriched });
  } catch (error: any) {
    if (error.message === 'Unauthorized' || error.message === 'Forbidden') {
      return NextResponse.json({ error: error.message }, { status: 401 });
    }
    return NextResponse.json({ error: error?.message || 'Something went wrong' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get('token')?.value;
    if (!token) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const decoded = await verifyToken(token);
    if (!decoded?.userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const supabase = getSupabaseAdminClient();

    const { data: requesterAdmin } = await supabase
      .from('admin_users')
      .select('role')
      .eq('user_id', decoded.userId)
      .single();

    const requesterRole = requesterAdmin?.role;
    if (!canManageUsers(requesterRole)) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const body = await request.json();
    const name = (body?.name || '').trim();
    const email = (body?.email || '').trim().toLowerCase();
    const password = body?.password || '';
    const role = body?.role;

    if (!name) return NextResponse.json({ error: 'Name is required' }, { status: 400 });
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json({ error: 'A valid email is required' }, { status: 400 });
    }
    if (!password || password.length < 8) {
      return NextResponse.json({ error: 'Password must be at least 8 characters' }, { status: 400 });
    }
    if (!role || !isValidRole(role)) {
      return NextResponse.json({ error: 'Invalid role' }, { status: 400 });
    }

    const assignableRoles = getAssignableRoles(requesterRole);
    if (!assignableRoles.includes(role)) {
      return NextResponse.json(
        { error: `You can only assign roles: ${assignableRoles.join(', ')}` },
        { status: 403 }
      );
    }

    const { data: { users: existingAuthUsers } } = await supabase.auth.admin.listUsers();
    if (existingAuthUsers?.some((u: { email?: string | null }) => u.email?.toLowerCase() === email)) {
      return NextResponse.json({ error: 'A user with this email already exists' }, { status: 409 });
    }

    const { data: authUser, error: createError } = await supabase.auth.admin.createUser({
      email,
      password,
      email_confirm: true,
      user_metadata: { name },
    });
    if (createError) throw createError;
    if (!authUser?.user) throw new Error('Failed to create user');

    const userId = authUser.user.id;

    await ensurePublicUserRecord({ id: userId, email, name });

    const { error: typeError } = await supabase
      .from('users')
      .update({ type: role })
      .eq('id', userId);
    if (typeError) throw typeError;

    if (isAdminRole(role)) {
      const now = new Date().toISOString();
      const { error: adminInsertError } = await supabase.from('admin_users').insert({
        id: crypto.randomUUID(),
        user_id: userId,
        role,
        created_by: decoded.userId,
        created_at: now,
        updated_at: now,
      });
      if (adminInsertError) throw adminInsertError;
    }

    return NextResponse.json(
      { message: 'User created', user: { id: userId, email, name, role } },
      { status: 201 }
    );
  } catch (error: any) {
    if (error.message === 'Unauthorized' || error.message === 'Forbidden') {
      return NextResponse.json({ error: error.message }, { status: 403 });
    }
    return NextResponse.json({ error: error?.message || 'Failed to create user' }, { status: 500 });
  }
}
