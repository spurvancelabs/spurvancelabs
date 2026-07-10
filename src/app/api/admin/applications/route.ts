import { NextRequest, NextResponse } from 'next/server';
import { getSupabaseAdminClient } from '@/lib/supabase/server';
import { requireViewer, requireEditor } from '@/lib/lms/utils';

export async function GET(request: NextRequest) {
  try {
    await requireViewer();
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
  try {
    await requireEditor();
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

    const jobFields = ['current_company', 'current_position', 'years_of_experience', 'portfolio_url', 'salary_expectation', 'start_date'];
    const internshipFields = ['university', 'major', 'year_of_study', 'graduation_date', 'gpa', 'github_url', 'available_start_date', 'availability_duration'];
    const commonFields = ['linked_in_url', 'linkedin_url', 'resume_url', 'cover_letter', 'work_authorization', 'referral_source', 'additional_info'];

    const allowedFields = type === 'job'
      ? [...jobFields, ...commonFields]
      : [...internshipFields, ...commonFields];

    const insertData: Record<string, any> = {
      name,
      email,
      status: status || 'PENDING',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    for (const key of Object.keys(rest)) {
      if (allowedFields.includes(key)) {
        insertData[key] = rest[key];
      }
    }

    if (phone) insertData.phone = phone;
    if (interviewer_name) insertData.interviewer_name = interviewer_name;
    if (interview_date) insertData.interview_date = interview_date;
    if (job_id) insertData[idField] = job_id;
    if (internship_id) insertData[idField] = internship_id;

    const { data, error } = await supabase.from(table).insert([insertData]).select().single();
    if (error) {
      console.error('Application insert error:', JSON.stringify(error, null, 2));
      throw error;
    }

    return NextResponse.json({ application: { ...data, applicationType: type } }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: error?.message || 'Something went wrong' }, { status: 500 });
  }
}
