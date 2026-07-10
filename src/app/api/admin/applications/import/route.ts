import { NextRequest, NextResponse } from 'next/server';
import { getSupabaseAdminClient } from '@/lib/supabase/server';
import { parse } from 'csv-parse/sync';
import { requireEditor } from '@/lib/lms/utils';

const VALID_STATUSES = ['PENDING', 'REVIEWED', 'SHORTLISTED', 'REJECTED', 'ACCEPTED'];

export async function POST(request: NextRequest) {
  try {
    await requireEditor();
    const formData = await request.formData();
    const file = formData.get('file') as File | null;
    if (!file) {
      return NextResponse.json({ error: 'No file uploaded' }, { status: 400 });
    }

    const text = await file.text();
    const records: any[] = parse(text, {
      columns: true,
      skip_empty_lines: true,
      trim: true,
    });

    const supabase = getSupabaseAdminClient();
    const results: { name: string; email: string; status: string; error?: string }[] = [];

    for (const record of records) {
      const type = (record.Type || '').toLowerCase();
      if (!['job', 'internship'].includes(type)) {
        results.push({ name: record.Name || '?', email: record.Email || '?', status: 'skipped', error: 'Invalid type (must be job or internship)' });
        continue;
      }

      const table = type === 'job' ? 'job_applications' : 'internship_applications';
      const titleField = type === 'job' ? 'job_title' : 'internship_title';
      const titleValue = record['Applied For'] || record[titleField];

      let postingId: string | null = null;
      if (titleValue) {
        const foreignTable = type === 'job' ? 'jobs' : 'internships';
        const trimmed = titleValue.trim();
        const { data: posting, error: fetchErr } = await supabase
          .from(foreignTable)
          .select('id, title')
          .ilike('title', trimmed)
          .maybeSingle();
        if (fetchErr) {
          console.error('Fetch posting error:', JSON.stringify(fetchErr, null, 2));
        }
        if (posting) {
          postingId = posting.id;
        } else {
          const { data: allPostings } = await supabase.from(foreignTable).select('id, title');
          console.error(`No match for "${trimmed}". Available ${foreignTable}:`, JSON.stringify(allPostings?.map((p: any) => p.title)));
        }
      }

      const idField = type === 'job' ? 'job_id' : 'internship_id';

      const now = new Date().toISOString();
      const insertData: Record<string, any> = {
        name: record.Name || 'Unknown',
        email: record.Email || 'unknown@example.com',
        status: VALID_STATUSES.includes(record.Status) ? record.Status : 'PENDING',
        created_at: now,
        updated_at: now,
      };

      if (postingId) {
        insertData[idField] = postingId;
      } else {
        results.push({ name: record.Name, email: record.Email, status: 'error', error: `Could not find matching ${type === 'job' ? 'job' : 'internship'}: "${titleValue || '(none)'}"` });
        continue;
      }
      if (record.Phone) insertData.phone = record.Phone;
      if (record.Interviewer) insertData.interviewer_name = record.Interviewer;
      if (record['Interview Date']) insertData.interview_date = record['Interview Date'];

      if (type === 'internship') {
        insertData.university = record.University || record.university || 'Not specified';
        insertData.major = record.Major || record.major || 'Not specified';
        insertData.year_of_study = record['Year of Study'] || record.year_of_study || 'Not specified';
      }

      const { error } = await supabase.from(table).insert([insertData]);
      if (error) {
        console.error('Import insert error:', JSON.stringify(error, null, 2));
        results.push({ name: record.Name, email: record.Email, status: 'error', error: error.message });
      } else {
        results.push({ name: record.Name, email: record.Email, status: 'imported' });
      }
    }

    return NextResponse.json({
      imported: results.filter(r => r.status === 'imported').length,
      skipped: results.filter(r => r.status === 'skipped').length,
      errors: results.filter(r => r.status === 'error').length,
      results,
    });
  } catch (error: any) {
    return NextResponse.json({ error: error?.message || 'Something went wrong' }, { status: 500 });
  }
}
