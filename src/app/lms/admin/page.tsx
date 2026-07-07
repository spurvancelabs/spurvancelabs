'use client'

import { useQuery } from '@tanstack/react-query'
import { format } from 'date-fns'
import type { EnrollmentData } from '@/lib/lms/types'

export default function AdminDashboardPage() {
  const { data: stats, isLoading: statsLoading } = useQuery({
    queryKey: ['lms-admin-stats'],
    queryFn: () => fetch('/api/lms/admin/stats').then(r => r.json()).catch(() => ({
      totalCourses: 0,
      publishedCourses: 0,
      totalEnrollments: 0,
      activeStudents: 0,
    })),
  })

  const { data: enrollments } = useQuery({
    queryKey: ['lms-recent-enrollments'],
    queryFn: () => fetch('/api/lms/enrollments?limit=5').then(r => r.json()),
  })

  const statCards = [
    { label: 'Total Courses', value: stats?.totalCourses ?? 0, color: 'blue' },
    { label: 'Published Courses', value: stats?.publishedCourses ?? 0, color: 'emerald' },
    { label: 'Total Enrollments', value: stats?.totalEnrollments ?? 0, color: 'violet' },
    { label: 'Active Students', value: stats?.activeStudents ?? 0, color: 'amber' },
  ]

  const statusBadge = (status: string) => {
    const map: Record<string, string> = {
      ACTIVE: 'bg-blue-500/10 text-blue-400',
      COMPLETED: 'bg-emerald-500/10 text-emerald-400',
      DROPPED: 'bg-red-500/10 text-red-400',
    }
    return map[status] || 'bg-gray-500/10 text-gray-400'
  }

  return (
    <div>
      <h1 className="text-2xl font-bold text-white mb-6">Dashboard</h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {statCards.map((card) => (
          <div key={card.label} className="rounded-xl bg-zinc-900 border border-white/[0.06] p-5">
            <p className="text-sm text-gray-400 mb-1">{card.label}</p>
            <p className={`text-3xl font-bold text-${card.color}-400`}>
              {statsLoading ? (
                <span className="inline-block w-8 h-8 rounded bg-zinc-800 animate-pulse" />
              ) : (
                card.value
              )}
            </p>
          </div>
        ))}
      </div>

      <div className="rounded-xl bg-zinc-900 border border-white/[0.06]">
        <div className="px-5 py-4 border-b border-white/[0.06]">
          <h2 className="text-white font-semibold">Recent Enrollments</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-white/[0.06]">
                <th className="text-left px-5 py-3 text-gray-500 font-medium">Student</th>
                <th className="text-left px-5 py-3 text-gray-500 font-medium">Course</th>
                <th className="text-left px-5 py-3 text-gray-500 font-medium">Status</th>
                <th className="text-left px-5 py-3 text-gray-500 font-medium">Progress</th>
                <th className="text-left px-5 py-3 text-gray-500 font-medium">Enrolled</th>
              </tr>
            </thead>
            <tbody>
              {Array.isArray(enrollments) && enrollments.slice(0, 5).map((enr: EnrollmentData) => (
                <tr key={enr.id} className="border-b border-white/[0.03] hover:bg-white/[0.02]">
                  <td className="px-5 py-3 text-white">{enr.student?.email || '—'}</td>
                  <td className="px-5 py-3 text-gray-300">{enr.course?.title || '—'}</td>
                  <td className="px-5 py-3">
                    <span className={`text-xs px-2 py-0.5 rounded-full ${statusBadge(enr.status)}`}>
                      {enr.status}
                    </span>
                  </td>
                  <td className="px-5 py-3">
                    <div className="flex items-center gap-2">
                      <div className="flex-1 h-1.5 bg-zinc-800 rounded-full overflow-hidden">
                        <div className="h-full bg-blue-500 rounded-full" style={{ width: `${enr.progress}%` }} />
                      </div>
                      <span className="text-gray-400 text-xs">{Math.round(enr.progress)}%</span>
                    </div>
                  </td>
                  <td className="px-5 py-3 text-gray-400">{format(new Date(enr.enrolledAt), 'MMM d, yyyy')}</td>
                </tr>
              ))}
              {(!enrollments || enrollments.length === 0) && (
                <tr>
                  <td colSpan={5} className="px-5 py-8 text-center text-gray-500">No enrollments yet</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
