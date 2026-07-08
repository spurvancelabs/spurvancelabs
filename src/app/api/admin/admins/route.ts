import { NextRequest, NextResponse } from 'next/server';
import { getSupabaseAdminClient } from '@/lib/supabase/server';
import { requireSuperAdmin } from '@/lib/lms/utils';
import { ROLES } from '@/lib/lms/roles';

export async function GET() {
  try {
    await requireSuperAdmin();

    const supabase = getSupabaseAdminClient();
    const { data: adminData, error } = await supabase
      .from('admin_users')
      .select('id, user_id, role, created_by, created_at, updated_at')
      .order('created_at', { ascending: false });

    if (error) throw error;

    const userIds = (adminData || []).map((a: any) => a.user_id);
    const { data: usersData } = await supabase
      .from('users')
      .select('id, email, name')
      .in('id', userIds.length > 0 ? userIds : ['00000000-0000-0000-0000-000000000000']);

    const userMap = new Map((usersData || []).map((u: any) => [u.id, u]));

    const admins = (adminData || []).map((a: any) => {
      const user = userMap.get(a.user_id) || {};
      return {
        id: a.id,
        user_id: a.user_id,
        role: a.role?.trim() || a.role,
        created_by: a.created_by,
        created_at: a.created_at,
        updated_at: a.updated_at,
        email: user.email || '',
        name: user.name || null,
      };
    });

    return NextResponse.json({ admins });
  } catch (error: any) {
    if (error.message === 'Unauthorized' || error.message === 'Forbidden') {
      return NextResponse.json({ error: error.message }, { status: 401 });
    }
    return NextResponse.json({ error: error?.message || 'Something went wrong' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    await requireSuperAdmin();

    const { email, password, role } = await request.json();
    if (!email) {
      return NextResponse.json({ error: 'Email is required' }, { status: 400 });
    }

    const newRole = role || ROLES.ADMIN;
    if (![ROLES.SUPER_ADMIN, ROLES.ADMIN, ROLES.EDITOR, ROLES.NANO_EDITOR, ROLES.VIEWER].includes(newRole)) {
      return NextResponse.json({ error: 'Invalid admin role' }, { status: 400 });
    }

    const supabase = getSupabaseAdminClient();

    const { data: existingUser, error: userError } = await supabase
      .from('users')
      .select('id')
      .eq('email', email)
      .single();

    let userId: string;

    if (!existingUser) {
      if (!password || password.length < 6) {
        return NextResponse.json({ error: 'Password required (min 6 chars) for new users' }, { status: 400 });
      }

      const { data: authUser, error: createError } = await supabase.auth.admin.createUser({
        email,
        password,
        email_confirm: true,
        user_metadata: { name: email.split('@')[0], type: 'USER' },
      });

      if (createError) throw createError;
      if (!authUser?.user) throw new Error('Failed to create user');

      userId = authUser.user.id;
    } else {
      userId = existingUser.id;
    }

    const { data: existingAdmin } = await supabase
      .from('admin_users')
      .select('id')
      .eq('user_id', userId)
      .single();

    if (existingAdmin) {
      return NextResponse.json({ error: 'User is already an admin' }, { status: 409 });
    }

    const { error: insertError } = await supabase.from('admin_users').insert({
      user_id: userId,
      role: newRole,
    });

    if (insertError) throw insertError;

    return NextResponse.json({
      message: `${email} added as ${newRole}${!existingUser ? ' — password set' : ''}`,
    }, { status: 201 });
  } catch (error: any) {
    if (error.message === 'Unauthorized' || error.message === 'Forbidden') {
      return NextResponse.json({ error: error.message }, { status: 401 });
    }
    return NextResponse.json({ error: error?.message || 'Something went wrong' }, { status: 500 });
  }
}
