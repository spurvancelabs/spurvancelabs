import { NextResponse } from 'next/server';
import { getSupabaseAdminClient } from '@/lib/supabase/server';

export async function GET() {
  try {
    const supabase = getSupabaseAdminClient();
    const { data: users, error } = await supabase
      .from('users')
      .select('id, email, role, created_at')
      .order('created_at', { ascending: false });

    if (error) throw error;

    return NextResponse.json({ users });
  } catch (error: any) {
    return NextResponse.json({ error: error?.message || 'Something went wrong' }, { status: 500 });
  }
}
