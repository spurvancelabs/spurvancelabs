'use client'

import { useQuery } from '@tanstack/react-query'
import Link from 'next/link'
import { getRoleColor, getRoleLabel } from '@/lib/lms/roles'

function StatCard({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="rounded-2xl bg-zinc-900/60 border border-white/[0.06] p-5 text-center hover:border-amber-500/30 transition-all">
      <p className="text-3xl font-bold text-white mb-1">{value}</p>
      <p className="text-gray-400 text-sm">{label}</p>
    </div>
  )
}

export default function InstructorProfilePage() {
  const { data, isLoading } = useQuery({
    queryKey: ['instructor-profile'],
    queryFn: () => fetch('/api/lms/instructor/profile').then(r => r.json()),
  })

  if (isLoading) {
    return (
      <div className="flex justify-center py-20">
        <div className="w-8 h-8 border-2 border-amber-500 border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  if (!data) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 text-center text-gray-500">
        <p>Please log in to view your profile.</p>
      </div>
    )
  }

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Profile Header */}
      <div className="rounded-2xl bg-zinc-900/60 border border-white/[0.06] p-6 sm:p-8 mb-8">
        <div className="flex items-center gap-6">
          <div className="w-16 h-16 rounded-full bg-amber-500/10 flex items-center justify-center text-2xl font-bold text-amber-400">
            {(data.name || data.email || '?')[0].toUpperCase()}
          </div>
          <div>
            <h1 className="text-2xl font-bold text-white">{data.name || 'Instructor'}</h1>
            <p className="text-gray-400 text-sm mt-1">{data.email}</p>
            <span className={`inline-block mt-2 text-[10px] px-2 py-0.5 rounded-full border ${getRoleColor(data.role)}`}>{getRoleLabel(data.role)}</span>
          </div>
        </div>
      </div>

      {/* Stats */}
      <h2 className="text-lg font-semibold text-white mb-4">Instructor Stats</h2>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
        <StatCard label="Courses" value={data.stats?.totalCourses ?? 0} />
        <StatCard label="Students" value={data.stats?.totalStudents ?? 0} />
        <StatCard label="Enrollments" value={data.stats?.totalEnrollments ?? 0} />
        <StatCard label="Avg Rating" value={data.stats?.avgRating ? Number(data.stats.avgRating).toFixed(1) : '—'} />
      </div>

      {/* Courses */}
      <h2 className="text-lg font-semibold text-white mb-4">Your Courses ({data.courses?.length ?? 0})</h2>
      <div className="space-y-3 mb-8">
        {data.courses?.length === 0 && (
          <p className="text-gray-500 text-sm py-8 text-center">No courses yet. <Link href="/lms/instructor/courses/new" className="text-amber-400 hover:underline">Create your first course</Link></p>
        )}
        {data.courses?.map((course: any) => (
          <Link
            key={course.id}
            href={`/lms/instructor/courses/${course.id}`}
            className="block rounded-2xl bg-zinc-900/60 border border-white/[0.06] p-4 hover:border-amber-500/30 transition-all"
          >
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-zinc-800 flex items-center justify-center text-xs text-gray-500 shrink-0 overflow-hidden">
                {course.thumbnail ? (
                  <img src={course.thumbnail} alt="" className="w-full h-full object-cover" />
                ) : (
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25" />
                  </svg>
                )}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-white font-medium text-sm truncate">{course.title}</p>
                <p className="text-gray-500 text-xs mt-0.5">
                  {course._count?.modules ?? 0} modules &middot; {course._count?.enrollments ?? 0} students
                  {course.level && <span> &middot; {course.level}</span>}
                </p>
              </div>
              <span className={`text-[10px] px-2 py-0.5 rounded-full border ${
                course.status === 'PUBLISHED' ? 'text-emerald-400 border-emerald-500/30 bg-emerald-500/10' :
                course.status === 'DRAFT' ? 'text-gray-400 border-gray-500/30 bg-gray-500/10' :
                course.status === 'PENDING' ? 'text-amber-400 border-amber-500/30 bg-amber-500/10' :
                'text-red-400 border-red-500/30 bg-red-500/10'
              }`}>
                {course.status === 'PUBLISHED' ? 'Published' :
                 course.status === 'DRAFT' ? 'Draft' :
                 course.status === 'PENDING' ? 'Pending' : 'Archived'}
              </span>
            </div>
          </Link>
        ))}
      </div>

      {/* Quick Links */}
      <h2 className="text-lg font-semibold text-white mb-4">Quick Links</h2>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Link href="/lms/instructor/dashboard" className="rounded-2xl bg-zinc-900/60 border border-white/[0.06] p-5 hover:border-amber-500/30 transition-all flex items-center gap-4">
          <div className="w-10 h-10 rounded-xl bg-amber-500/10 flex items-center justify-center">
            <svg className="w-5 h-5 text-amber-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3.75 6A2.25 2.25 0 016 3.75h2.25A2.25 2.25 0 0110.5 6v2.25a2.25 2.25 0 01-2.25 2.25H6a2.25 2.25 0 01-2.25-2.25V6zM3.75 15.75A2.25 2.25 0 016 13.5h2.25a2.25 2.25 0 012.25 2.25V18a2.25 2.25 0 01-2.25 2.25H6A2.25 2.25 0 013.75 18v-2.25zM13.5 6a2.25 2.25 0 012.25-2.25H18A2.25 2.25 0 0120.25 6v2.25A2.25 2.25 0 0118 10.5h-2.25a2.25 2.25 0 01-2.25-2.25V6zM13.5 15.75a2.25 2.25 0 012.25-2.25H18a2.25 2.25 0 012.25 2.25V18A2.25 2.25 0 0118 20.25h-2.25A2.25 2.25 0 0113.5 18v-2.25z" /></svg>
          </div>
          <div>
            <p className="text-white font-medium text-sm">Dashboard</p>
            <p className="text-gray-500 text-xs mt-0.5">View your stats</p>
          </div>
        </Link>
        <Link href="/lms/instructor/courses" className="rounded-2xl bg-zinc-900/60 border border-white/[0.06] p-5 hover:border-amber-500/30 transition-all flex items-center gap-4">
          <div className="w-10 h-10 rounded-xl bg-amber-500/10 flex items-center justify-center">
            <svg className="w-5 h-5 text-amber-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25" /></svg>
          </div>
          <div>
            <p className="text-white font-medium text-sm">Manage Courses</p>
            <p className="text-gray-500 text-xs mt-0.5">Create & edit courses</p>
          </div>
        </Link>
        <Link href="/lms/instructor/enrollments" className="rounded-2xl bg-zinc-900/60 border border-white/[0.06] p-5 hover:border-amber-500/30 transition-all flex items-center gap-4">
          <div className="w-10 h-10 rounded-xl bg-amber-500/10 flex items-center justify-center">
            <svg className="w-5 h-5 text-amber-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z" /></svg>
          </div>
          <div>
            <p className="text-white font-medium text-sm">Enrollments</p>
            <p className="text-gray-500 text-xs mt-0.5">View student enrollments</p>
          </div>
        </Link>
      </div>
    </div>
  )
}
