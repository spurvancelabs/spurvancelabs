import { NextRequest, NextResponse } from 'next/server';
import { getSupabaseAdminClient } from '@/lib/supabase/server';
import { requireViewer, requireEditor } from '@/lib/lms/utils';

export async function GET(request: NextRequest) {
  await requireViewer();
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

export async function POST(request: NextRequest) {
  await requireEditor();
  try {
    const supabase = getSupabaseAdminClient();
    const body = await request.json();
    const { type, job_id, internship_id, name, email, phone, status, interviewer_name, interview_date, ...rest } = body;

    if (!type || !['job', 'internship'].includes(type)) {
      return NextResponse.json({ error: 'Valid type (job or internship) is required' }, { status: 400 });
    }
    if (!name || !email) {
      return NextResponse.json({ error: 'Name and email are required' }, { status: 400 });
    }

    const table = type === 'job' ? 'job_applications' : 'internship_applications';
    const idField = type === 'job' ? 'job_id' : 'internship_id';

    const insertData: Record<string, any> = {
      ...rest,
      name,
      email,
      status: status || 'PENDING',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    if (phone) insertData.phone = phone;
    if (interviewer_name) insertData.interviewer_name = interviewer_name;
    if (interview_date) insertData.interview_date = interview_date;
    if (job_id) insertData[idField] = job_id;
    if (internship_id) insertData[idField] = internship_id;

    const { data, error } = await supabase.from(table).insert([insertData]).select().single();
    if (error) throw error;

    return NextResponse.json({ application: { ...data, applicationType: type } }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: error?.message || 'Something went wrong' }, { status: 500 });
  }
}
