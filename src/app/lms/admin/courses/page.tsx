'use client'

import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import Link from 'next/link'
import toast from 'react-hot-toast'
import type { CourseData, PaginatedResponse } from '@/lib/lms/types'

const statusStyles: Record<string, string> = {
  DRAFT: 'bg-yellow-500/10 text-yellow-400',
  PUBLISHED: 'bg-emerald-500/10 text-emerald-400',
  ARCHIVED: 'bg-gray-500/10 text-gray-400',
}

export default function AdminCoursesPage() {
  const queryClient = useQueryClient()
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('')

  const params = new URLSearchParams()
  if (search) params.set('search', search)
  params.set('limit', '50')

  if (statusFilter === 'PENDING') {
    params.set('status', 'DRAFT')
    params.set('isComplete', 'true')
  } else if (statusFilter) {
    params.set('status', statusFilter)
  }

  const { data, isLoading } = useQuery<PaginatedResponse<CourseData>>({
    queryKey: ['lms-admin-courses', search, statusFilter],
    queryFn: () => fetch(`/api/lms/courses?${params}`).then(r => r.json()),
  })

  const deleteMutation = useMutation({
    mutationFn: (id: string) => fetch(`/api/lms/courses/${id}`, { method: 'DELETE' }),
    onSuccess: () => {
      toast.success('Course deleted')
      queryClient.invalidateQueries({ queryKey: ['lms-admin-courses'] })
    },
    onError: () => toast.error('Failed to delete course'),
  })

  const handleDelete = (course: CourseData) => {
    if (window.confirm(`Delete "${course.title}"? This cannot be undone.`)) {
      deleteMutation.mutate(course.id)
    }
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-white">Courses</h1>
        <Link
          href="/lms/admin/courses/new"
          className="px-4 py-2 rounded-xl bg-blue-600 text-white text-sm font-medium hover:bg-blue-500 transition-colors"
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
          className="flex-1 bg-zinc-900 border border-white/[0.08] rounded-xl px-4 py-2.5 text-white placeholder-gray-500 focus:outline-none focus:border-blue-500/50 text-sm"
        />
        <select
          value={statusFilter}
          onChange={e => setStatusFilter(e.target.value)}
          className="bg-zinc-900 border border-white/[0.08] rounded-xl px-4 py-2.5 text-gray-300 focus:outline-none focus:border-blue-500/50 text-sm"
        >
          <option value="">All Courses</option>
          <option value="PENDING">Pending Review</option>
          <option value="DRAFT">Draft</option>
          <option value="PUBLISHED">Published</option>
          <option value="ARCHIVED">Archived</option>
        </select>
      </div>

      <div className="rounded-xl bg-zinc-900 border border-white/[0.06] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-white/[0.06]">
                <th className="text-left px-5 py-3 text-gray-500 font-medium">Title</th>
                <th className="text-left px-5 py-3 text-gray-500 font-medium">Status</th>
                <th className="text-left px-5 py-3 text-gray-500 font-medium">Category</th>
                <th className="text-left px-5 py-3 text-gray-500 font-medium">Instructor</th>
                <th className="text-center px-5 py-3 text-gray-500 font-medium">Modules</th>
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
              ) : data?.data?.length === 0 ? (
                <tr><td colSpan={6} className="px-5 py-8 text-center text-gray-500">No courses found</td></tr>
              ) : (
                data?.data?.map((course) => (
                  <tr key={course.id} className="border-b border-white/[0.03] hover:bg-white/[0.02]">
                    <td className="px-5 py-3">
                      <Link href={`/lms/admin/courses/${course.id}`} className="text-white hover:text-blue-400 transition-colors font-medium">
                        {course.title}
                      </Link>
                    </td>
                    <td className="px-5 py-3">
                      <div className="flex items-center gap-1.5">
                        <span className={`text-xs px-2 py-0.5 rounded-full ${statusStyles[course.status]}`}>{course.status}</span>
                        {course.status === 'DRAFT' && course.isComplete && (
                          <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-blue-500/10 text-blue-400">Review</span>
                        )}
                      </div>
                    </td>
                    <td className="px-5 py-3 text-gray-400">{course.category?.name || '—'}</td>
                    <td className="px-5 py-3 text-gray-400">{course.instructor?.email || '—'}</td>
                    <td className="px-5 py-3 text-center text-gray-400">{course._count?.modules ?? 0}</td>
                    <td className="px-5 py-3 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Link
                          href={`/lms/admin/courses/${course.id}`}
                          className="px-3 py-1.5 text-xs rounded-lg bg-blue-500/10 text-blue-400 hover:bg-blue-500/20 transition-colors"
                        >
                          View
                        </Link>
                        <button
                          onClick={() => handleDelete(course)}
                          className="px-3 py-1.5 text-xs rounded-lg bg-red-500/10 text-red-400 hover:bg-red-500/20 transition-colors"
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
