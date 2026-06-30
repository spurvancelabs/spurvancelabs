import { NextResponse } from 'next/server';
import { getSupabaseAdminClient } from '@/lib/supabase/server';

export async function GET() {
  try {
    const supabase = getSupabaseAdminClient();

    const [{ count: totalJobs }, { count: totalInternships }, { data: jobs }] = await Promise.all([
      supabase.from('jobs').select('*', { count: 'exact', head: true }),
      supabase.from('internships').select('*', { count: 'exact', head: true }),
      supabase.from('jobs').select('id, title, department, status'),
    ]);

    const { data: authData, error: authErr } = await supabase.auth.admin.listUsers({ perPage: 10000 });
    if (authErr) {
      console.error('Failed to fetch auth users:', authErr);
    }
    const totalUsers = authData?.users?.length || 0;

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

    const usersByMonthMap: Record<string, number> = {};
    (authData?.users ?? [])
      .sort((a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime())
      .forEach(u => {
        if (u.created_at) {
          const month = new Date(u.created_at).toISOString().slice(0, 7);
          usersByMonthMap[month] = (usersByMonthMap[month] || 0) + 1;
        }
      });
    const usersByMonth = Object.entries(usersByMonthMap).map(([month, count]) => ({ month, count }));

    const appsByMonthMap: Record<string, number> = {};
    allApplications.forEach(a => {
      const month = new Date(a.created_at).toISOString().slice(0, 7);
      appsByMonthMap[month] = (appsByMonthMap[month] || 0) + 1;
    });
    const applicationsByMonth = Object.entries(appsByMonthMap).map(([month, count]) => ({ month, count }));

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
