import { NextRequest, NextResponse } from 'next/server';
import { getSupabaseAdminClient } from '@/lib/supabase/server';
import { requireViewer, requireNanoEditor, requireAdmin } from '@/lib/lms/utils';
import { normalizeDateInput } from '@/lib/dates';

export async function GET(_request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    await requireViewer();
    const { id } = await params;
    const { searchParams } = new URL(_request.url);
    const type = searchParams.get('type') || 'job';
    const supabase = getSupabaseAdminClient();

    let data: any = null;

    if (type === 'job') {
      const { data: jobApp } = await supabase
        .from('job_applications')
        .select('*, jobs(title)')
        .eq('id', id)
        .single();
      if (jobApp) data = { ...jobApp, applicationType: 'job', postingTitle: jobApp.jobs?.title };
    } else {
      const { data: internApp } = await supabase
        .from('internship_applications')
        .select('*, internships(title)')
        .eq('id', id)
        .single();
      if (internApp) data = { ...internApp, applicationType: 'internship', postingTitle: internApp.internships?.title };
    }

    if (!data) return NextResponse.json({ error: 'Not found' }, { status: 404 });
    return NextResponse.json({ application: data });
  } catch (error: any) {
    return NextResponse.json({ error: error?.message || 'Something went wrong' }, { status: 500 });
  }
}

export async function PATCH(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    await requireNanoEditor();
    const { id } = await params;
    const supabase = getSupabaseAdminClient();
    const body = await request.json();
    const { status, type, interviewer_name } = body;

    if (!type) {
      return NextResponse.json({ error: 'type is required' }, { status: 400 });
    }

    const table = type === 'job' ? 'job_applications' : 'internship_applications';

    const updateData: Record<string, any> = { updated_at: new Date().toISOString() };
    if (status) updateData.status = status;
    if (interviewer_name !== undefined) updateData.interviewer_name = interviewer_name;

    const commonFields = ['name', 'email', 'phone', 'linkedin_url', 'work_authorization', 'referral_source', 'additional_info', 'cover_letter'];
    const jobFields = ['current_company', 'current_position', 'years_of_experience', 'portfolio_url', 'salary_expectation'];
    const internshipFields = ['university', 'major', 'year_of_study', 'gpa', 'github_url', 'availability_duration'];
    const typeFields = type === 'job' ? jobFields : internshipFields;

    for (const key of [...commonFields, ...typeFields]) {
      if (body[key] !== undefined) updateData[key] = body[key];
    }

    const commonDateFields = ['interview_date'];
    const jobDateFields = ['start_date'];
    const internshipDateFields = ['graduation_date', 'available_start_date'];
    const dateFields = [...commonDateFields, ...(type === 'job' ? jobDateFields : internshipDateFields)];
    for (const key of dateFields) {
      if (body[key] !== undefined) {
        const normalized = normalizeDateInput(body[key]);
        updateData[key] = normalized ?? null;
      }
    }

    if (body.interviewer_feedback !== undefined) updateData.interviewer_feedback = body.interviewer_feedback;

    const { data, error } = await supabase
      .from(table)
      .update(updateData)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      return NextResponse.json({ error: error.message || 'Failed to update application' }, { status: 500 });
    }
    return NextResponse.json({ application: data });
  } catch (error: any) {
    return NextResponse.json({ error: error?.message || 'Something went wrong' }, { status: 500 });
  }
}

export async function DELETE(_request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    await requireAdmin();
    const { id } = await params;
    const { searchParams } = new URL(_request.url);
    const type = searchParams.get('type') || 'job';

    const supabase = getSupabaseAdminClient();
    const table = type === 'job' ? 'job_applications' : 'internship_applications';

    const { error } = await supabase
      .from(table)
      .delete()
      .eq('id', id);

    if (error) throw error;
    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ error: error?.message || 'Something went wrong' }, { status: 500 });
  }
}
