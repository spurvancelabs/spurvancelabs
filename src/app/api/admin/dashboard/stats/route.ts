import { NextRequest, NextResponse } from 'next/server';
import { getSupabaseAdminClient } from '@/lib/supabase/server';
import { requireViewer } from '@/lib/lms/utils';

export async function GET(request: NextRequest) {
  await requireViewer();
  try {
    const supabase = getSupabaseAdminClient();
    const period = request.nextUrl.searchParams.get('period') || 'monthly';

    const [{ count: totalJobs }, { count: totalInternships }, { data: jobs }] = await Promise.all([
      supabase.from('jobs').select('*', { count: 'exact', head: true }),
      supabase.from('internships').select('*', { count: 'exact', head: true }),
      supabase.from('jobs').select('id, title, department, status'),
    ]);

    let totalUsers = 0;
    const { data: authData, error: authErr } = await supabase.auth.admin.listUsers({ page: 1, perPage: 10000 });
    if (authErr) {
      console.error('Failed to fetch auth users:', authErr);
      const { count } = await supabase.from('users').select('*', { count: 'exact', head: true });
      totalUsers = count || 0;
    } else {
      totalUsers = authData?.users?.length || 0;
    }

    const { data: jobApps, error: jaErr } = await supabase
      .from('job_applications')
      .select('id, status, created_at');
    const { data: internApps, error: iaErr } = await supabase
      .from('internship_applications')
      .select('id, status, created_at');

    if (jaErr || iaErr) {
      return NextResponse.json({ error: 'Failed to fetch data' }, { status: 500 });
    }

    const totalApplications = (jobApps?.length || 0) + (internApps?.length || 0);

    const allApplications = [
      ...(jobApps?.map(a => ({ ...a, type: 'job' })) || []),
      ...(internApps?.map(a => ({ ...a, type: 'internship' })) || []),
    ];

    const statusCounts: Record<string, number> = {};
    allApplications.forEach(a => {
      statusCounts[a.status] = (statusCounts[a.status] || 0) + 1;
    });
    const applicationsByStatus = Object.entries(statusCounts).map(([status, count]) => ({ status, count }));

    const deptCounts: Record<string, number> = {};
    jobs?.forEach(j => {
      if (j.department) {
        deptCounts[j.department] = (deptCounts[j.department] || 0) + 1;
      }
    });
    const jobsByDepartment = Object.entries(deptCounts).map(([department, count]) => ({ department, count }));

    function getPeriodKey(dateStr: string, period: string): string {
      const d = new Date(dateStr);
      if (period === 'daily') return d.toISOString().split('T')[0];
      if (period === 'weekly') {
        const start = new Date(d);
        start.setDate(d.getDate() - d.getDay());
        return start.toISOString().split('T')[0];
      }
      return d.toISOString().slice(0, 7);
    }

    function generatePeriodLabels(period: string): string[] {
      const now = new Date();
      const labels: string[] = [];
      if (period === 'daily') {
        for (let i = 29; i >= 0; i--) {
          const d = new Date(now); d.setDate(d.getDate() - i);
          labels.push(d.toISOString().split('T')[0]);
        }
      } else if (period === 'weekly') {
        for (let i = 11; i >= 0; i--) {
          const d = new Date(now); d.setDate(d.getDate() - d.getDay() - i * 7);
          labels.push(d.toISOString().split('T')[0]);
        }
      } else {
        for (let i = 11; i >= 0; i--) {
          const d = new Date(now); d.setMonth(d.getMonth() - i);
          labels.push(d.toISOString().slice(0, 7));
        }
      }
      return labels;
    }

    const labelMap: Record<string, number> = {};
    const labels = generatePeriodLabels(period);
    for (const l of labels) labelMap[l] = 0;
    for (const u of authData?.users || []) {
      if (u.created_at) {
        const key = getPeriodKey(u.created_at, period);
        if (key in labelMap) labelMap[key]++;
      }
    }
    const usersByMonth = labels.map(month => ({ month, count: labelMap[month] }));

    const appsLabelMap: Record<string, number> = {};
    for (const l of labels) appsLabelMap[l] = 0;
    allApplications.forEach(a => {
      const key = getPeriodKey(a.created_at, period);
      if (key in appsLabelMap) appsLabelMap[key]++;
    });
    const applicationsByMonth = labels.map(month => ({ month, count: appsLabelMap[month] }));

    const recentApplications = allApplications
      .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
      .slice(0, 10);

    return NextResponse.json({
      totalJobs: totalJobs || 0,
      totalInternships: totalInternships || 0,
      totalApplications,
      totalUsers: totalUsers || 0,
      jobs: jobs || [],
      jobsByDepartment,
      applicationsByStatus,
      usersByMonth,
      applicationsByMonth,
      recentApplications,
    });
  } catch (error: any) {
    return NextResponse.json({ error: error?.message || 'Something went wrong' }, { status: 500 });
  }
}
