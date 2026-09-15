import { NextRequest, NextResponse } from 'next/server';
import { getSupabaseAdminClient } from '@/lib/supabase/server';
import { requireViewer, requireEditor } from '@/lib/lms/utils';

export async function GET() {
  try {
    try {
      await requireViewer();
    } catch (authError: any) {
      return NextResponse.json({ error: authError.message }, { status: authError.message === 'Unauthorized' ? 401 : 403 });
    }

    const supabase = getSupabaseAdminClient();
    const { data: jobs, error } = await supabase
      .from('jobs')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Failed to fetch jobs:', JSON.stringify(error, null, 2));
      return NextResponse.json({ error: 'Failed to fetch jobs' }, { status: 500 });
    }

    const { data: appCounts } = await supabase
      .from('job_applications')
      .select('job_id');

    const countMap: Record<string, number> = {};
    if (appCounts) {
      for (const app of appCounts) {
        countMap[app.job_id] = (countMap[app.job_id] || 0) + 1;
      }
    }

    const jobsWithCounts = jobs?.map(job => ({
      ...job,
      applicationCount: countMap[job.id] || 0,
    }));

    return NextResponse.json({ jobs: jobsWithCounts });
  } catch (error: any) {
    console.error('Unexpected error fetching jobs:', error);
    return NextResponse.json({ error: error?.message || 'Something went wrong' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    let user: Awaited<ReturnType<typeof requireEditor>>;
    try {
      user = await requireEditor();
    } catch (authError: any) {
      return NextResponse.json({ error: authError.message }, { status: authError.message === 'Unauthorized' ? 401 : 403 });
    }

    const body = await request.json();

    const required = ['title', 'department', 'type', 'location', 'description'] as const;
    for (const field of required) {
      if (!body[field] || typeof body[field] !== 'string' || !body[field].trim()) {
        return NextResponse.json({ error: `Field "${field}" is required` }, { status: 400 });
      }
    }

    const supabase = getSupabaseAdminClient();
    const { data, error } = await supabase
      .from('jobs')
      .insert({
        id: crypto.randomUUID(),
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        title: body.title.trim(),
        department: body.department.trim(),
        type: body.type.trim(),
        location: body.location.trim(),
        salary: body.salary?.trim() || null,
        salaryMin: body.salaryMin ?? null,
        salaryMax: body.salaryMax ?? null,
        skills: Array.isArray(body.skills) ? body.skills : [],
        description: body.description.trim(),
        icon: body.icon?.trim() || null,
        status: body.status || 'ACTIVE',
      })
      .select()
      .single();

    if (error) {
      console.error('Job insert error:', JSON.stringify(error, null, 2));
      return NextResponse.json({ error: error.message || 'Failed to create job' }, { status: 500 });
    }
    return NextResponse.json({ job: data }, { status: 201 });
  } catch (error: any) {
    console.error('Unexpected error creating job:', error);
    return NextResponse.json({ error: error?.message || 'Something went wrong' }, { status: 500 });
  }
}
