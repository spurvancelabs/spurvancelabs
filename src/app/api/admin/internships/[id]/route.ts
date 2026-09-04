import { NextRequest, NextResponse } from 'next/server';
import { z, ZodError } from 'zod';
import { getSupabaseAdminClient } from '@/lib/supabase/server';
import { requireNanoEditor, requireAdmin } from '@/lib/lms/utils';

const internshipSchema = z.object({
  title: z.string().trim().min(1, 'Title is required'),
  department: z.string().trim().min(1, 'Department is required'),
  duration: z.string().trim().min(1, 'Duration is required'),
  location: z.string().trim().min(1, 'Location is required'),
  description: z.string().trim().min(1, 'Description is required'),
  stipend: z.string().optional().default(''),
  stipendAmount: z.number().int().nonnegative().nullable().optional().default(null),
  skills: z.array(z.string()).optional().default([]),
  icon: z.string().optional().default(''),
  status: z.enum(['ACTIVE', 'CLOSED', 'DRAFT']).optional().default('ACTIVE'),
}).strict();

export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    await requireNanoEditor();
    const { id } = await params;
    const supabase = getSupabaseAdminClient();
    const body = await request.json();

    let parsed;
    try {
      parsed = internshipSchema.parse(body);
    } catch (err) {
      if (err instanceof ZodError) {
        return NextResponse.json(
          { error: 'Validation failed', fields: err.flatten().fieldErrors },
          { status: 400 }
        );
      }
      throw err;
    }

    const { data, error } = await supabase
      .from('internships')
      .update({
        updated_at: new Date().toISOString(),
        title: parsed.title,
        department: parsed.department,
        duration: parsed.duration,
        location: parsed.location,
        stipend: parsed.stipend || null,
        stipendAmount: parsed.stipendAmount || null,
        skills: parsed.skills,
        description: parsed.description,
        icon: parsed.icon || null,
        status: parsed.status,
      })
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error('Internship update error:', JSON.stringify(error, null, 2));
      return NextResponse.json({ error: error.message || 'Failed to update internship' }, { status: 500 });
    }
    return NextResponse.json({ internship: data });
  } catch (error: any) {
    return NextResponse.json({ error: error?.message || 'Something went wrong' }, { status: 500 });
  }
}

export async function DELETE(_request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    await requireAdmin();
    const { id } = await params;
    const supabase = getSupabaseAdminClient();

    const { error } = await supabase
      .from('internships')
      .delete()
      .eq('id', id);

    if (error) {
      return NextResponse.json({ error: error.message || 'Failed to delete internship' }, { status: 500 });
    }
    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ error: error?.message || 'Something went wrong' }, { status: 500 });
  }
}
