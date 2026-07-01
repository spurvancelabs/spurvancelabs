import { NextRequest, NextResponse } from 'next/server';
import { getSupabaseAdminClient } from '@/lib/supabase/server';

export async function GET(request: NextRequest) {
  try {
    const supabase = getSupabaseAdminClient();
    const searchParams = request.nextUrl.searchParams;
    const type = searchParams.get('type');
    const status = searchParams.get('status');
    const jobId = searchParams.get('jobId');
    const internshipId = searchParams.get('internshipId');

    let result: any[] = [];

    if (!type || type === 'job') {
      let query = supabase
        .from('job_applications')
        .select('*, jobs!inner(title)')
        .order('created_at', { ascending: false });
      if (status) query = query.eq('status', status);
      if (jobId) query = query.eq('job_id', jobId);
      const { data } = await query;
      if (data) {
        result.push(...data.map(a => ({ ...a, applicationType: 'job', postingTitle: a.jobs?.title })));
      }
    }

    if (!type || type === 'internship') {
      let query = supabase
        .from('internship_applications')
        .select('*, internships!inner(title)')
        .order('created_at', { ascending: false });
      if (status) query = query.eq('status', status);
      if (internshipId) query = query.eq('internship_id', internshipId);
      const { data } = await query;
      if (data) {
        result.push(...data.map(a => ({ ...a, applicationType: 'internship', postingTitle: a.internships?.title })));
      }
    }

    result.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());

    const headers = [
      'ID', 'Type', 'Name', 'Email', 'Phone', 'Status',
      'Applied For', 'Interviewer', 'Interview Date',
      'Created At', 'Updated At',
    ];

    const csvRows = [headers.join(',')];

    for (const app of result) {
      const row = [
        app.id,
        app.applicationType,
        escapeCsv(app.name),
        escapeCsv(app.email),
        escapeCsv(app.phone || ''),
        app.status,
        escapeCsv(app.postingTitle || ''),
        escapeCsv(app.interviewer_name || ''),
        app.interview_date ? app.interview_date.split('T')[0] : '',
        app.created_at ? app.created_at.split('T')[0] : '',
        app.updated_at ? app.updated_at.split('T')[0] : '',
      ];
      csvRows.push(row.join(','));
    }

    return new NextResponse(csvRows.join('\n'), {
      headers: {
        'Content-Type': 'text/csv',
        'Content-Disposition': `attachment; filename="applications-${new Date().toISOString().split('T')[0]}.csv"`,
      },
    });
  } catch (error: any) {
    return NextResponse.json({ error: error?.message || 'Something went wrong' }, { status: 500 });
  }
}

function escapeCsv(value: string): string {
  if (value.includes(',') || value.includes('"') || value.includes('\n')) {
    return `"${value.replace(/"/g, '""')}"`;
  }
  return value;
}
