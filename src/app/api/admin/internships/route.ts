import { NextRequest, NextResponse } from 'next/server';
import { getSupabaseAdminClient } from '@/lib/supabase/server';
import { requireViewer, requireEditor } from '@/lib/lms/utils';

export async function GET() {
  await requireViewer();
  try {
    const supabase = getSupabaseAdminClient();
    const { data: internships, error } = await supabase
      .from('internships')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      return NextResponse.json({ error: 'Failed to fetch internships' }, { status: 500 });
    }

    const { data: appCounts } = await supabase
      .from('internship_applications')
      .select('internship_id');

    const countMap: Record<string, number> = {};
    if (appCounts) {
      for (const app of appCounts) {
        countMap[app.internship_id] = (countMap[app.internship_id] || 0) + 1;
      }
    }

    const internshipsWithCounts = internships?.map(internship => ({
      ...internship,
      applicationCount: countMap[internship.id] || 0,
    }));

    return NextResponse.json({ internships: internshipsWithCounts });
  } catch (error: any) {
    return NextResponse.json({ error: error?.message || 'Something went wrong' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  await requireEditor();
  try {
    const supabase = getSupabaseAdminClient();
    const body = await request.json();

    const { data, error } = await supabase
      .from('internships')
      .insert({
        id: crypto.randomUUID(),
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        title: body.title,
        department: body.department,
        duration: body.duration,
        location: body.location,
        stipend: body.stipend || null,
        stipend_amount: body.stipendAmount || null,
        skills: body.skills || [],
        description: body.description,
        icon: body.icon || null,
        status: body.status || 'ACTIVE',
      })
      .select()
      .single();

    if (error) {
      return NextResponse.json({ error: error.message || 'Failed to create internship' }, { status: 500 });
    }
    return NextResponse.json({ internship: data }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: error?.message || 'Something went wrong' }, { status: 500 });
  }
}
