import { NextRequest, NextResponse } from 'next/server';
import { z, ZodError } from 'zod';
import { getSupabaseAdminClient } from '@/lib/supabase/server';
import { requireViewer, requireEditor } from '@/lib/lms/utils';

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

export async function GET() {
  try {
    await requireViewer();
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
  try {
    await requireEditor();
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
      .insert({
        id: crypto.randomUUID(),
        created_at: new Date().toISOString(),
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
      .select()
      .single();

    if (error) {
      console.error('Internship insert error:', JSON.stringify(error, null, 2));
      return NextResponse.json({ error: error.message || 'Failed to create internship', details: error }, { status: 500 });
    }
    return NextResponse.json({ internship: data }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: error?.message || 'Something went wrong' }, { status: 500 });
  }
}
