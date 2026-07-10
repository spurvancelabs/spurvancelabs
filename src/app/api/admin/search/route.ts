import { NextRequest, NextResponse } from 'next/server';
import { getSupabaseAdminClient } from '@/lib/supabase/server';
import { requireViewer } from '@/lib/lms/utils';

export async function GET(request: NextRequest) {
  try {
    await requireViewer();
    const q = request.nextUrl.searchParams.get('q');
    if (!q) {
      return NextResponse.json({ results: [] });
    }

    const supabase = getSupabaseAdminClient();

    const [jobsResult, internshipsResult, applicationsResult] = await Promise.all([
      supabase
        .from('jobs')
        .select('id, title')
        .ilike('title', `%${q}%`)
        .limit(5),
      supabase
        .from('internships')
        .select('id, title')
        .ilike('title', `%${q}%`)
        .limit(5),
      supabase
        .from('applications')
        .select('id, name')
        .ilike('name', `%${q}%`)
        .limit(5),
    ]);

    const results: { id: string; title: string; type: string }[] = [];

    if (jobsResult.data) {
      for (const item of jobsResult.data) {
        results.push({ id: item.id, title: item.title, type: 'job' });
      }
    }

    if (internshipsResult.data) {
      for (const item of internshipsResult.data) {
        results.push({ id: item.id, title: item.title, type: 'internship' });
      }
    }

    if (applicationsResult.data) {
      for (const item of applicationsResult.data) {
        results.push({ id: item.id, title: item.name, type: 'application' });
      }
    }

    return NextResponse.json({ results });
  } catch (error: any) {
    return NextResponse.json({ error: error?.message || 'Something went wrong' }, { status: 500 });
  }
}
