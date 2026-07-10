import { NextResponse } from 'next/server';
import { getSupabaseAdminClient } from '@/lib/supabase/server';
import { requireViewer } from '@/lib/lms/utils';

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

    const adminSet = new Set((adminUsers || []).map((a) => a.user_id));

    const nonAdminUsers = (users || []).filter((u) => !adminSet.has(u.id));

    const enriched = nonAdminUsers.map((u) => ({
      ...u,
      role: u.type || 'USER',
    }));

    return NextResponse.json({ users: enriched });
  } catch (error: any) {
    if (error.message === 'Unauthorized' || error.message === 'Forbidden') {
      return NextResponse.json({ error: error.message }, { status: 401 });
    }
    return NextResponse.json({ error: error?.message || 'Something went wrong' }, { status: 500 });
  }
}
