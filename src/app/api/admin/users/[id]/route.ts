import { NextRequest, NextResponse } from 'next/server';
import { getSupabaseAdminClient } from '@/lib/supabase/server';
import { cookies } from 'next/headers';
import { verifyToken, generateAccessToken, generateRefreshToken } from '@/lib/auth';
import { ROLES, isValidRole, isAdminRole, roleLevel } from '@/lib/lms/roles';
import { getAssignableRoles, canManageUsers, canManageAdmins } from '@/lib/lms/permissions';

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

    const { data: requesterAdmin } = await supabase
      .from('admin_users')
      .select('role')
      .eq('user_id', decoded.userId)
      .single();

    const requesterRole = requesterAdmin?.role;

    if (!canManageUsers(requesterRole)) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const { id } = await params;
    const body = await request.json();
    const { role, name, email } = body;

    if (id === decoded.userId) {
      return NextResponse.json({ error: 'Cannot change your own account.' }, { status: 400 });
    }

    if (name !== undefined || email !== undefined) {
      if (name !== undefined) {
        await supabase.from('users').update({ name }).eq('id', id);
      }
      if (email !== undefined) {
        await supabase.auth.admin.updateUserById(id, { email });
      }
      return NextResponse.json({ message: 'User updated' });
    }

    if (!role || !isValidRole(role)) {
      return NextResponse.json(
        { error: 'Invalid role' },
        { status: 400 }
      );
    }

    const assignableRoles = getAssignableRoles(requesterRole);
    if (!assignableRoles.includes(role)) {
      return NextResponse.json(
        { error: `You can only assign roles: ${assignableRoles.join(', ')}` },
        { status: 403 }
      );
    }

    const isNewAdmin = isAdminRole(role);

    if (isNewAdmin) {
      const { data: existingAdmin } = await supabase
        .from('admin_users')
        .select('id')
        .eq('user_id', id)
        .single();

      if (existingAdmin) {
        const { error: updateError } = await supabase
          .from('admin_users')
          .update({ role, updated_at: new Date().toISOString() })
          .eq('user_id', id);

        if (updateError) throw updateError;
      } else {
        const { error: insertError } = await supabase
          .from('admin_users')
          .insert({
            user_id: id,
            role,
            created_by: decoded.userId,
          });

        if (insertError) throw insertError;
      }
    } else {
      await supabase
        .from('admin_users')
        .delete()
        .eq('user_id', id);
    }

    if (!isNewAdmin) {
      const { error: updateUserError } = await supabase
        .from('users')
        .update({ type: role })
        .eq('id', id);

      if (updateUserError) throw updateUserError;
    }

    return NextResponse.json({
      message: `Role updated to ${role}`,
      user: { id, role },
    });
  } catch (error: any) {
    if (error.message === 'Unauthorized' || error.message === 'Forbidden') {
      return NextResponse.json({ error: error.message }, { status: 403 });
    }
    return NextResponse.json({ error: error?.message || 'Something went wrong' }, { status: 500 });
  }
}

export async function DELETE(
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

    const { data: requesterAdmin } = await supabase
      .from('admin_users')
      .select('role')
      .eq('user_id', decoded.userId)
      .single();

    if (!canManageUsers(requesterAdmin?.role)) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const { id } = await params;

    if (id === decoded.userId) {
      return NextResponse.json({ error: 'Cannot delete your own account.' }, { status: 400 });
    }

    await supabase.from('admin_users').delete().eq('user_id', id);
    await supabase.from('users').delete().eq('id', id);
    await supabase.auth.admin.deleteUser(id);

    return NextResponse.json({ message: 'User deleted' });
  } catch (error: any) {
    if (error.message === 'Unauthorized' || error.message === 'Forbidden') {
      return NextResponse.json({ error: error.message }, { status: 403 });
    }
    return NextResponse.json({ error: error?.message || 'Something went wrong' }, { status: 500 });
  }
}
