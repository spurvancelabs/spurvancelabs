'use client'

import { useQuery } from '@tanstack/react-query'
import Link from 'next/link'

function StatCard({ label, value, icon, accent = 'blue' }: { label: string; value: string | number; icon: React.ReactNode; accent?: string }) {
  const colors = {
    blue: 'bg-blue-500/10 text-blue-400',
    emerald: 'bg-emerald-500/10 text-emerald-400',
    purple: 'bg-purple-500/10 text-purple-400',
    amber: 'bg-amber-500/10 text-amber-400',
    red: 'bg-red-500/10 text-red-400',
    cyan: 'bg-cyan-500/10 text-cyan-400',
  }
  const c = colors[accent as keyof typeof colors] || colors.blue
  return (
    <div className="rounded-2xl bg-zinc-900/60 border border-white/[0.06] p-5">
      <div className="flex items-center justify-between mb-3">
        <span className="text-gray-400 text-sm">{label}</span>
        <div className={`w-9 h-9 rounded-xl flex items-center justify-center ${c}`}>{icon}</div>
      </div>
      <p className="text-2xl font-bold text-white">{value}</p>
    </div>
  )
}

export default function InstructorDashboardPage() {
  const { data, isLoading } = useQuery({
    queryKey: ['instructor-stats'],
    queryFn: () => fetch('/api/lms/instructor/stats').then(r => r.json()),
  })

  if (isLoading) {
    return (
      <div className="flex justify-center py-20">
        <div className="w-8 h-8 border-2 border-amber-500 border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-white">Instructor Dashboard</h1>
        <p className="text-gray-400 mt-1">Your courses and performance at a glance</p>
      </div>

      {/* Pending Alert */}
      {data.pendingCourses > 0 && (
        <div className="rounded-2xl bg-amber-500/10 border border-amber-500/20 p-4 flex items-center gap-3">
          <svg className="w-5 h-5 text-amber-400 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" />
          </svg>
          <p className="text-amber-300 text-sm">
            You have <span className="font-semibold">{data.pendingCourses}</span> course{data.pendingCourses > 1 ? 's' : ''} awaiting admin approval.{' '}
            <Link href="/lms/instructor/courses" className="underline hover:text-amber-200">View pending</Link>
          </p>
        </div>
      )}

      {/* Quick Actions */}
      <div className="flex flex-wrap gap-3">
        <Link href="/lms/instructor/courses/new" className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-400 text-sm font-medium hover:bg-amber-500/20 transition-all">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.5v15m7.5-7.5h-15" /></svg>
          New Course
        </Link>
        <Link href="/lms/instructor/enrollments" className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-zinc-800 border border-white/[0.06] text-gray-300 text-sm font-medium hover:bg-zinc-700 transition-all">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z" /></svg>
          View Enrollments
        </Link>
        <Link href="/lms/instructor/profile" className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-zinc-800 border border-white/[0.06] text-gray-300 text-sm font-medium hover:bg-zinc-700 transition-all">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" /></svg>
          View Profile
        </Link>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard label="Total Courses" value={data.totalCourses} accent="blue" icon={<svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25" /></svg>} />
        <StatCard label="Published" value={data.publishedCourses} accent="emerald" icon={<svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12.75L11.25 15 15 9.75M21 12c0 1.268-.63 2.39-1.593 3.068a3.745 3.745 0 01-1.043 3.296 3.745 3.745 0 01-3.296 1.043A3.745 3.745 0 0112 21c-1.268 0-2.39-.63-3.068-1.593a3.746 3.746 0 01-3.296-1.043 3.745 3.745 0 01-1.043-3.296A3.745 3.745 0 013 12c0-1.268.63-2.39 1.593-3.068a3.745 3.745 0 011.043-3.296 3.746 3.746 0 013.296-1.043A3.746 3.746 0 0112 3c1.268 0 2.39.63 3.068 1.593a3.746 3.746 0 013.296 1.043 3.746 3.746 0 011.043 3.296A3.745 3.745 0 0121 12z" /></svg>} />
        <StatCard label="Total Enrollments" value={data.totalEnrollments} accent="purple" icon={<svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z" /></svg>} />
        <StatCard label="Active Students" value={data.activeEnrollments} accent="cyan" icon={<svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" /></svg>} />
        <StatCard label="Completions" value={data.completedEnrollments} accent="emerald" icon={<svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12.75L11.25 15 15 9.75M21 12c0 1.268-.63 2.39-1.593 3.068a3.745 3.745 0 01-1.043 3.296 3.745 3.745 0 01-3.296 1.043A3.745 3.745 0 0112 21c-1.268 0-2.39-.63-3.068-1.593a3.746 3.746 0 01-3.296-1.043 3.745 3.745 0 01-1.043-3.296A3.745 3.745 0 013 12c0-1.268.63-2.39 1.593-3.068a3.745 3.745 0 011.043-3.296 3.746 3.746 0 013.296-1.043A3.746 3.746 0 0112 3c1.268 0 2.39.63 3.068 1.593a3.746 3.746 0 013.296 1.043 3.746 3.746 0 011.043 3.296A3.745 3.745 0 0121 12z" /></svg>} />
        <StatCard label="Completion Rate" value={`${data.completionRate}%`} accent="amber" icon={<svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 013 19.875v-6.75zM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V8.625zM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V4.125z" /></svg>} />
        <StatCard label="Pending Approval" value={data.pendingCourses} accent="amber" icon={<svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>} />
      </div>

      {/* Two-column layout */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Recent Activity */}
        <div>
          <h2 className="text-lg font-semibold text-white mb-4">Recent Activity</h2>
          <div className="rounded-2xl bg-zinc-900/60 border border-white/[0.06] divide-y divide-white/[0.06]">
            {data.recentActivity?.length === 0 && (
              <p className="text-gray-500 text-sm p-6 text-center">No recent activity.</p>
            )}
            {data.recentActivity?.map((item: any, i: number) => (
              <div key={i} className="flex items-start gap-3 p-4">
                <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${
                  item.type === 'enrollment' ? 'bg-emerald-500/10 text-emerald-400' : 'bg-amber-500/10 text-amber-400'
                }`}>
                  {item.type === 'enrollment' ? (
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z" /></svg>
                  ) : (
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 00-.182.557l1.285 5.385a.562.562 0 01-.84.61l-4.725-2.885a.563.563 0 00-.586 0L6.982 20.54a.562.562 0 01-.84-.61l1.285-5.386a.562.562 0 00-.182-.557l-4.204-3.602a.563.563 0 01.321-.988l5.518-.442a.563.563 0 00.475-.345L11.48 3.5z" /></svg>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-gray-300">{item.message}</p>
                  <p className="text-xs text-gray-500 mt-0.5">{new Date(item.date).toLocaleDateString()}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Reviews */}
        <div>
          <h2 className="text-lg font-semibold text-white mb-4">Recent Reviews</h2>
          <div className="rounded-2xl bg-zinc-900/60 border border-white/[0.06] divide-y divide-white/[0.06]">
            {data.recentReviews?.length === 0 && (
              <p className="text-gray-500 text-sm p-6 text-center">No reviews yet.</p>
            )}
            {data.recentReviews?.map((review: any) => (
              <div key={review.id} className="p-4">
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-7 h-7 rounded-full bg-amber-500/10 flex items-center justify-center text-[10px] font-bold text-amber-400">
                    {(review.student?.name || review.student?.email || '?')[0].toUpperCase()}
                  </div>
                  <span className="text-sm text-gray-300">{review.student?.name || review.student?.email || 'Anonymous'}</span>
                  <span className="text-xs text-gray-500 ml-auto">{new Date(review.createdAt).toLocaleDateString()}</span>
                </div>
                <div className="flex items-center gap-0.5 mb-1">
                  {[1, 2, 3, 4, 5].map(star => (
                    <svg key={star} className={`w-3.5 h-3.5 ${star <= review.rating ? 'text-amber-400' : 'text-gray-600'}`} fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                  <span className="text-xs text-gray-500 ml-1">on {review.course?.title}</span>
                </div>
                {review.comment && (
                  <p className="text-sm text-gray-400 mt-1 line-clamp-2">{review.comment}</p>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Top Courses */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-white">Top Courses</h2>
          <Link href="/lms/instructor/courses" className="text-sm text-amber-400 hover:underline">View all</Link>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {data.topCourses?.length === 0 && (
            <p className="text-gray-500 text-sm col-span-full py-8 text-center">No courses yet.</p>
          )}
          {data.topCourses?.map((course: any) => (
            <Link
              key={course.id}
              href={`/lms/instructor/courses/${course.id}`}
              className="rounded-2xl bg-zinc-900/60 border border-white/[0.06] p-5 hover:border-amber-500/30 transition-all group"
            >
              <div className="flex items-start gap-3 mb-3">
                <div className="w-10 h-10 rounded-xl bg-zinc-800 flex items-center justify-center text-xs text-gray-500 shrink-0 overflow-hidden">
                  {course.thumbnail ? (
                    <img src={course.thumbnail} alt="" className="w-full h-full object-cover" />
                  ) : (
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25" /></svg>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-white font-medium text-sm truncate group-hover:text-amber-400 transition-colors">{course.title}</p>
                  <span className={`text-[10px] px-1.5 py-0.5 rounded-full ${
                    course.status === 'PUBLISHED' ? 'text-emerald-400 bg-emerald-500/10' :
                    course.status === 'DRAFT' ? 'text-gray-400 bg-gray-500/10' :
                    'text-amber-400 bg-amber-500/10'
                  }`}>{course.status}</span>
                </div>
              </div>
              <div className="flex items-center gap-3 text-xs text-gray-500">
                <span>{course.enrollmentCount} students</span>
                <span>{course.moduleCount} modules</span>
                {course.reviewCount > 0 && (
                  <span className="text-amber-400">★ {course.avgRating}</span>
                )}
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  )
}
