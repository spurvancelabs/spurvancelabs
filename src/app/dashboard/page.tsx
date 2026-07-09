'use client'

import { useQuery } from '@tanstack/react-query'
import Link from 'next/link'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Header from '@/components/Partials/Header'
import { ROLES } from '@/lib/lms/roles'
import "@/global.css"

export default function DashboardPage() {
  const router = useRouter()
  const [tab, setTab] = useState<'all' | 'in-progress' | 'completed'>('all')

  useEffect(() => {
    const checkRole = async () => {
      try {
        const res = await fetch('/api/auth/me')
        if (res.ok) {
          const user = await res.json()
          if (user?.role === ROLES.INSTRUCTOR) {
            router.replace('/lms/instructor/dashboard')
          } else if (user?.role && user.role !== ROLES.USER) {
            router.replace('/admin/dashboard')
          }
        }
      } catch {}
    }
    checkRole()
  }, [router])

  const { data: profile } = useQuery({
    queryKey: ['my-profile'],
    queryFn: () => fetch('/api/lms/profile').then(r => r.json()),
  })

  const { data: enrollments, isLoading } = useQuery({
    queryKey: ['my-enrollments'],
    queryFn: () => fetch('/api/lms/enrollments').then(r => r.json()),
  })

  const all = Array.isArray(enrollments) ? enrollments : []
  const inProgress = all.filter((e: any) => e.status === 'ACTIVE')
  const completed = all.filter((e: any) => e.status === 'COMPLETED')

  const filtered = tab === 'in-progress' ? inProgress : tab === 'completed' ? completed : all

  const continueCourse = inProgress.slice(0, 1)

  return (
    <div className="min-h-screen bg-black">
      <Header />
      <div className="pt-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome */}
        <div className="mb-10">
          <h1 className="text-3xl font-bold text-white">
            Welcome back{profile?.name ? `, ${profile.name.split(' ')[0]}` : ''}
          </h1>
          <p className="text-gray-400 mt-1">Continue learning and growing your skills.</p>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-3 gap-4 mb-10 max-w-lg">
          <div className="rounded-xl bg-zinc-900/60 border border-white/[0.06] p-4 text-center">
            <p className="text-2xl font-bold text-white">{all.length}</p>
            <p className="text-gray-500 text-xs mt-0.5">Enrolled</p>
          </div>
          <div className="rounded-xl bg-zinc-900/60 border border-white/[0.06] p-4 text-center">
            <p className="text-2xl font-bold text-blue-400">{inProgress.length}</p>
            <p className="text-gray-500 text-xs mt-0.5">In Progress</p>
          </div>
          <div className="rounded-xl bg-zinc-900/60 border border-white/[0.06] p-4 text-center">
            <p className="text-2xl font-bold text-emerald-400">{completed.length}</p>
            <p className="text-gray-500 text-xs mt-0.5">Completed</p>
          </div>
        </div>

        {/* Continue Learning */}
        {continueCourse.length > 0 && (
          <div className="mb-10">
            <h2 className="text-lg font-semibold text-white mb-4">Continue Learning</h2>
            <Link
              href={`/lms/learn/${continueCourse[0].course?.id}/${continueCourse[0].course?.firstLessonId || ''}`}
              className="group block rounded-2xl bg-zinc-900/60 border border-white/[0.06] overflow-hidden hover:border-blue-500/30 transition-all"
            >
              <div className="flex flex-col sm:flex-row">
                <div className="sm:w-72 h-44 bg-zinc-800 shrink-0">
                  {continueCourse[0].course?.thumbnail ? (
                    <img src={continueCourse[0].course.thumbnail} alt="" className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <svg className="w-16 h-16 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M15.75 10.5l4.72-4.72a.75.75 0 011.28.53v11.38a.75.75 0 01-1.28.53l-4.72-4.72M4.5 18.75h9a2.25 2.25 0 002.25-2.25v-9a2.25 2.25 0 00-2.25-2.25h-9A2.25 2.25 0 002.25 7.5v9a2.25 2.25 0 002.25 2.25z" />
                      </svg>
                    </div>
                  )}
                </div>
                <div className="flex-1 p-6 flex flex-col justify-center">
                  <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">Continue Learning</p>
                  <h3 className="text-xl font-bold text-white group-hover:text-blue-400 transition-colors">
                    {continueCourse[0].course?.title}
                  </h3>
                  <div className="mt-4">
                    <div className="flex items-center justify-between text-xs text-gray-500 mb-1.5">
                      <span>Progress</span>
                      <span>{Math.round(continueCourse[0].progress)}%</span>
                    </div>
                    <div className="h-2.5 bg-zinc-800 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-blue-500 rounded-full transition-all duration-500"
                        style={{ width: `${Math.round(continueCourse[0].progress)}%` }}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </Link>
          </div>
        )}

        {/* Tabs */}
        <div className="flex items-center gap-1 mb-6">
          {([
            { key: 'all', label: 'All Courses' },
            { key: 'in-progress', label: 'In Progress' },
            { key: 'completed', label: 'Completed' },
          ] as const).map(t => (
            <button
              key={t.key}
              onClick={() => setTab(t.key)}
              className={`px-4 py-2 text-sm rounded-lg transition-all ${
                tab === t.key ? 'bg-blue-600 text-white' : 'text-gray-400 hover:text-white'
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>

        {/* Course Grid */}
        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map(i => (
              <div key={i} className="rounded-2xl bg-zinc-900/60 border border-white/[0.06] overflow-hidden animate-pulse">
                <div className="aspect-video bg-zinc-800" />
                <div className="p-5 space-y-3">
                  <div className="h-4 bg-zinc-800 rounded w-3/4" />
                  <div className="h-3 bg-zinc-800 rounded w-1/2" />
                  <div className="h-2 bg-zinc-800 rounded w-full" />
                </div>
              </div>
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-20">
            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-zinc-800 flex items-center justify-center">
              <svg className="w-8 h-8 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25" />
              </svg>
            </div>
            <p className="text-gray-400 text-lg mb-2">
              {tab === 'completed' ? 'No completed courses yet' : tab === 'in-progress' ? 'No courses in progress' : 'No enrollments yet'}
            </p>
            <Link href="/lms" className="text-blue-400 hover:text-blue-300 text-sm">
              Browse courses
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filtered.map((enrollment: any) => {
              const course = enrollment.course || {}
              return (
                <Link
                  key={enrollment.id}
                  href={`/lms/learn/${course.id}/${course.firstLessonId || ''}`}
                  className="group rounded-2xl bg-zinc-900/60 border border-white/[0.06] overflow-hidden hover:border-blue-500/30 hover:shadow-lg hover:shadow-blue-500/5 transition-all"
                >
                  <div className="aspect-video bg-zinc-800 flex items-center justify-center">
                    {course.thumbnail ? (
                      <img src={course.thumbnail} alt={course.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                    ) : (
                      <svg className="w-12 h-12 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M15.75 10.5l4.72-4.72a.75.75 0 011.28.53v11.38a.75.75 0 01-1.28.53l-4.72-4.72M4.5 18.75h9a2.25 2.25 0 002.25-2.25v-9a2.25 2.25 0 00-2.25-2.25h-9A2.25 2.25 0 002.25 7.5v9a2.25 2.25 0 002.25 2.25z" />
                      </svg>
                    )}
                  </div>
                  <div className="p-5">
                    <h3 className="text-white font-semibold group-hover:text-blue-400 transition-colors line-clamp-2">
                      {course.title || 'Untitled'}
                    </h3>
                    <div className="mt-4">
                      <div className="flex items-center justify-between text-xs text-gray-500 mb-1.5">
                        <span>Progress</span>
                        <span>{Math.round(enrollment.progress)}%</span>
                      </div>
                      <div className="h-2 bg-zinc-800 rounded-full overflow-hidden">
                        <div
                          className={`h-full rounded-full transition-all duration-500 ${
                            enrollment.status === 'COMPLETED' ? 'bg-emerald-500' : 'bg-blue-500'
                          }`}
                          style={{ width: `${Math.round(enrollment.progress)}%` }}
                        />
                      </div>
                    </div>
                    <div className="mt-3 flex items-center gap-2">
                      <span className={`text-[10px] px-2 py-0.5 rounded-full ${
                        enrollment.status === 'ACTIVE' ? 'text-blue-400 bg-blue-500/10' :
                        enrollment.status === 'COMPLETED' ? 'text-emerald-400 bg-emerald-500/10' :
                        'text-red-400 bg-red-500/10'
                      }`}>
                        {enrollment.status === 'ACTIVE' ? 'In Progress' :
                         enrollment.status === 'COMPLETED' ? 'Completed' : 'Dropped'}
                      </span>
                    </div>
                  </div>
                </Link>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}
