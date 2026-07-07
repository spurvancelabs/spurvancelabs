import { NextRequest, NextResponse } from 'next/server';
import { getSupabaseAdminClient } from '@/lib/supabase/server';
import { cookies } from 'next/headers';
import { verifyToken } from '@/lib/auth';
import { ROLES, isValidRole } from '@/lib/lms/roles';

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get('token')?.value;
    if (!token) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const decoded = await verifyToken(token);
    if (!decoded?.userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const supabase = getSupabaseAdminClient();

    const { data: requester } = await supabase
      .from('users')
      .select('role')
      .eq('id', decoded.userId)
      .single();

    if (requester?.role !== ROLES.ADMIN) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const { id } = await params;

    const { role } = await request.json();
    if (!role || !isValidRole(role)) {
      return NextResponse.json({ error: 'Invalid role. Must be USER, INSTRUCTOR, or ADMIN' }, { status: 400 });
    }

    if (id === decoded.userId) {
      return NextResponse.json({ error: 'Cannot change your own role. Ask another admin.' }, { status: 400 });
    }

    const { data: targetUser } = await supabase
      .from('users')
      .select('id, email, role')
      .eq('id', id)
      .single();

    if (!targetUser) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    const { error: updateError } = await supabase
      .from('users')
      .update({ role })
      .eq('id', id);

    if (updateError) throw updateError;

    return NextResponse.json({
      message: `Role updated to ${role}`,
      user: { id: targetUser.id, email: targetUser.email, role },
    });
  } catch (error: any) {
    return NextResponse.json({ error: error?.message || 'Something went wrong' }, { status: 500 });
  }
}
