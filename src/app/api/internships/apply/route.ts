import { NextRequest, NextResponse } from 'next/server';
import { getSupabaseAdminClient } from '@/lib/supabase/server';

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();

    const internshipId = formData.get('internshipId') as string;
    const name = formData.get('name') as string;
    const email = formData.get('email') as string;
    const phone = formData.get('phone') as string | null;
    const university = formData.get('university') as string;
    const major = formData.get('major') as string;
    const yearOfStudy = formData.get('yearOfStudy') as string;
    const graduationDate = formData.get('graduationDate') as string | null;
    const gpa = formData.get('gpa') as string | null;
    const linkedInUrl = formData.get('linkedInUrl') as string | null;
    const githubUrl = formData.get('githubUrl') as string | null;
    const coverLetter = formData.get('coverLetter') as string | null;
    const availableStartDate = formData.get('availableStartDate') as string | null;
    const availabilityDuration = formData.get('availabilityDuration') as string | null;
    const workAuthorization = formData.get('workAuthorization') as string | null;
    const referralSource = formData.get('referralSource') as string | null;
    const additionalInfo = formData.get('additionalInfo') as string | null;
    const file = formData.get('resume') as File | null;

    if (!internshipId || !name || !email || !university || !major || !yearOfStudy) {
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
      .from('internship_applications')
      .insert({
        id: crypto.randomUUID(),
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        internship_id: internshipId,
        name,
        email,
        phone: phone || null,
        university,
        major,
        year_of_study: yearOfStudy,
        graduation_date: graduationDate ? new Date(graduationDate).toISOString() : null,
        gpa: gpa || null,
        linkedin_url: linkedInUrl || null,
        github_url: githubUrl || null,
        resume_url: resumeUrl,
        cover_letter: coverLetter || null,
        available_start_date: availableStartDate ? new Date(availableStartDate).toISOString() : null,
        availability_duration: availabilityDuration || null,
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
