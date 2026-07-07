'use client'

import { useQuery } from '@tanstack/react-query'
import Link from 'next/link'

export default function MyCoursesPage() {
  const { data: enrollments, isLoading } = useQuery({
    queryKey: ['my-enrollments'],
    queryFn: () => fetch('/api/lms/enrollments').then(r => r.json()),
  })

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white">My Learning</h1>
        <p className="text-gray-400 mt-1">Continue where you left off</p>
      </div>

      {!enrollments?.length ? (
        <div className="text-center py-20">
          <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-zinc-800 flex items-center justify-center">
            <svg className="w-8 h-8 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25" />
            </svg>
          </div>
          <p className="text-gray-400 text-lg">No enrollments yet</p>
          <Link href="/lms" className="text-blue-400 hover:text-blue-300 mt-2 inline-block">
            Browse courses
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {enrollments.map((enrollment: any) => {
            const course = enrollment.course || {}
            return (
              <Link
                key={enrollment.id}
                href={`/lms/learn/${course.id}/start`}
                className="group rounded-2xl bg-zinc-900/60 border border-white/[0.06] overflow-hidden hover:border-blue-500/30 transition-all"
              >
                <div className="aspect-video bg-zinc-800 flex items-center justify-center">
                  {course.thumbnail ? (
                    <img src={course.thumbnail} alt={course.title} className="w-full h-full object-cover" />
                  ) : (
                    <svg className="w-12 h-12 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M15.75 10.5l4.72-4.72a.75.75 0 011.28.53v11.38a.75.75 0 01-1.28.53l-4.72-4.72M4.5 18.75h9a2.25 2.25 0 002.25-2.25v-9a2.25 2.25 0 00-2.25-2.25h-9A2.25 2.25 0 002.25 7.5v9a2.25 2.25 0 002.25 2.25z" />
                    </svg>
                  )}
                </div>
                <div className="p-5">
                  <h3 className="text-white font-semibold group-hover:text-blue-400 transition-colors">{course.title || 'Untitled'}</h3>
                  <div className="mt-3">
                    <div className="flex items-center justify-between text-xs text-gray-500 mb-1.5">
                      <span>Progress</span>
                      <span>{Math.round(enrollment.progress)}%</span>
                    </div>
                    <div className="h-2 bg-zinc-800 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-blue-500 rounded-full transition-all duration-500"
                        style={{ width: `${Math.round(enrollment.progress)}%` }}
                      />
                    </div>
                  </div>
                  <div className="mt-3">
                    <span className={`text-[10px] px-2 py-0.5 rounded-full ${
                      enrollment.status === 'ACTIVE' ? 'text-blue-400 bg-blue-500/10' :
                      enrollment.status === 'COMPLETED' ? 'text-emerald-400 bg-emerald-500/10' :
                      'text-red-400 bg-red-500/10'
                    }`}>
                      {enrollment.status}
                    </span>
                  </div>
                </div>
              </Link>
            )
          })}
        </div>
      )}
    </div>
  )
}
