import { NextRequest, NextResponse } from 'next/server';
import { getSupabaseAdminClient } from '@/lib/supabase/server';

export async function GET() {
  try {
    const supabase = getSupabaseAdminClient();
    const { data: jobs, error } = await supabase
      .from('jobs')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
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
    return NextResponse.json({ error: error?.message || 'Something went wrong' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const supabase = getSupabaseAdminClient();
    const body = await request.json();

    const { data, error } = await supabase
      .from('jobs')
      .insert({
        id: crypto.randomUUID(),
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        title: body.title,
        department: body.department,
        type: body.type,
        location: body.location,
        salary: body.salary || null,
        salary_min: body.salaryMin || null,
        salary_max: body.salaryMax || null,
        skills: body.skills || [],
        description: body.description,
        icon: body.icon || null,
        status: body.status || 'ACTIVE',
      })
      .select()
      .single();

    if (error) {
      return NextResponse.json({ error: error.message || 'Failed to create job' }, { status: 500 });
    }
    return NextResponse.json({ job: data }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: error?.message || 'Something went wrong' }, { status: 500 });
  }
}
