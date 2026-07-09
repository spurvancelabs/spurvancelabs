'use client'

import { use, useState, useEffect } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import toast from 'react-hot-toast'

export default function LessonPage({ params }: { params: Promise<{ courseId: string; lessonId: string }> }) {
  const { courseId, lessonId } = use(params)
  const router = useRouter()
  const queryClient = useQueryClient()
  const [lessonComplete, setLessonComplete] = useState(false)
  const [quizStarted, setQuizStarted] = useState(false)
  const [quizAttempt, setQuizAttempt] = useState<any>(null)
  const [quizAnswers, setQuizAnswers] = useState<Record<string, any>>({})
  const [quizSubmitted, setQuizSubmitted] = useState(false)
  const [quizResult, setQuizResult] = useState<any>(null)
  const [assignmentContent, setAssignmentContent] = useState('')
  const [submittingAssignment, setSubmittingAssignment] = useState(false)

  const { data: course } = useQuery({
    queryKey: ['lms-course-detail', courseId],
    queryFn: () => fetch(`/api/lms/courses/${courseId}`).then(r => r.json()),
  })

  const { data: lesson } = useQuery({
    queryKey: ['lms-lesson', lessonId],
    queryFn: () => fetch(`/api/lms/lessons/${lessonId}`).then(r => r.json()),
  })

  const { data: progress = [] } = useQuery<any[]>({
    queryKey: ['lms-progress', courseId],
    queryFn: () => fetch(`/api/lms/progress?courseId=${courseId}`).then(r => { if (!r.ok) return []; return r.json() }),
  })

  const completeMutation = useMutation({
    mutationFn: () => fetch('/api/lms/progress', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ lessonId }),
    }).then(r => r.json()),
    onSuccess: () => {
      setLessonComplete(true)
      queryClient.invalidateQueries({ queryKey: ['lms-progress'] })
      toast.success('Lesson completed!')
    },
    onError: () => toast.error('Failed to mark complete'),
  })

  const startQuizMutation = useMutation({
    mutationFn: () => fetch('/api/lms/quiz-attempts', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ quizId: lesson?.quizzes?.[0]?.id }),
    }).then(r => r.json()),
    onSuccess: (data) => {
      setQuizStarted(true)
      setQuizAttempt(data)
    },
    onError: (e: any) => toast.error(e.message || 'Failed to start quiz'),
  })

  const submitQuizMutation = useMutation({
    mutationFn: () => fetch(`/api/lms/quiz-attempts/${quizAttempt?.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        answers: Object.entries(quizAnswers).map(([questionId, answer]) => ({ questionId, answer })),
      }),
    }).then(r => r.json()),
    onSuccess: (data) => {
      setQuizSubmitted(true)
      setQuizResult(data)
      queryClient.invalidateQueries({ queryKey: ['lms-progress'] })
    },
    onError: () => toast.error('Failed to submit quiz'),
  })

  const allLessons = course?.modules?.flatMap((m: any) => m.lessons) || []
  const currentIndex = allLessons.findIndex((l: any) => l.id === lessonId)
  const prevLesson = currentIndex > 0 ? allLessons[currentIndex - 1] : null
  const nextLesson = currentIndex < allLessons.length - 1 ? allLessons[currentIndex + 1] : null
  const isCompleted = lessonComplete || progress?.find((p: any) => p.lessonId === lessonId)?.completed

  const quiz = lesson?.quizzes?.[0]

  if (!course || !lesson) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  return (
    <div className="flex min-h-screen">
      {/* Sidebar */}
      <aside className="w-72 bg-zinc-950 border-r border-white/[0.06] overflow-y-auto shrink-0 hidden lg:block">
        <div className="p-4 border-b border-white/[0.06]">
          <Link href="/lms/my-courses" className="text-blue-400 hover:text-blue-300 text-xs flex items-center gap-1">
            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.75 19.5L8.25 12l7.5-7.5" />
            </svg>
            Back to My Courses
          </Link>
          <h2 className="text-white text-sm font-semibold mt-2 line-clamp-2">{course.title}</h2>
        </div>
        <div className="p-2">
          {course.modules?.map((mod: any) => (
            <div key={mod.id} className="mb-2">
              <p className="text-[10px] text-gray-500 uppercase tracking-wider px-3 py-1.5 font-medium">{mod.title}</p>
              {mod.lessons?.map((l: any) => {
                const completed = progress?.find((p: any) => p.lessonId === l.id)?.completed
                const active = l.id === lessonId
                return (
                  <Link
                    key={l.id}
                    href={`/lms/learn/${courseId}/${l.id}`}
                    className={`flex items-center gap-2 px-3 py-2 rounded-lg text-xs transition-all ${
                      active ? 'bg-blue-500/10 text-blue-400' : 'text-gray-400 hover:text-white hover:bg-white/5'
                    }`}
                  >
                    <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${completed ? 'bg-emerald-500' : active ? 'bg-blue-500' : 'bg-gray-600'}`} />
                    <span className="truncate">{l.title}</span>
                    {l.type === 'QUIZ' && (
                      <svg className="w-3 h-3 shrink-0 ml-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
                      </svg>
                    )}
                  </Link>
                )
              })}
            </div>
          ))}
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 bg-black overflow-y-auto">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Video */}
          {lesson.videoUrl && (
            <div className="aspect-video rounded-2xl overflow-hidden bg-zinc-900 mb-6">
              <video
                src={lesson.videoUrl}
                controls
                className="w-full h-full"
                poster={course.thumbnail || undefined}
              />
            </div>
          )}

          {/* Content */}
          <div className="mb-8">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-[10px] text-blue-400 bg-blue-500/10 px-2 py-0.5 rounded-full uppercase">{lesson.type}</span>
              {lesson.duration && <span className="text-[10px] text-gray-500">{lesson.duration} min</span>}
            </div>
            <h1 className="text-2xl font-bold text-white mb-4">{lesson.title}</h1>
            {lesson.description && (
              <p className="text-gray-300 text-sm leading-relaxed whitespace-pre-wrap">{lesson.description}</p>
            )}
          </div>

          {/* Quiz Section */}
          {quiz && !quizStarted && !quizSubmitted && (
            <div className="rounded-2xl bg-zinc-900/60 border border-white/[0.06] p-6 mb-8">
              <h3 className="text-white font-semibold mb-2">{quiz.title}</h3>
              <p className="text-gray-400 text-sm mb-4">{quiz.description || 'Test your knowledge'}</p>
              <div className="flex items-center gap-4 text-xs text-gray-500 mb-4">
                <span>{quiz.questions?.length || 0} questions</span>
                {quiz.timeLimit && <span>{quiz.timeLimit} min limit</span>}
                <span>Pass: {quiz.passingScore}%</span>
                <span>Max {quiz.maxAttempts} attempt(s)</span>
              </div>
              <button
                onClick={() => startQuizMutation.mutate()}
                disabled={startQuizMutation.isPending}
                className="px-6 py-2.5 bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white font-medium rounded-xl text-sm transition-all"
              >
                {startQuizMutation.isPending ? 'Starting...' : 'Start Quiz'}
              </button>
            </div>
          )}

          {/* Quiz In Progress */}
          {quiz && quizStarted && !quizSubmitted && quizAttempt && (
            <div className="rounded-2xl bg-zinc-900/60 border border-white/[0.06] p-6 mb-8">
              <h3 className="text-white font-semibold mb-4">{quiz.title}</h3>
              <div className="space-y-6">
                {quiz.questions?.map((q: any, i: number) => (
                  <div key={q.id} className="border border-white/[0.06] rounded-xl p-4">
                    <p className="text-white text-sm font-medium mb-3">
                      {i + 1}. {q.question} <span className="text-gray-500 text-xs font-normal">({q.points} pt)</span>
                    </p>
                    {q.type === 'multiple_choice' && q.options?.map((opt: any, oi: number) => (
                      <label key={oi} className={`flex items-center gap-3 px-3 py-2 rounded-lg cursor-pointer text-sm transition-all ${
                        quizAnswers[q.id] === opt ? 'bg-blue-500/10 text-blue-300' : 'text-gray-400 hover:bg-white/5'
                      }`}>
                        <input
                          type="radio"
                          name={`q-${q.id}`}
                          value={opt}
                          checked={quizAnswers[q.id] === opt}
                          onChange={() => setQuizAnswers(prev => ({ ...prev, [q.id]: opt }))}
                          className="accent-blue-500"
                        />
                        {opt}
                      </label>
                    ))}
                    {q.type === 'true_false' && ['True', 'False'].map((opt) => (
                      <label key={opt} className={`flex items-center gap-3 px-3 py-2 rounded-lg cursor-pointer text-sm transition-all ${
                        quizAnswers[q.id] === opt ? 'bg-blue-500/10 text-blue-300' : 'text-gray-400 hover:bg-white/5'
                      }`}>
                        <input
                          type="radio"
                          name={`q-${q.id}`}
                          value={opt}
                          checked={quizAnswers[q.id] === opt}
                          onChange={() => setQuizAnswers(prev => ({ ...prev, [q.id]: opt }))}
                          className="accent-blue-500"
                        />
                        {opt}
                      </label>
                    ))}
                    {q.type === 'short_answer' && (
                      <input
                        type="text"
                        value={quizAnswers[q.id] || ''}
                        onChange={e => setQuizAnswers(prev => ({ ...prev, [q.id]: e.target.value }))}
                        placeholder="Your answer..."
                        className="w-full bg-zinc-800 border border-white/[0.08] rounded-lg px-3 py-2 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-blue-500/50"
                      />
                    )}
                  </div>
                ))}
              </div>
              <button
                onClick={() => submitQuizMutation.mutate()}
                disabled={submitQuizMutation.isPending}
                className="mt-6 px-6 py-2.5 bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white font-medium rounded-xl text-sm transition-all"
              >
                {submitQuizMutation.isPending ? 'Submitting...' : 'Submit Quiz'}
              </button>
            </div>
          )}

          {/* Quiz Results */}
          {quizSubmitted && quizResult && (
            <div className={`rounded-2xl border p-6 mb-8 ${
              quizResult.passed ? 'bg-emerald-500/10 border-emerald-500/30' : 'bg-red-500/10 border-red-500/30'
            }`}>
              <div className="text-center">
                <div className={`text-4xl font-bold mb-2 ${quizResult.passed ? 'text-emerald-400' : 'text-red-400'}`}>
                  {quizResult.score}%
                </div>
                <p className={`text-sm font-medium ${quizResult.passed ? 'text-emerald-300' : 'text-red-300'}`}>
                  {quizResult.passed ? 'Passed!' : 'Not passed'}
                </p>
                <p className="text-gray-500 text-xs mt-1">Passing score: {quiz.passingScore}%</p>
              </div>
            </div>
          )}

          {/* Assignment Section */}
          {lesson.type === 'ASSIGNMENT' && (
            <div className="rounded-2xl bg-zinc-900/60 border border-white/[0.06] p-6 mb-8">
              <h3 className="text-white font-semibold mb-3">Assignment</h3>
              {lesson.content && (
                <div className="text-sm text-gray-300 mb-4 whitespace-pre-wrap bg-zinc-800/50 rounded-xl p-4 border border-white/[0.06]">
                  {typeof lesson.content === 'string' ? lesson.content : ''}
                </div>
              )}

              {lesson.submission?.status === 'GRADED' ? (
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <span className="text-sm text-gray-400">Grade:</span>
                    <span className={`text-lg font-bold ${(lesson.submission.grade ?? 0) >= 50 ? 'text-emerald-400' : 'text-red-400'}`}>
                      {lesson.submission.grade}%
                    </span>
                    <span className="text-[10px] text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full">Graded</span>
                  </div>
                  {lesson.submission.feedback && (
                    <div>
                      <p className="text-xs text-gray-500 mb-1">Feedback:</p>
                      <p className="text-sm text-gray-300 bg-zinc-800/50 rounded-xl p-3 border border-white/[0.06]">{lesson.submission.feedback}</p>
                    </div>
                  )}
                  <p className="text-xs text-gray-500">Your submission:</p>
                  <p className="text-sm text-gray-400 bg-zinc-800/50 rounded-xl p-3 border border-white/[0.06] whitespace-pre-wrap">{lesson.submission.content}</p>
                </div>
              ) : lesson.submission?.status === 'SUBMITTED' ? (
                <div>
                  <div className="flex items-center gap-2 mb-3">
                    <span className="text-xs text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded-full">Submitted</span>
                    <span className="text-xs text-gray-500">Waiting for grading</span>
                  </div>
                  <p className="text-xs text-gray-500 mb-1">Your submission:</p>
                  <p className="text-sm text-gray-400 bg-zinc-800/50 rounded-xl p-3 border border-white/[0.06] whitespace-pre-wrap">{lesson.submission.content}</p>
                </div>
              ) : (
                <div>
                  <textarea
                    value={assignmentContent}
                    onChange={e => setAssignmentContent(e.target.value)}
                    rows={6}
                    placeholder="Write your assignment response here..."
                    className="w-full bg-zinc-800 border border-white/[0.08] rounded-xl px-4 py-3 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-amber-500/50 resize-y"
                  />
                  <button
                    onClick={async () => {
                      if (!assignmentContent.trim()) return
                      setSubmittingAssignment(true)
                      try {
                        const res = await fetch('/api/lms/submissions', {
                          method: 'POST',
                          headers: { 'Content-Type': 'application/json' },
                          body: JSON.stringify({ lessonId, content: assignmentContent.trim() }),
                        })
                        if (!res.ok) throw new Error('Failed to submit')
                        toast.success('Assignment submitted!')
                        setAssignmentContent('')
                      } catch {
                        toast.error('Failed to submit assignment')
                      } finally {
                        setSubmittingAssignment(false)
                      }
                    }}
                    disabled={submittingAssignment || !assignmentContent.trim()}
                    className="mt-3 px-6 py-2.5 bg-amber-600 hover:bg-amber-500 disabled:opacity-50 text-white font-medium rounded-xl text-sm transition-all"
                  >
                    {submittingAssignment ? 'Submitting...' : 'Submit Assignment'}
                  </button>
                </div>
              )}
            </div>
          )}

          {/* Mark Complete & Navigation */}
          <div className="flex items-center justify-between border-t border-white/[0.06] pt-6">
            <div>
              {!isCompleted && !quiz && lesson.type !== 'ASSIGNMENT' && (
                <button
                  onClick={() => completeMutation.mutate()}
                  disabled={completeMutation.isPending}
                  className="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white font-medium rounded-xl text-sm transition-all"
                >
                  {completeMutation.isPending ? 'Saving...' : 'Mark as Complete'}
                </button>
              )}
              {!isCompleted && lesson.type === 'ASSIGNMENT' && lesson.submission?.status === 'GRADED' && (
                <button
                  onClick={() => completeMutation.mutate()}
                  disabled={completeMutation.isPending}
                  className="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white font-medium rounded-xl text-sm transition-all"
                >
                  {completeMutation.isPending ? 'Saving...' : 'Mark as Complete'}
                </button>
              )}
              {isCompleted && (
                <span className="flex items-center gap-2 text-emerald-400 text-sm">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  Completed
                </span>
              )}
            </div>
            <div className="flex items-center gap-3">
              {prevLesson && (
                <Link
                  href={`/lms/learn/${courseId}/${prevLesson.id}`}
                  className="px-4 py-2 text-sm text-gray-400 hover:text-white border border-white/[0.08] hover:border-white/20 rounded-xl transition-all"
                >
                  Previous
                </Link>
              )}
              {nextLesson && (
                <Link
                  href={`/lms/learn/${courseId}/${nextLesson.id}`}
                  className="px-4 py-2 text-sm bg-blue-600 hover:bg-blue-500 text-white rounded-xl transition-all"
                >
                  Next
                </Link>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
