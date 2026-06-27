import { NextRequest, NextResponse } from 'next/server';
import { getSupabaseAdminClient } from '@/lib/supabase/server';

export async function GET(request: NextRequest) {
  try {
    const supabase = getSupabaseAdminClient();

    const searchParams = request.nextUrl.searchParams;
    const department = searchParams.get('department');
    const status = searchParams.get('status') || 'ACTIVE';

    let query = supabase
      .from('internships')
      .select('*')
      .eq('status', status)
      .order('created_at', { ascending: false });

    if (department) {
      query = query.eq('department', department);
    }

    const { data: internships, error } = await query;

    if (error) {
      console.error('Error fetching internships:', error);
      return NextResponse.json({ error: 'Failed to fetch internships' }, { status: 500 });
    }

    return NextResponse.json({ internships });
  } catch (error) {
    console.error('Error fetching internships:', error);
    return NextResponse.json({ error: 'Failed to fetch internships' }, { status: 500 });
  }
}
