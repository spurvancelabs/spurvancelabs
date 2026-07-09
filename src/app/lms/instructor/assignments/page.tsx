'use client'

import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import toast from 'react-hot-toast'
import Link from 'next/link'

export default function InstructorAssignmentsPage() {
  const queryClient = useQueryClient()
  const [courseFilter, setCourseFilter] = useState('')
  const [gradingId, setGradingId] = useState<string | null>(null)
  const [gradeInput, setGradeInput] = useState('')
  const [feedbackInput, setFeedbackInput] = useState('')

  const { data: courses } = useQuery({
    queryKey: ['instructor-courses-all'],
    queryFn: () => fetch('/api/lms/instructor/courses?limit=100').then(r => r.json()),
  })

  const params = new URLSearchParams()
  if (courseFilter) params.set('courseId', courseFilter)

  const { data: submissions, isLoading } = useQuery({
    queryKey: ['instructor-submissions', courseFilter],
    queryFn: () => fetch(`/api/lms/submissions?${params}`).then(r => r.json()),
  })

  const gradeMutation = useMutation({
    mutationFn: ({ id, grade, feedback }: { id: string; grade: number; feedback: string }) =>
      fetch(`/api/lms/submissions/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ grade, feedback: feedback || null }),
      }).then(r => { if (!r.ok) throw new Error('Failed to grade'); return r.json() }),
    onSuccess: () => {
      toast.success('Submission graded!')
      setGradingId(null)
      setGradeInput('')
      setFeedbackInput('')
      queryClient.invalidateQueries({ queryKey: ['instructor-submissions'] })
    },
    onError: () => toast.error('Failed to grade submission'),
  })

  const openGrading = (submission: any) => {
    setGradingId(submission.id)
    setGradeInput(submission.grade?.toString() || '')
    setFeedbackInput(submission.feedback || '')
  }

  const subs = Array.isArray(submissions) ? submissions : []
  const pendingSubmissions = subs.filter((s: any) => s.status === 'SUBMITTED')
  const gradedSubmissions = subs.filter((s: any) => s.status === 'GRADED')

  return (
    <div>
      <h1 className="text-2xl font-bold text-white mb-1">Assignments</h1>
      <p className="text-gray-400 text-sm mb-6">Review and grade student submissions</p>

      {/* Summary */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        <div className="rounded-2xl bg-zinc-900/60 border border-white/[0.06] p-4">
          <p className="text-2xl font-bold text-white">{subs.length}</p>
          <p className="text-gray-400 text-xs mt-1">Total Submissions</p>
        </div>
        <div className="rounded-2xl bg-amber-500/10 border border-amber-500/20 p-4">
          <p className="text-2xl font-bold text-amber-400">{pendingSubmissions.length}</p>
          <p className="text-amber-400/60 text-xs mt-1">Pending Review</p>
        </div>
        <div className="rounded-2xl bg-emerald-500/10 border border-emerald-500/20 p-4">
          <p className="text-2xl font-bold text-emerald-400">{gradedSubmissions.length}</p>
          <p className="text-emerald-400/60 text-xs mt-1">Graded</p>
        </div>
      </div>

      {/* Course Filter */}
      <div className="mb-6">
        <select
          value={courseFilter}
          onChange={e => setCourseFilter(e.target.value)}
          className="bg-zinc-900 border border-white/[0.08] rounded-xl px-4 py-2.5 text-gray-300 focus:outline-none focus:border-amber-500/50 text-sm max-w-xs"
        >
          <option value="">All Courses</option>
          {courses?.data?.map((c: any) => (
            <option key={c.id} value={c.id}>{c.title}</option>
          ))}
        </select>
      </div>

      {/* Submissions List */}
      <div className="space-y-4">
        {isLoading && (
          <div className="flex justify-center py-12">
            <div className="w-6 h-6 border-2 border-amber-500 border-t-transparent rounded-full animate-spin" />
          </div>
        )}

        {!isLoading && subs.length === 0 && (
          <div className="text-center py-12">
            <svg className="w-12 h-12 mx-auto text-gray-600 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            <p className="text-gray-500 text-sm">No submissions yet</p>
          </div>
        )}

        {subs.map((submission: any) => (
          <div key={submission.id} className="rounded-2xl bg-zinc-900/60 border border-white/[0.06] p-5">
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-full bg-amber-500/10 flex items-center justify-center text-sm font-bold text-amber-400">
                  {(submission.student?.name || submission.student?.email || '?')[0].toUpperCase()}
                </div>
                <div>
                  <p className="text-white text-sm font-medium">{submission.student?.name || submission.student?.email}</p>
                  <p className="text-gray-500 text-xs">{submission.student?.email}</p>
                </div>
              </div>
              <span className={`text-[10px] px-2 py-0.5 rounded-full ${
                submission.status === 'SUBMITTED' ? 'text-amber-400 bg-amber-500/10' : 'text-emerald-400 bg-emerald-500/10'
              }`}>
                {submission.status === 'SUBMITTED' ? 'Pending' : `Graded: ${submission.grade}%`}
              </span>
            </div>

            <div className="mb-3">
              <p className="text-xs text-gray-500 mb-1">Course / Lesson</p>
              <Link href={`/lms/instructor/courses/${submission.lesson?.module?.courseId}`} className="text-sm text-amber-400 hover:underline">
                {submission.lesson?.title}
              </Link>
            </div>

            <div className="mb-3">
              <p className="text-xs text-gray-500 mb-1">Student Submission</p>
              <div className="bg-zinc-800/50 rounded-xl p-3 border border-white/[0.06]">
                <p className="text-sm text-gray-300 whitespace-pre-wrap">{submission.content}</p>
              </div>
            </div>

            {submission.feedback && (
              <div className="mb-3">
                <p className="text-xs text-gray-500 mb-1">Feedback</p>
                <p className="text-sm text-gray-300 bg-zinc-800/50 rounded-xl p-3 border border-white/[0.06]">{submission.feedback}</p>
              </div>
            )}

            {gradingId === submission.id ? (
              <div className="space-y-3 mt-4 pt-4 border-t border-white/[0.06]">
                <div>
                  <label className="block text-xs text-gray-500 mb-1">Grade (0-100)</label>
                  <input
                    type="number"
                    min={0}
                    max={100}
                    value={gradeInput}
                    onChange={e => setGradeInput(e.target.value)}
                    className="w-32 bg-zinc-800 border border-white/[0.08] rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-amber-500/50"
                  />
                </div>
                <div>
                  <label className="block text-xs text-gray-500 mb-1">Feedback</label>
                  <textarea
                    value={feedbackInput}
                    onChange={e => setFeedbackInput(e.target.value)}
                    rows={3}
                    placeholder="Write feedback..."
                    className="w-full bg-zinc-800 border border-white/[0.08] rounded-xl px-3 py-2 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-amber-500/50 resize-y"
                  />
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => gradeMutation.mutate({
                      id: submission.id,
                      grade: parseInt(gradeInput) || 0,
                      feedback: feedbackInput,
                    })}
                    disabled={gradeMutation.isPending || !gradeInput}
                    className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white text-sm font-medium rounded-xl transition-all"
                  >
                    {gradeMutation.isPending ? 'Saving...' : 'Save Grade'}
                  </button>
                  <button
                    onClick={() => setGradingId(null)}
                    className="px-4 py-2 bg-zinc-800 hover:bg-zinc-700 text-gray-300 text-sm font-medium rounded-xl transition-all"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            ) : (
              <button
                onClick={() => openGrading(submission)}
                className="mt-2 px-4 py-2 bg-amber-600 hover:bg-amber-500 text-white text-sm font-medium rounded-xl transition-all"
              >
                {submission.status === 'GRADED' ? 'Edit Grade' : 'Grade Submission'}
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}
