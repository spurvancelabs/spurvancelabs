'use client'

import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import Link from 'next/link'
import toast from 'react-hot-toast'
import type { PaginatedResponse, CourseData } from '@/lib/lms/types'

const statusStyles: Record<string, string> = {
  DRAFT: 'bg-yellow-500/10 text-yellow-400',
  PUBLISHED: 'bg-emerald-500/10 text-emerald-400',
  ARCHIVED: 'bg-gray-500/10 text-gray-400',
}

export default function InstructorCoursesPage() {
  const queryClient = useQueryClient()
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('')

  const params = new URLSearchParams()
  if (search) params.set('search', search)
  if (statusFilter) params.set('status', statusFilter)
  params.set('limit', '50')

  const { data, isLoading } = useQuery<PaginatedResponse<CourseData>>({
    queryKey: ['instructor-courses', search, statusFilter],
    queryFn: () => fetch(`/api/lms/instructor/courses?${params}`).then(r => r.json()),
  })

  const deleteMutation = useMutation({
    mutationFn: (id: string) =>
      fetch(`/api/lms/courses/${id}`, { method: 'DELETE' }),
    onSuccess: () => {
      toast.success('Course deleted')
      queryClient.invalidateQueries({ queryKey: ['instructor-courses'] })
    },
    onError: () => toast.error('Failed to delete course'),
  })

  const courses = data?.data || []

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-white">My Courses</h1>
          <p className="text-gray-400 text-sm mt-1">Manage your courses</p>
        </div>
        <Link
          href="/lms/instructor/courses/new"
          className="px-4 py-2 rounded-xl bg-amber-600 text-white text-sm font-medium hover:bg-amber-500 transition-colors"
        >
          New Course
        </Link>
      </div>

      <div className="flex gap-3 mb-6">
        <input
          type="text"
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="Search courses..."
          className="flex-1 max-w-xs bg-zinc-900 border border-white/[0.08] rounded-xl px-4 py-2.5 text-white placeholder-gray-500 focus:outline-none focus:border-amber-500/50 text-sm"
        />
        <select
          value={statusFilter}
          onChange={e => setStatusFilter(e.target.value)}
          className="bg-zinc-900 border border-white/[0.08] rounded-xl px-4 py-2.5 text-gray-300 focus:outline-none focus:border-amber-500/50 text-sm"
        >
          <option value="">All Status</option>
          <option value="DRAFT">Draft</option>
          <option value="PUBLISHED">Published</option>
          <option value="ARCHIVED">Archived</option>
        </select>
        <span className="text-sm text-gray-500 self-center ml-auto">
          {data?.total ?? 0} course{(data?.total ?? 0) !== 1 ? 's' : ''}
        </span>
      </div>

      <div className="rounded-xl bg-zinc-900 border border-white/[0.06] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-white/[0.06]">
                <th className="text-left px-5 py-3 text-gray-500 font-medium">Title</th>
                <th className="text-left px-5 py-3 text-gray-500 font-medium">Status</th>
                <th className="text-left px-5 py-3 text-gray-500 font-medium">Category</th>
                <th className="text-center px-5 py-3 text-gray-500 font-medium">Modules</th>
                <th className="text-center px-5 py-3 text-gray-500 font-medium">Students</th>
                <th className="text-right px-5 py-3 text-gray-500 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                Array.from({ length: 5 }).map((_, i) => (
                  <tr key={i} className="border-b border-white/[0.03]">
                    {Array.from({ length: 6 }).map((_, j) => (
                      <td key={j} className="px-5 py-3"><div className="h-4 bg-zinc-800 rounded animate-pulse" style={{ width: `${60 + Math.random() * 30}%` }} /></td>
                    ))}
                  </tr>
                ))
              ) : courses.length === 0 ? (
                <tr><td colSpan={6} className="px-5 py-8 text-center text-gray-500">No courses yet. <Link href="/lms/instructor/courses/new" className="text-amber-400 hover:text-amber-300">Create one</Link></td></tr>
              ) : (
                courses.map((course) => (
                  <tr key={course.id} className="border-b border-white/[0.03] hover:bg-white/[0.02]">
                    <td className="px-5 py-3 text-white font-medium">{course.title}</td>
                    <td className="px-5 py-3">
                      <span className={`text-xs px-2 py-0.5 rounded-full ${statusStyles[course.status] || 'bg-gray-500/10 text-gray-400'}`}>
                        {course.status}
                      </span>
                      {course.status === 'DRAFT' && !course.isComplete && (
                        <span className="text-[10px] text-gray-500 ml-2">in progress</span>
                      )}
                      {course.status === 'DRAFT' && course.isComplete && (
                        <span className="text-[10px] text-blue-400 ml-2">awaiting approval</span>
                      )}
                    </td>
                    <td className="px-5 py-3 text-gray-400">{course.category?.name || '—'}</td>
                    <td className="px-5 py-3 text-center text-gray-400">{course._count?.modules ?? 0}</td>
                    <td className="px-5 py-3 text-center text-gray-400">{course._count?.enrollments ?? 0}</td>
                    <td className="px-5 py-3 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Link
                          href={`/lms/instructor/courses/${course.id}`}
                          className="text-xs px-2 py-1 rounded bg-blue-500/20 text-blue-400 hover:bg-blue-500/30 transition-colors"
                        >
                          Edit
                        </Link>
                        <button
                          onClick={() => {
                            if (window.confirm(`Delete "${course.title}"? This cannot be undone.`)) {
                              deleteMutation.mutate(course.id)
                            }
                          }}
                          className="text-xs px-2 py-1 rounded bg-red-500/20 text-red-400 hover:bg-red-500/30 transition-colors"
                        >
                          Delete
                        </button>
                      </div>
                    </td>
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
