import { NextRequest, NextResponse } from 'next/server';
import { getSupabaseAdminClient } from '@/lib/supabase/server';
import { requireNanoEditor, requireAdmin } from '@/lib/lms/utils';

export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    try {
      await requireNanoEditor();
    } catch (authError: any) {
      return NextResponse.json({ error: authError.message }, { status: authError.message === 'Unauthorized' ? 401 : 403 });
    }
    const { id } = await params;
    const supabase = getSupabaseAdminClient();
    const body = await request.json();

    const required = ['title', 'department', 'type', 'location', 'description'] as const;
    for (const field of required) {
      if (!body[field] || typeof body[field] !== 'string' || !body[field].trim()) {
        return NextResponse.json({ error: `Field "${field}" is required` }, { status: 400 });
      }
    }

    const { data, error } = await supabase
      .from('jobs')
      .update({
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
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error('Job update error:', JSON.stringify(error, null, 2));
      return NextResponse.json({ error: error.message || 'Failed to update job' }, { status: 500 });
    }
    return NextResponse.json({ job: data });
  } catch (error: any) {
    console.error('Unexpected error updating job:', error);
    return NextResponse.json({ error: error?.message || 'Something went wrong' }, { status: 500 });
  }
}

export async function DELETE(_request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    try {
      await requireAdmin();
    } catch (authError: any) {
      return NextResponse.json({ error: authError.message }, { status: authError.message === 'Unauthorized' ? 401 : 403 });
    }
    const { id } = await params;
    const supabase = getSupabaseAdminClient();

    const { error } = await supabase
      .from('jobs')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Job delete error:', JSON.stringify(error, null, 2));
      return NextResponse.json({ error: error.message || 'Failed to delete job' }, { status: 500 });
    }
    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error('Unexpected error deleting job:', error);
    return NextResponse.json({ error: error?.message || 'Something went wrong' }, { status: 500 });
  }
}
