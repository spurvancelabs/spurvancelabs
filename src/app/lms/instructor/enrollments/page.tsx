'use client'

import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { format } from 'date-fns'
import type { EnrollmentData, CourseData, PaginatedResponse } from '@/lib/lms/types'

const statusStyles: Record<string, string> = {
  ACTIVE: 'bg-blue-500/10 text-blue-400',
  COMPLETED: 'bg-emerald-500/10 text-emerald-400',
  DROPPED: 'bg-red-500/10 text-red-400',
}

export default function InstructorEnrollmentsPage() {
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('')
  const [courseFilter, setCourseFilter] = useState('')

  const params = new URLSearchParams()
  if (search.trim()) params.set('search', search.trim())
  if (statusFilter) params.set('status', statusFilter)
  if (courseFilter) params.set('courseId', courseFilter)

  const { data: enrollments, isLoading } = useQuery<EnrollmentData[]>({
    queryKey: ['instructor-enrollments', search.trim(), statusFilter, courseFilter],
    queryFn: () => fetch(`/api/lms/enrollments?${params}`).then(r => r.json()),
  })

  const { data: coursesData } = useQuery<PaginatedResponse<CourseData>>({
    queryKey: ['lms-courses-dropdown'],
    queryFn: () => fetch('/api/lms/courses?limit=100').then(r => r.json()),
  })

  return (
    <div>
      <h1 className="text-2xl font-bold text-white mb-6">Enrollments</h1>

      <div className="flex flex-wrap items-center gap-3 mb-6">
        <div className="relative flex-1 max-w-xs">
          <svg className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
          </svg>
          <input
            type="text"
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search students by name or email..."
            className="w-full bg-zinc-900 border border-white/[0.08] rounded-xl pl-9 pr-4 py-2.5 text-white placeholder-gray-500 focus:outline-none focus:border-amber-500/50 text-sm"
          />
        </div>
        <select
          value={statusFilter}
          onChange={e => setStatusFilter(e.target.value)}
          className="bg-zinc-900 border border-white/[0.08] rounded-xl px-4 py-2.5 text-gray-300 focus:outline-none focus:border-amber-500/50 text-sm"
        >
          <option value="">All Status</option>
          <option value="ACTIVE">Active</option>
          <option value="COMPLETED">Completed</option>
          <option value="DROPPED">Dropped</option>
        </select>
        <select
          value={courseFilter}
          onChange={e => setCourseFilter(e.target.value)}
          className="bg-zinc-900 border border-white/[0.08] rounded-xl px-4 py-2.5 text-gray-300 focus:outline-none focus:border-amber-500/50 text-sm flex-1 max-w-xs"
        >
          <option value="">All Courses</option>
          {coursesData?.data?.map((c) => (
            <option key={c.id} value={c.id}>{c.title}</option>
          ))}
        </select>
        <span className="text-sm text-gray-500 self-center ml-auto">
          {Array.isArray(enrollments) ? enrollments.length : 0} enrollment{enrollments?.length !== 1 ? 's' : ''}
        </span>
      </div>

      <div className="rounded-xl bg-zinc-900 border border-white/[0.06] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-white/[0.06]">
                <th className="text-left px-5 py-3 text-gray-500 font-medium">Course</th>
                <th className="text-left px-5 py-3 text-gray-500 font-medium">Student</th>
                <th className="text-left px-5 py-3 text-gray-500 font-medium">Status</th>
                <th className="text-left px-5 py-3 text-gray-500 font-medium">Progress</th>
                <th className="text-left px-5 py-3 text-gray-500 font-medium">Enrolled</th>
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                Array.from({ length: 5 }).map((_, i) => (
                  <tr key={i} className="border-b border-white/[0.03]">
                    {Array.from({ length: 5 }).map((_, j) => (
                      <td key={j} className="px-5 py-3"><div className="h-4 bg-zinc-800 rounded animate-pulse" style={{ width: `${60 + Math.random() * 30}%` }} /></td>
                    ))}
                  </tr>
                ))
              ) : !enrollments || enrollments.length === 0 ? (
                <tr><td colSpan={5} className="px-5 py-8 text-center text-gray-500">No enrollments found</td></tr>
              ) : (
                enrollments.map((enr) => (
                  <tr key={enr.id} className="border-b border-white/[0.03] hover:bg-white/[0.02]">
                    <td className="px-5 py-3 text-white">{enr.course?.title || '—'}</td>
                    <td className="px-5 py-3">
                      <div className="flex items-center gap-2">
                        <div className="w-7 h-7 rounded-full bg-amber-500/10 flex items-center justify-center text-[10px] font-bold text-amber-400 shrink-0">
                          {(enr.student?.name || enr.student?.email || '?')[0].toUpperCase()}
                        </div>
                        <div className="min-w-0">
                          <p className="text-gray-300 truncate">{enr.student?.name || '—'}</p>
                          <p className="text-gray-500 text-xs truncate">{enr.student?.email || '—'}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-5 py-3">
                      <span className={`text-xs px-2 py-0.5 rounded-full ${statusStyles[enr.status] || 'bg-gray-500/10 text-gray-400'}`}>
                        {enr.status}
                      </span>
                    </td>
                    <td className="px-5 py-3">
                      <div className="flex items-center gap-2 max-w-[160px]">
                        <div className="flex-1 h-1.5 bg-zinc-800 rounded-full overflow-hidden">
                          <div className="h-full bg-blue-500 rounded-full" style={{ width: `${enr.progress}%` }} />
                        </div>
                        <span className="text-gray-400 text-xs">{Math.round(enr.progress)}%</span>
                      </div>
                    </td>
                    <td className="px-5 py-3 text-gray-400">{format(new Date(enr.enrolledAt), 'MMM d, yyyy')}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
