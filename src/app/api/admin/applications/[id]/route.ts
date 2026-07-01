import { NextRequest, NextResponse } from 'next/server';
import { getSupabaseAdminClient } from '@/lib/supabase/server';

export async function GET(_request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const { searchParams } = new URL(_request.url);
    const type = searchParams.get('type') || 'job';
    const supabase = getSupabaseAdminClient();

    let data: any = null;

    if (type === 'job') {
      const { data: jobApp } = await supabase
        .from('job_applications')
        .select('*, jobs!inner(title)')
        .eq('id', id)
        .single();
      if (jobApp) data = { ...jobApp, applicationType: 'job', postingTitle: jobApp.jobs?.title };
    } else {
      const { data: internApp } = await supabase
        .from('internship_applications')
        .select('*, internships!inner(title)')
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
    const { id } = await params;
    const supabase = getSupabaseAdminClient();
    const body = await request.json();
    const { status, type, interviewer_name, interview_date } = body;

    if (!type) {
      return NextResponse.json({ error: 'type is required' }, { status: 400 });
    }

    const table = type === 'job' ? 'job_applications' : 'internship_applications';

    const updateData: Record<string, any> = { updated_at: new Date().toISOString() };
    if (status) updateData.status = status;
    if (interviewer_name !== undefined) updateData.interviewer_name = interviewer_name;
    if (interview_date !== undefined) updateData.interview_date = interview_date;
    if (body.interviewer_feedback !== undefined) updateData.interviewer_feedback = body.interviewer_feedback;
    if (body.name !== undefined) updateData.name = body.name;
    if (body.email !== undefined) updateData.email = body.email;
    if (body.phone !== undefined) updateData.phone = body.phone;
    if (body.current_company !== undefined) updateData.current_company = body.current_company;
    if (body.current_position !== undefined) updateData.current_position = body.current_position;
    if (body.years_of_experience !== undefined) updateData.years_of_experience = body.years_of_experience;
    if (body.linkedin_url !== undefined) updateData.linkedin_url = body.linkedin_url;
    if (body.portfolio_url !== undefined) updateData.portfolio_url = body.portfolio_url;
    if (body.salary_expectation !== undefined) updateData.salary_expectation = body.salary_expectation;
    if (body.start_date !== undefined) updateData.start_date = body.start_date;
    if (body.work_authorization !== undefined) updateData.work_authorization = body.work_authorization;
    if (body.referral_source !== undefined) updateData.referral_source = body.referral_source;
    if (body.additional_info !== undefined) updateData.additional_info = body.additional_info;
    if (body.university !== undefined) updateData.university = body.university;
    if (body.major !== undefined) updateData.major = body.major;
    if (body.year_of_study !== undefined) updateData.year_of_study = body.year_of_study;
    if (body.graduation_date !== undefined) updateData.graduation_date = body.graduation_date;
    if (body.gpa !== undefined) updateData.gpa = body.gpa;
    if (body.github_url !== undefined) updateData.github_url = body.github_url;
    if (body.available_start_date !== undefined) updateData.available_start_date = body.available_start_date;
    if (body.availability_duration !== undefined) updateData.availability_duration = body.availability_duration;
    if (body.cover_letter !== undefined) updateData.cover_letter = body.cover_letter;

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
