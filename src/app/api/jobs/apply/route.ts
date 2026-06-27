import { NextRequest, NextResponse } from 'next/server';
import { getSupabaseAdminClient } from '@/lib/supabase/server';
import { randomUUID } from 'crypto';

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();

    const jobId = formData.get('jobId') as string;
    const name = formData.get('name') as string;
    const email = formData.get('email') as string;
    const phone = formData.get('phone') as string | null;
    const currentCompany = formData.get('currentCompany') as string | null;
    const currentPosition = formData.get('currentPosition') as string | null;
    const yearsOfExperience = formData.get('yearsOfExperience') as string | null;
    const linkedInUrl = formData.get('linkedInUrl') as string | null;
    const portfolioUrl = formData.get('portfolioUrl') as string | null;
    const coverLetter = formData.get('coverLetter') as string | null;
    const salaryExpectation = formData.get('salaryExpectation') as string | null;
    const startDate = formData.get('startDate') as string | null;
    const workAuthorization = formData.get('workAuthorization') as string | null;
    const referralSource = formData.get('referralSource') as string | null;
    const additionalInfo = formData.get('additionalInfo') as string | null;
    const file = formData.get('resume') as File | null;

    if (!jobId || !name || !email) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const supabase = getSupabaseAdminClient();
    let resumeUrl: string | null = null;

    if (file && file.size > 0) {
      const fileExt = file.name.split('.').pop();
      const fileName = `${Date.now()}_${Math.random().toString(36).substring(2)}.${fileExt}`;
      const buffer = Buffer.from(await file.arrayBuffer());

      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('resumes')
        .upload(fileName, buffer, {
          contentType: file.type,
          upsert: false,
        });

      if (uploadError) {
        return NextResponse.json({ error: uploadError.message || 'Failed to upload resume' }, { status: 500 });
      }

      const { data: publicUrlData } = supabase.storage
        .from('resumes')
        .getPublicUrl(fileName);

      resumeUrl = publicUrlData.publicUrl;
    }

    const { data, error } = await supabase
      .from('job_applications')
      .insert({
        id: crypto.randomUUID(),
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        job_id: jobId,
        name,
        email,
        phone: phone || null,
        current_company: currentCompany || null,
        current_position: currentPosition || null,
        years_of_experience: yearsOfExperience || null,
        linkedin_url: linkedInUrl || null,
        portfolio_url: portfolioUrl || null,
        resume_url: resumeUrl,
        cover_letter: coverLetter || null,
        salary_expectation: salaryExpectation || null,
        start_date: startDate ? new Date(startDate).toISOString() : null,
        work_authorization: workAuthorization || null,
        referral_source: referralSource || null,
        additional_info: additionalInfo || null,
        status: 'PENDING',
      })
      .select()
      .single();

    if (error) {
      return NextResponse.json({ error: error.message || 'Failed to submit application' }, { status: 500 });
    }

    return NextResponse.json({ success: true, application: data }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: error?.message || error?.toString() || 'Failed to submit application' }, { status: 500 });
  }
}
