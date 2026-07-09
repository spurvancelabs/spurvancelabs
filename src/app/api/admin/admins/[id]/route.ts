import { NextRequest, NextResponse } from 'next/server';
import { getSupabaseAdminClient } from '@/lib/supabase/server';
import { requireSuperAdmin } from '@/lib/lms/utils';
import { ROLES } from '@/lib/lms/roles';

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await requireSuperAdmin();
    const { id } = await params;
    const { role } = await request.json();

    if (!role || ![ROLES.SUPER_ADMIN, ROLES.ADMIN, ROLES.EDITOR, ROLES.NANO_EDITOR, ROLES.VIEWER].includes(role)) {
      return NextResponse.json({ error: 'Invalid admin role' }, { status: 400 });
    }

    const supabase = getSupabaseAdminClient();
    const { error } = await supabase
      .from('admin_users')
      .update({ role, updated_at: new Date().toISOString() })
      .eq('id', id);

    if (error) throw error;

    return NextResponse.json({ message: `Role updated to ${role}` });
  } catch (error: any) {
    if (error.message === 'Unauthorized' || error.message === 'Forbidden') {
      return NextResponse.json({ error: error.message }, { status: 401 });
    }
    return NextResponse.json({ error: error?.message || 'Something went wrong' }, { status: 500 });
  }
}

export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await requireSuperAdmin();
    const { id } = await params;

    const supabase = getSupabaseAdminClient();
    const { error } = await supabase.from('admin_users').delete().eq('id', id);

    if (error) throw error;

    return NextResponse.json({ message: 'Admin removed' });
  } catch (error: any) {
    if (error.message === 'Unauthorized' || error.message === 'Forbidden') {
      return NextResponse.json({ error: error.message }, { status: 401 });
    }
    return NextResponse.json({ error: error?.message || 'Something went wrong' }, { status: 500 });
  }
}
