import { NextRequest, NextResponse } from 'next/server';
import { getSupabaseAdminClient } from '@/lib/supabase/server';

export async function PATCH(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const supabase = getSupabaseAdminClient();
    const body = await request.json();
    const { status, type } = body;

    if (!status || !type) {
      return NextResponse.json({ error: 'status and type are required' }, { status: 400 });
    }

    const table = type === 'job' ? 'job_applications' : 'internship_applications';
    const idColumn = type === 'job' ? 'job_applications' : 'internship_applications';

    const { data, error } = await supabase
      .from(table)
      .update({ status, updated_at: new Date().toISOString() })
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
