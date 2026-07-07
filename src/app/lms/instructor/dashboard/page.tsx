'use client'

import { useQuery } from '@tanstack/react-query'
import Link from 'next/link'
import { useState } from 'react'

function StatCard({ label, value, icon }: { label: string; value: string | number; icon: React.ReactNode }) {
  return (
    <div className="rounded-2xl bg-zinc-900/60 border border-white/[0.06] p-5">
      <div className="flex items-center justify-between mb-3">
        <span className="text-gray-400 text-sm">{label}</span>
        <div className="w-9 h-9 rounded-xl bg-blue-500/10 flex items-center justify-center">{icon}</div>
      </div>
      <p className="text-2xl font-bold text-white">{value}</p>
    </div>
  )
}

export default function InstructorDashboardPage() {
  const [tab, setTab] = useState<'overview' | 'courses'>('overview')

  const { data, isLoading } = useQuery({
    queryKey: ['instructor-stats'],
    queryFn: () => fetch('/api/lms/instructor/stats').then(r => r.json()),
  })

  if (isLoading) {
    return (
      <div className="flex justify-center py-20">
        <div className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white">Instructor Dashboard</h1>
        <p className="text-gray-400 mt-1">Your courses and performance at a glance</p>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-1 mb-8 bg-zinc-900/60 rounded-xl p-1 border border-white/[0.06] w-fit">
        <button onClick={() => setTab('overview')} className={`px-4 py-2 text-sm rounded-lg transition-all ${tab === 'overview' ? 'bg-blue-600 text-white' : 'text-gray-400 hover:text-white'}`}>Overview</button>
        <button onClick={() => setTab('courses')} className={`px-4 py-2 text-sm rounded-lg transition-all ${tab === 'courses' ? 'bg-blue-600 text-white' : 'text-gray-400 hover:text-white'}`}>Courses</button>
      </div>

      {tab === 'overview' && (
        <>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            <StatCard label="Total Courses" value={data.totalCourses} icon={<svg className="w-4 h-4 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25" /></svg>} />
            <StatCard label="Published" value={data.publishedCourses} icon={<svg className="w-4 h-4 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12.75L11.25 15 15 9.75M21 12c0 1.268-.63 2.39-1.593 3.068a3.745 3.745 0 01-1.043 3.296 3.745 3.745 0 01-3.296 1.043A3.745 3.745 0 0112 21c-1.268 0-2.39-.63-3.068-1.593a3.746 3.746 0 01-3.296-1.043 3.745 3.745 0 01-1.043-3.296A3.745 3.745 0 013 12c0-1.268.63-2.39 1.593-3.068a3.745 3.745 0 011.043-3.296 3.746 3.746 0 013.296-1.043A3.746 3.746 0 0112 3c1.268 0 2.39.63 3.068 1.593a3.746 3.746 0 013.296 1.043 3.746 3.746 0 011.043 3.296A3.745 3.745 0 0121 12z" /></svg>} />
            <StatCard label="Enrollments" value={data.totalEnrollments} icon={<svg className="w-4 h-4 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z" /></svg>} />

          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <StatCard label="Active Enrollments" value={data.activeEnrollments} icon={<svg className="w-4 h-4 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" /></svg>} />
            <StatCard label="Completions" value={data.completedEnrollments} icon={<svg className="w-4 h-4 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12.75L11.25 15 15 9.75M21 12c0 1.268-.63 2.39-1.593 3.068a3.745 3.745 0 01-1.043 3.296 3.745 3.745 0 01-3.296 1.043A3.745 3.745 0 0112 21c-1.268 0-2.39-.63-3.068-1.593a3.746 3.746 0 01-3.296-1.043 3.745 3.745 0 01-1.043-3.296A3.745 3.745 0 013 12c0-1.268.63-2.39 1.593-3.068a3.745 3.745 0 011.043-3.296 3.746 3.746 0 013.296-1.043A3.746 3.746 0 0112 3c1.268 0 2.39.63 3.068 1.593a3.746 3.746 0 013.296 1.043 3.746 3.746 0 011.043 3.296A3.745 3.745 0 0121 12z" /></svg>} />
          </div>
        </>
      )}

      {tab === 'courses' && (
        <div className="space-y-4">
          {data.courses?.map((course: any) => {
            const rating = data.avgRatings?.find((r: any) => r.courseId === course.id)
            return (
              <Link
                key={course.id}
                href={`/lms/instructor/courses/${course.id}`}
                className="block rounded-2xl bg-zinc-900/60 border border-white/[0.06] p-5 hover:border-amber-500/30 transition-all"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1 min-w-0">
                    <h3 className="text-white font-semibold truncate">{course.title}</h3>
                    <div className="flex flex-wrap items-center gap-3 mt-2 text-xs text-gray-500">
                      <span className={`px-2 py-0.5 rounded-full ${
                        course.status === 'PUBLISHED' ? 'text-emerald-400 bg-emerald-500/10' :
                        course.status === 'DRAFT' ? 'text-yellow-400 bg-yellow-500/10' : 'text-gray-400 bg-gray-500/10'
                      }`}>{course.status}</span>
                      <span>{course._count.modules} modules</span>
                      <span>{course._count.enrollments} students</span>
                      {rating && <span>★ {rating.avgRating} ({rating.count})</span>}
                    </div>
                  </div>
                </div>
              </Link>
            )
          })}
          {!data.courses?.length && (
            <p className="text-gray-500 text-center py-10">You haven&apos;t created any courses yet.</p>
          )}
        </div>
      )}
    </div>
  )
}
