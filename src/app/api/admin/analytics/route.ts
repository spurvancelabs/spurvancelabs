import { NextResponse } from 'next/server';
import { getSupabaseAdminClient } from '@/lib/supabase/server';

export async function GET() {
  try {
    const supabase = getSupabaseAdminClient();

    const [
      { count: totalJobs },
      { count: totalInternships },
      { data: jobs },
      { data: internships },
      { data: jobApps },
      { data: internApps },
    ] = await Promise.all([
      supabase.from('jobs').select('*', { count: 'exact', head: true }),
      supabase.from('internships').select('*', { count: 'exact', head: true }),
      supabase.from('jobs').select('id, title, department, type, status, created_at, salary_min, salary_max').order('created_at', { ascending: false }),
      supabase.from('internships').select('id, title, department, duration, status, created_at').order('created_at', { ascending: false }),
      supabase.from('job_applications').select('id, status, created_at'),
      supabase.from('internship_applications').select('id, status, created_at'),
    ]);

    console.log('Analytics jobs data:', JSON.stringify(jobs?.slice(0, 3)));
    console.log('Analytics totalJobs:', totalJobs);

    const { data: authData, error: authErr } = await supabase.auth.admin.listUsers({ perPage: 10000 });
    if (authErr) {
      console.error('Failed to fetch auth users:', authErr);
    }
    const totalUsers = authData?.users?.length || 0;
    const users = authData?.users ?? [];

    const totalApplications = (jobApps?.length || 0) + (internApps?.length || 0);

    const allApplications = [
      ...(jobApps?.map(a => ({ ...a, type: 'job' })) || []),
      ...(internApps?.map(a => ({ ...a, type: 'internship' })) || []),
    ];

    // Application status breakdown
    const statusCounts: Record<string, number> = {};
    allApplications.forEach(a => { statusCounts[a.status] = (statusCounts[a.status] || 0) + 1; });
    const applicationsByStatus = Object.entries(statusCounts).map(([status, count]) => ({ status, count }));

    // Jobs by department
    const deptCounts: Record<string, number> = {};
    jobs?.forEach(j => {
      if (j.department) {
        deptCounts[j.department] = (deptCounts[j.department] || 0) + 1;
      }
    });
    const jobsByDepartment = Object.entries(deptCounts).map(([department, count]) => ({ department, count }));

    // Users by month
    const usersByMonthMap: Record<string, number> = {};
    users?.forEach(u => {
      if (u.created_at) {
        const month = new Date(u.created_at).toISOString().slice(0, 7);
        usersByMonthMap[month] = (usersByMonthMap[month] || 0) + 1;
      }
    });
    const usersByMonth = Object.entries(usersByMonthMap).map(([month, count]) => ({ month, count }));

    // Applications by month
    const appsByMonthMap: Record<string, number> = {};
    allApplications.forEach(a => {
      const month = new Date(a.created_at).toISOString().slice(0, 7);
      appsByMonthMap[month] = (appsByMonthMap[month] || 0) + 1;
    });
    const applicationsByMonth = Object.entries(appsByMonthMap).map(([month, count]) => ({ month, count }));

    // Job types distribution
    const typeCounts: Record<string, number> = {};
    jobs?.forEach(j => {
      if (j.type) {
        typeCounts[j.type] = (typeCounts[j.type] || 0) + 1;
      }
    });
    const jobsByType = Object.entries(typeCounts).map(([type, count]) => ({ type, count }));

    // Active vs closed jobs
    const activeJobs = jobs?.filter(j => j.status === 'ACTIVE').length || 0;
    const closedJobs = jobs?.filter(j => j.status === 'CLOSED').length || 0;
    const draftJobs = jobs?.filter(j => j.status === 'DRAFT').length || 0;

    // Active vs closed internships
    const activeInternships = internships?.filter(i => i.status === 'ACTIVE').length || 0;
    const closedInternships = internships?.filter(i => i.status === 'CLOSED').length || 0;

    // Applications per job/internship
    const appsPerJob = totalJobs ? (totalApplications / totalJobs).toFixed(1) : '0';

    // User growth rate (this month vs last month)
    const now = new Date();
    const thisMonth = now.toISOString().slice(0, 7);
    const lastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1).toISOString().slice(0, 7);
    const usersThisMonth = users?.filter(u => u.created_at?.startsWith(thisMonth)).length || 0;
    const usersLastMonth = users?.filter(u => u.created_at?.startsWith(lastMonth)).length || 0;
    const userGrowthRate = usersLastMonth ? Math.round(((usersThisMonth - usersLastMonth) / usersLastMonth) * 100) : 0;

    // App growth rate
    const appsThisMonth = allApplications.filter(a => a.created_at?.startsWith(thisMonth)).length;
    const appsLastMonth = allApplications.filter(a => a.created_at?.startsWith(lastMonth)).length;
    const appGrowthRate = appsLastMonth ? Math.round(((appsThisMonth - appsLastMonth) / appsLastMonth) * 100) : 0;

    // Conversion rate (applications with specific statuses)
    const reviewed = statusCounts['REVIEWED'] || 0;
    const shortlisted = statusCounts['SHORTLISTED'] || 0;
    const conversionRate = totalApplications ? Math.round(((reviewed + shortlisted) / totalApplications) * 100) : 0;

    return NextResponse.json({
      totalJobs: totalJobs || 0,
      totalInternships: totalInternships || 0,
      totalApplications,
      totalUsers: totalUsers || 0,
      activeJobs,
      closedJobs,
      draftJobs,
      activeInternships,
      closedInternships,
      appsPerJob: parseFloat(appsPerJob),
      userGrowthRate,
      appGrowthRate,
      conversionRate,
      jobsByDepartment,
      jobsByType,
      applicationsByStatus,
      usersByMonth: [...usersByMonth].slice(-12),
      applicationsByMonth: [...applicationsByMonth].slice(-12),
    });
  } catch (error: any) {
    return NextResponse.json({ error: error?.message || 'Something went wrong' }, { status: 500 });
  }
}
