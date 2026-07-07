'use client'

import { useQuery } from '@tanstack/react-query'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import type { CourseData, EnrollmentData } from '@/lib/lms/types'

export default function AdminAnalyticsPage() {
  const { data: coursesRes } = useQuery<{ data: CourseData[] }>({
    queryKey: ['lms-analytics-courses'],
    queryFn: () => fetch('/api/lms/courses?limit=100').then(r => r.json()),
  })

  const { data: enrollments } = useQuery<EnrollmentData[]>({
    queryKey: ['lms-analytics-enrollments'],
    queryFn: () => fetch('/api/lms/enrollments').then(r => r.json()),
  })

  const courses = coursesRes?.data || []
  const enrollmentList = Array.isArray(enrollments) ? enrollments : []

  const totalCourses = courses.length
  const totalStudents = enrollmentList.length
  const completedCount = enrollmentList.filter(e => e.status === 'COMPLETED').length
  const completionRate = totalStudents > 0 ? Math.round((completedCount / totalStudents) * 100) : 0
  const avgProgress = totalStudents > 0
    ? Math.round(enrollmentList.reduce((sum, e) => sum + e.progress, 0) / totalStudents)
    : 0

  const enrollmentsByCourse = courses.map(c => {
    const count = enrollmentList.filter(e => e.courseId === c.id).length
    return { name: c.title.length > 25 ? c.title.slice(0, 25) + '...' : c.title, enrollments: count }
  }).sort((a, b) => b.enrollments - a.enrollments)

  const mostPopular = [...courses]
    .sort((a, b) => {
      const aCount = enrollmentList.filter(e => e.courseId === a.id).length
      const bCount = enrollmentList.filter(e => e.courseId === b.id).length
      return bCount - aCount
    })
    .slice(0, 5)

  const statCards = [
    { label: 'Total Courses', value: totalCourses, color: 'text-blue-400' },
    { label: 'Total Students', value: totalStudents, color: 'text-violet-400' },
    { label: 'Completion Rate', value: `${completionRate}%`, color: 'text-emerald-400' },
    { label: 'Avg Progress', value: `${avgProgress}%`, color: 'text-amber-400' },
  ]

  return (
    <div>
      <h1 className="text-2xl font-bold text-white mb-6">Analytics</h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {statCards.map((card) => (
          <div key={card.label} className="rounded-xl bg-zinc-900 border border-white/[0.06] p-5">
            <p className="text-sm text-gray-400 mb-1">{card.label}</p>
            <p className={`text-3xl font-bold ${card.color}`}>{card.value}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <div className="rounded-xl bg-zinc-900 border border-white/[0.06] p-5">
          <h2 className="text-white font-semibold mb-4">Enrollments by Course</h2>
          {enrollmentsByCourse.length === 0 ? (
            <div className="flex items-center justify-center h-64 text-gray-500 text-sm">No data yet</div>
          ) : (
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={enrollmentsByCourse} margin={{ top: 5, right: 5, left: -20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
                <XAxis dataKey="name" tick={{ fill: '#9ca3af', fontSize: 11 }} axisLine={{ stroke: 'rgba(255,255,255,0.06)' }} tickLine={false} />
                <YAxis tick={{ fill: '#9ca3af', fontSize: 11 }} axisLine={{ stroke: 'rgba(255,255,255,0.06)' }} tickLine={false} allowDecimals={false} />
                <Tooltip
                  contentStyle={{ background: '#18181b', border: '1px solid rgba(255,255,255,0.06)', borderRadius: 8, fontSize: 13 }}
                  labelStyle={{ color: '#fff' }}
                  cursor={{ fill: 'rgba(255,255,255,0.03)' }}
                />
                <Bar dataKey="enrollments" fill="#3b82f6" radius={[4, 4, 0, 0]} maxBarSize={48} />
              </BarChart>
            </ResponsiveContainer>
          )}
        </div>

        <div className="rounded-xl bg-zinc-900 border border-white/[0.06] p-5">
          <h2 className="text-white font-semibold mb-4">Most Popular Courses</h2>
          {mostPopular.length === 0 ? (
            <div className="flex items-center justify-center h-64 text-gray-500 text-sm">No courses yet</div>
          ) : (
            <div className="space-y-3">
              {mostPopular.map((course, i) => {
                const count = enrollmentList.filter(e => e.courseId === course.id).length
                const maxCount = Math.max(1, ...mostPopular.map(c => enrollmentList.filter(e => e.courseId === c.id).length))
                return (
                  <div key={course.id}>
                    <div className="flex items-center justify-between mb-1">
                      <div className="flex items-center gap-2 min-w-0">
                        <span className="text-xs text-gray-500 w-4 shrink-0">#{i + 1}</span>
                        <span className="text-sm text-white truncate">{course.title}</span>
                      </div>
                      <span className="text-xs text-gray-400 shrink-0 ml-2">{count} enrollment{count !== 1 ? 's' : ''}</span>
                    </div>
                    <div className="h-1.5 bg-zinc-800 rounded-full overflow-hidden">
                      <div
                        className="h-full rounded-full transition-all duration-500"
                        style={{ width: `${(count / maxCount) * 100}%`, background: i === 0 ? '#3b82f6' : i === 1 ? '#8b5cf6' : i === 2 ? '#10b981' : '#f59e0b' }}
                      />
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
