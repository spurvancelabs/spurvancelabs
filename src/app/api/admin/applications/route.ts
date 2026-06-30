import { NextRequest, NextResponse } from 'next/server';
import { getSupabaseAdminClient } from '@/lib/supabase/server';

export async function GET(request: NextRequest) {
  try {
    const supabase = getSupabaseAdminClient();
    const searchParams = request.nextUrl.searchParams;
    const type = searchParams.get('type');
    const status = searchParams.get('status');
    const jobId = searchParams.get('jobId');
    const internshipId = searchParams.get('internshipId');

    let result: any[] = [];

    if (!type || type === 'job') {
      let query = supabase
        .from('job_applications')
        .select('*, jobs!inner(title)')
        .order('created_at', { ascending: false });

      if (status) query = query.eq('status', status);
      if (jobId) query = query.eq('job_id', jobId);

      const { data } = await query;
      if (data) {
        result.push(...data.map(a => ({ ...a, applicationType: 'job', postingTitle: a.jobs?.title })));
      }
    }

    if (!type || type === 'internship') {
      let query = supabase
        .from('internship_applications')
        .select('*, internships!inner(title)')
        .order('created_at', { ascending: false });

      if (status) query = query.eq('status', status);
      if (internshipId) query = query.eq('internship_id', internshipId);

      const { data } = await query;
      if (data) {
        result.push(...data.map(a => ({ ...a, applicationType: 'internship', postingTitle: a.internships?.title })));
      }
    }

    result.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());

    return NextResponse.json({ applications: result });
  } catch (error: any) {
    return NextResponse.json({ error: error?.message || 'Something went wrong' }, { status: 500 });
  }
}
