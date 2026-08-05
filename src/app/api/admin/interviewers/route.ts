import { NextRequest, NextResponse } from 'next/server';
import { getSupabaseAdminClient } from '@/lib/supabase/server';
import { requireViewer, requireEditor } from '@/lib/lms/utils';

export async function GET() {
  try {
    await requireViewer();
    const supabase = getSupabaseAdminClient();
    const { data: interviewers, error } = await supabase
      .from('interviewers')
      .select('*')
      .order('name', { ascending: true });

    if (error) throw error;
    return NextResponse.json({ interviewers });
  } catch (error: any) {
    return NextResponse.json({ error: error?.message || 'Something went wrong' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    await requireEditor();
    const supabase = getSupabaseAdminClient();
    const body = await request.json();
    const { name } = body;

    if (!name || !name.trim()) {
      return NextResponse.json({ error: 'Name is required' }, { status: 400 });
    }

    const { data, error } = await supabase
      .from('interviewers')
      .insert({ name: name.trim() })
      .select()
      .single();

    if (error) throw error;
    return NextResponse.json({ interviewer: data });
  } catch (error: any) {
    return NextResponse.json({ error: error?.message || 'Something went wrong' }, { status: 500 });
  }
}
