'use client'

import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import toast from 'react-hot-toast'
import type { QuizData, QuestionData } from '@/lib/lms/types'

const ACCENT = 'instructor' as const

function accentClass(variant: 'instructor' | 'admin', cls: string) {
  return cls
}

export function QuizBuilder({ lessonId, variant }: { lessonId: string; variant: 'instructor' | 'admin' }) {
  const queryClient = useQueryClient()
  const accent = variant === 'admin' ? 'blue' : 'amber'

  const { data: quiz, isLoading } = useQuery<QuizData | null>({
    queryKey: ['lms-quiz', lessonId],
    queryFn: async () => {
      const res = await fetch(`/api/lms/quizzes?lessonId=${lessonId}`)
      if (res.status === 404) return null
      if (!res.ok) throw new Error('Failed to fetch quiz')
      return res.json()
    },
  })

  // ─── Quiz mutations ─────────────────────────────────────
  const createQuiz = useMutation({
    mutationFn: () =>
      fetch('/api/lms/quizzes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ lessonId, title: 'Untitled Quiz' }),
      }).then(r => { if (!r.ok) throw new Error(); return r.json() }),
    onSuccess: () => {
      toast.success('Quiz created')
      queryClient.invalidateQueries({ queryKey: ['lms-quiz', lessonId] })
    },
    onError: () => toast.error('Failed to create quiz'),
  })

  const updateQuiz = useMutation({
    mutationFn: (data: Record<string, unknown>) =>
      fetch(`/api/lms/quizzes/${quiz!.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      }).then(r => { if (!r.ok) throw new Error(); return r.json() }),
    onSuccess: () => {
      toast.success('Quiz updated')
      queryClient.invalidateQueries({ queryKey: ['lms-quiz', lessonId] })
    },
    onError: () => toast.error('Failed to update quiz'),
  })

  const deleteQuiz = useMutation({
    mutationFn: () =>
      fetch(`/api/lms/quizzes/${quiz!.id}`, { method: 'DELETE' }).then(r => { if (!r.ok) throw new Error(); return r.json() }),
    onSuccess: () => {
      toast.success('Quiz deleted')
      queryClient.invalidateQueries({ queryKey: ['lms-quiz', lessonId] })
    },
    onError: () => toast.error('Failed to delete quiz'),
  })

  // ─── Question mutations ────────────────────────────────
  const addQuestion = useMutation({
    mutationFn: (data: Record<string, unknown>) =>
      fetch('/api/lms/questions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      }).then(r => { if (!r.ok) throw new Error(); return r.json() }),
    onSuccess: () => {
      toast.success('Question added')
      queryClient.invalidateQueries({ queryKey: ['lms-quiz', lessonId] })
    },
    onError: () => toast.error('Failed to add question'),
  })

  const updateQuestion = useMutation({
    mutationFn: ({ id, data }: { id: string; data: Record<string, unknown> }) =>
      fetch(`/api/lms/questions/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      }).then(r => { if (!r.ok) throw new Error(); return r.json() }),
    onSuccess: () => {
      toast.success('Question updated')
      queryClient.invalidateQueries({ queryKey: ['lms-quiz', lessonId] })
    },
    onError: () => toast.error('Failed to update question'),
  })

  const deleteQuestion = useMutation({
    mutationFn: (id: string) =>
      fetch(`/api/lms/questions/${id}`, { method: 'DELETE' }).then(r => { if (!r.ok) throw new Error(); return r.json() }),
    onSuccess: () => {
      toast.success('Question deleted')
      queryClient.invalidateQueries({ queryKey: ['lms-quiz', lessonId] })
    },
    onError: () => toast.error('Failed to delete question'),
  })

  // ─── CSV Import ────────────────────────────────────────
  const [csvUploading, setCsvUploading] = useState(false)
  const [csvResult, setCsvResult] = useState<{ created: number; errors: { row: number; message: string }[] } | null>(null)

  const handleCsvImport = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    if (!file.name.endsWith('.csv')) { toast.error('Please select a CSV file'); return }
    const formData = new FormData()
    formData.append('file', file)
    formData.append('quizId', quiz!.id)
    setCsvUploading(true)
    setCsvResult(null)
    try {
      const res = await fetch('/api/lms/quizzes/import', { method: 'POST', body: formData })
      const result = await res.json()
      if (!res.ok) { toast.error(result.error || 'Import failed'); return }
      setCsvResult(result)
      toast.success(`Imported ${result.created} question(s)`)
      queryClient.invalidateQueries({ queryKey: ['lms-quiz', lessonId] })
    } catch {
      toast.error('Import failed')
    } finally {
      setCsvUploading(false)
      e.target.value = ''
    }
  }

  // ─── Quiz Settings form ─────────────────────────────────
  const [showSettings, setShowSettings] = useState(false)
  const [settingsForm, setSettingsForm] = useState({
    title: '',
    description: '',
    passingScore: 70,
    timeLimit: '',
    maxAttempts: 1,
    shuffleQuestions: false,
    showResults: true,
  })

  const openSettings = () => {
    if (!quiz) return
    setSettingsForm({
      title: quiz.title,
      description: quiz.description || '',
      passingScore: quiz.passingScore,
      timeLimit: quiz.timeLimit?.toString() || '',
      maxAttempts: quiz.maxAttempts,
      shuffleQuestions: quiz.shuffleQuestions,
      showResults: quiz.showResults,
    })
    setShowSettings(true)
  }

  const saveSettings = () => {
    if (!settingsForm.title.trim()) { toast.error('Quiz title is required'); return }
    updateQuiz.mutate({
      title: settingsForm.title.trim(),
      description: settingsForm.description.trim() || null,
      passingScore: settingsForm.passingScore,
      timeLimit: settingsForm.timeLimit ? parseInt(settingsForm.timeLimit, 10) : null,
      maxAttempts: settingsForm.maxAttempts,
      shuffleQuestions: settingsForm.shuffleQuestions,
      showResults: settingsForm.showResults,
    })
    setShowSettings(false)
  }

  // ─── Question form ──────────────────────────────────────
  const [addingQuestion, setAddingQuestion] = useState(false)
  const [editingQuestionId, setEditingQuestionId] = useState<string | null>(null)
  const [questionForm, setQuestionForm] = useState({
    type: 'multiple_choice' as string,
    question: '',
    options: ['', ''] as string[],
    correctAnswer: '',
    points: 1,
  })

  const resetQuestionForm = () => {
    setQuestionForm({ type: 'multiple_choice', question: '', options: ['', ''], correctAnswer: '', points: 1 })
  }

  const openEditQuestion = (q: QuestionData) => {
    setEditingQuestionId(q.id)
    const opts = Array.isArray(q.options) ? (q.options as string[]) : []
    setQuestionForm({
      type: q.type,
      question: q.question,
      options: opts.length >= 2 ? opts : ['', ''],
      correctAnswer: typeof q.correctAnswer === 'string' ? q.correctAnswer : JSON.stringify(q.correctAnswer),
      points: q.points,
    })
  }

  const saveQuestion = () => {
    if (!questionForm.question.trim()) { toast.error('Question text is required'); return }
    if (questionForm.type === 'multiple_choice') {
      const validOptions = questionForm.options.filter(o => o.trim())
      if (validOptions.length < 2) { toast.error('At least 2 options are required'); return }
      if (!questionForm.correctAnswer.trim()) { toast.error('Correct answer is required'); return }
    }
    if ((questionForm.type === 'true_false' || questionForm.type === 'short_answer') && !questionForm.correctAnswer.trim()) {
      toast.error('Correct answer is required'); return
    }

    const data: Record<string, unknown> = {
      type: questionForm.type,
      question: questionForm.question.trim(),
      points: questionForm.points,
      correctAnswer: questionForm.correctAnswer.trim(),
    }
    if (questionForm.type === 'multiple_choice') {
      data.options = questionForm.options.filter(o => o.trim())
    }

    if (editingQuestionId) {
      updateQuestion.mutate({ id: editingQuestionId, data })
    } else {
      addQuestion.mutate({ quizId: quiz!.id, ...data })
    }
    setEditingQuestionId(null)
    setAddingQuestion(false)
    resetQuestionForm()
  }

  const startAddQuestion = () => {
    resetQuestionForm()
    setAddingQuestion(true)
    setEditingQuestionId(null)
  }

  if (isLoading) {
    return <div className="h-12 bg-zinc-800 rounded-lg animate-pulse" />
  }

  if (!quiz) {
    return (
      <div className="rounded-lg bg-blue-500/5 border border-blue-500/10 px-3 py-2.5">
        <p className="text-xs text-blue-300 mb-2">No quiz configured for this lesson.</p>
        <button onClick={() => createQuiz.mutate()} disabled={createQuiz.isPending}
          className={`px-3 py-1.5 rounded-lg text-white text-xs font-medium disabled:opacity-50 transition-colors ${accent === 'blue' ? 'bg-blue-600 hover:bg-blue-500' : 'bg-amber-600 hover:bg-amber-500'}`}>
          {createQuiz.isPending ? 'Creating...' : 'Create Quiz'}
        </button>
      </div>
    )
  }

  return (
    <div className="space-y-3">
      {/* Quiz header */}
      <div className="flex items-center justify-between">
        <span className="text-xs font-medium text-gray-300">{quiz.title}</span>
        <div className="flex gap-2">
          <button onClick={openSettings} className="text-gray-500 hover:text-white transition-colors" title="Quiz settings">
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.066 2.573c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.573 1.066c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.066-2.573c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
          </button>
          <label className="text-gray-500 hover:text-white transition-colors cursor-pointer" title="Import from CSV">
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
            </svg>
            <input type="file" accept=".csv" onChange={handleCsvImport} className="hidden" />
          </label>
          <button onClick={() => { if (window.confirm('Delete this quiz and all its questions?')) deleteQuiz.mutate() }} disabled={deleteQuiz.isPending} className="text-gray-500 hover:text-red-400 transition-colors" title="Delete quiz">
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
          </button>
        </div>
      </div>

      {/* CSV result */}
      {csvResult && (
        <div className={`rounded-lg px-3 py-2 text-xs ${csvResult.errors.length > 0 ? 'bg-amber-500/5 border border-amber-500/10' : 'bg-green-500/5 border border-green-500/10'}`}>
          <p className={csvResult.errors.length > 0 ? 'text-amber-300' : 'text-green-300'}>
            Imported {csvResult.created} question(s).
          </p>
          {csvResult.errors.length > 0 && (
            <ul className="mt-1 space-y-0.5">
              {csvResult.errors.map((e, i) => (
                <li key={i} className="text-red-400">Row {e.row}: {e.message}</li>
              ))}
            </ul>
          )}
        </div>
      )}

      {/* CSV uploading indicator */}
      {csvUploading && <span className={`text-[11px] block ${accent === 'blue' ? 'text-blue-400' : 'text-amber-400'}`}>Importing...</span>}

      {/* Quiz Settings panel */}
      {showSettings && (
        <div className="border border-white/[0.06] rounded-lg p-3 space-y-2.5 bg-zinc-900/40">
          <div className="grid grid-cols-2 gap-2.5">
            <div className="col-span-2">
              <label className="block text-[11px] text-gray-500 mb-1">Quiz Title</label>
              <input type="text" value={settingsForm.title} onChange={e => setSettingsForm(f => ({ ...f, title: e.target.value }))}
                className={`w-full bg-zinc-800 border border-white/[0.08] rounded-lg px-3 py-1.5 text-white text-sm focus:outline-none ${variant === 'admin' ? 'focus:border-blue-500/50' : 'focus:border-amber-500/50'}`} />
            </div>
            <div className="col-span-2">
              <label className="block text-[11px] text-gray-500 mb-1">Description</label>
              <textarea value={settingsForm.description} onChange={e => setSettingsForm(f => ({ ...f, description: e.target.value }))} rows={2}
                className={`w-full bg-zinc-800 border border-white/[0.08] rounded-lg px-3 py-1.5 text-white text-sm focus:outline-none ${variant === 'admin' ? 'focus:border-blue-500/50' : 'focus:border-amber-500/50'} resize-none`} />
            </div>
            <div>
              <label className="block text-[11px] text-gray-500 mb-1">Passing Score (%)</label>
              <input type="number" min="0" max="100" value={settingsForm.passingScore} onChange={e => setSettingsForm(f => ({ ...f, passingScore: parseInt(e.target.value) || 0 }))}
                className={`w-full bg-zinc-800 border border-white/[0.08] rounded-lg px-3 py-1.5 text-white text-sm focus:outline-none ${variant === 'admin' ? 'focus:border-blue-500/50' : 'focus:border-amber-500/50'}`} />
            </div>
            <div>
              <label className="block text-[11px] text-gray-500 mb-1">Time Limit (min)</label>
              <input type="number" min="0" value={settingsForm.timeLimit} onChange={e => setSettingsForm(f => ({ ...f, timeLimit: e.target.value }))}
                className={`w-full bg-zinc-800 border border-white/[0.08] rounded-lg px-3 py-1.5 text-white text-sm focus:outline-none ${variant === 'admin' ? 'focus:border-blue-500/50' : 'focus:border-amber-500/50'}`} />
            </div>
            <div>
              <label className="block text-[11px] text-gray-500 mb-1">Max Attempts</label>
              <input type="number" min="1" value={settingsForm.maxAttempts} onChange={e => setSettingsForm(f => ({ ...f, maxAttempts: parseInt(e.target.value) || 1 }))}
                className={`w-full bg-zinc-800 border border-white/[0.08] rounded-lg px-3 py-1.5 text-white text-sm focus:outline-none ${variant === 'admin' ? 'focus:border-blue-500/50' : 'focus:border-amber-500/50'}`} />
            </div>
            <div>
              <label className="block text-[11px] text-gray-500 mb-1">Shuffle Questions</label>
              <div className="flex items-center h-[34px]">
                <button onClick={() => setSettingsForm(f => ({ ...f, shuffleQuestions: !f.shuffleQuestions }))}
                  className={`w-9 h-5 rounded-full transition-colors relative ${settingsForm.shuffleQuestions ? 'bg-amber-600' : 'bg-zinc-600'}`}>
                  <span className={`absolute top-0.5 w-4 h-4 bg-white rounded-full transition-transform ${settingsForm.shuffleQuestions ? 'translate-x-[18px]' : 'translate-x-0.5'}`} />
                </button>
                <span className="ml-2 text-xs text-gray-500">{settingsForm.shuffleQuestions ? 'Yes' : 'No'}</span>
              </div>
            </div>
            <div>
              <label className="block text-[11px] text-gray-500 mb-1">Show Results</label>
              <div className="flex items-center h-[34px]">
                <button onClick={() => setSettingsForm(f => ({ ...f, showResults: !f.showResults }))}
                  className={`w-9 h-5 rounded-full transition-colors relative ${settingsForm.showResults ? 'bg-amber-600' : 'bg-zinc-600'}`}>
                  <span className={`absolute top-0.5 w-4 h-4 bg-white rounded-full transition-transform ${settingsForm.showResults ? 'translate-x-[18px]' : 'translate-x-0.5'}`} />
                </button>
                <span className="ml-2 text-xs text-gray-500">{settingsForm.showResults ? 'Yes' : 'No'}</span>
              </div>
            </div>
          </div>
          <div className="flex gap-2 pt-1">
            <button onClick={saveSettings} disabled={updateQuiz.isPending}
              className={`px-3 py-1.5 rounded-lg text-white text-xs font-medium disabled:opacity-50 transition-colors ${variant === 'admin' ? 'bg-blue-600 hover:bg-blue-500' : 'bg-amber-600 hover:bg-amber-500'}`}>
              {updateQuiz.isPending ? 'Saving...' : 'Save'}
            </button>
            <button onClick={() => setShowSettings(false)} className="px-3 py-1.5 rounded-lg bg-zinc-700 text-gray-300 text-xs font-medium hover:bg-zinc-600 transition-colors">Cancel</button>
          </div>
        </div>
      )}

      {/* Questions list */}
      {quiz.questions && quiz.questions.length > 0 && (
        <div className="space-y-1.5">
          {quiz.questions.map((q) => (
            <div key={q.id}>
              <div className="flex items-start gap-2 px-2 py-1.5 rounded-lg hover:bg-white/[0.02] group">
                <span className={`text-[10px] uppercase font-medium mt-0.5 shrink-0 ${q.type === 'multiple_choice' ? 'text-blue-400' : q.type === 'true_false' ? 'text-green-400' : q.type === 'short_answer' ? 'text-purple-400' : 'text-gray-400'}`}>
                  {q.type === 'multiple_choice' ? 'MC' : q.type === 'true_false' ? 'TF' : q.type === 'short_answer' ? 'SA' : 'ES'}
                </span>
                <div className="flex-1 min-w-0">
                  <p className="text-xs text-gray-300 truncate">{q.question}</p>
                  <p className="text-[10px] text-gray-500 mt-0.5">{q.points} pt{q.points !== 1 ? 's' : ''}</p>
                </div>
                <button onClick={() => openEditQuestion(q)} className="text-gray-500 hover:text-white transition-colors opacity-0 group-hover:opacity-100" title="Edit question">
                  <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                  </svg>
                </button>
                <button onClick={() => { if (window.confirm('Delete this question?')) deleteQuestion.mutate(q.id) }} className="text-gray-500 hover:text-red-400 transition-colors opacity-0 group-hover:opacity-100" title="Delete question">
                  <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              {/* Inline edit question */}
              {editingQuestionId === q.id && (
                <QuestionFormFields
                  form={questionForm}
                  setForm={setQuestionForm}
                  variant={variant}
                  onSave={saveQuestion}
                  onCancel={() => { setEditingQuestionId(null); resetQuestionForm() }}
                  isPending={updateQuestion.isPending}
                />
              )}
            </div>
          ))}
        </div>
      )}

      {/* Add question button or form */}
      {addingQuestion ? (
        <QuestionFormFields
          form={questionForm}
          setForm={setQuestionForm}
          variant={variant}
          onSave={saveQuestion}
          onCancel={() => { setAddingQuestion(false); resetQuestionForm() }}
          isPending={addQuestion.isPending}
        />
      ) : (
        <button onClick={startAddQuestion}
          className={`text-xs font-medium transition-colors ${variant === 'admin' ? 'text-blue-400 hover:text-blue-300' : 'text-amber-400 hover:text-amber-300'}`}>
          + Add Question
        </button>
      )}

      {quiz.questions && quiz.questions.length === 0 && !addingQuestion && (
        <p className="text-[11px] text-gray-500">No questions yet. Add one or import from CSV.</p>
      )}
    </div>
  )
}

// ─── Question form fields (shared between add & edit) ─────
function QuestionFormFields({
  form, setForm, variant, onSave, onCancel, isPending,
}: {
  form: { type: string; question: string; options: string[]; correctAnswer: string; points: number }
  setForm: (f: any) => void
  variant: 'instructor' | 'admin'
  onSave: () => void
  onCancel: () => void
  isPending: boolean
}) {
  const updateOpt = (index: number, value: string) => {
    const opts = [...form.options]
    opts[index] = value
    setForm((f: any) => ({ ...f, options: opts }))
  }
  const addOpt = () => setForm((f: any) => ({ ...f, options: [...f.options, ''] }))
  const removeOpt = (index: number) => {
    if (form.options.length <= 2) return
    setForm((f: any) => ({ ...f, options: f.options.filter((_: any, i: number) => i !== index) }))
  }

  return (
    <div className="border border-white/[0.06] rounded-lg p-3 space-y-2.5 bg-zinc-900/40 mt-1">
      <div className="grid grid-cols-2 gap-2.5">
        <div>
          <label className="block text-[11px] text-gray-500 mb-1">Type</label>
          <select value={form.type} onChange={e => {
            const t = e.target.value
            setForm((f: any) => ({
              ...f,
              type: t,
              options: t === 'multiple_choice' ? ['', ''] : [],
              correctAnswer: '',
            }))
          }}
            className={`w-full bg-zinc-800 border border-white/[0.08] rounded-lg px-3 py-1.5 text-gray-300 text-sm focus:outline-none ${variant === 'admin' ? 'focus:border-blue-500/50' : 'focus:border-amber-500/50'}`}>
            <option value="multiple_choice">Multiple Choice</option>
            <option value="true_false">True/False</option>
            <option value="short_answer">Short Answer</option>
            <option value="essay">Essay</option>
          </select>
        </div>
        <div>
          <label className="block text-[11px] text-gray-500 mb-1">Points</label>
          <input type="number" min="1" value={form.points} onChange={e => setForm((f: any) => ({ ...f, points: parseInt(e.target.value) || 1 }))}
            className={`w-full bg-zinc-800 border border-white/[0.08] rounded-lg px-3 py-1.5 text-white text-sm focus:outline-none ${variant === 'admin' ? 'focus:border-blue-500/50' : 'focus:border-amber-500/50'}`} />
        </div>
      </div>

      <div>
        <label className="block text-[11px] text-gray-500 mb-1">Question</label>
        <textarea value={form.question} onChange={e => setForm((f: any) => ({ ...f, question: e.target.value }))} rows={2}
          className={`w-full bg-zinc-800 border border-white/[0.08] rounded-lg px-3 py-1.5 text-white text-sm focus:outline-none ${variant === 'admin' ? 'focus:border-blue-500/50' : 'focus:border-amber-500/50'} resize-none`} />
      </div>

      {form.type === 'multiple_choice' && (
        <div>
          <label className="block text-[11px] text-gray-500 mb-1">Options</label>
          <div className="space-y-1.5">
            {form.options.map((opt, i) => (
              <div key={i} className="flex gap-1.5 items-center">
                <input type="text" value={opt} onChange={e => updateOpt(i, e.target.value)}
                  placeholder={`Option ${i + 1}`}
                  className={`flex-1 bg-zinc-800 border border-white/[0.08] rounded-lg px-3 py-1.5 text-white text-sm focus:outline-none ${variant === 'admin' ? 'focus:border-blue-500/50' : 'focus:border-amber-500/50'}`} />
                <button onClick={() => setForm((f: any) => ({ ...f, correctAnswer: opt }))}
                  className={`text-[10px] px-2 py-1 rounded shrink-0 transition-colors ${form.correctAnswer === opt ? 'bg-green-600 text-white' : 'bg-zinc-700 text-gray-400 hover:text-white'}`}>
                  {form.correctAnswer === opt ? 'Correct' : 'Set'}
                </button>
                {form.options.length > 2 && (
                  <button onClick={() => removeOpt(i)} className="text-gray-500 hover:text-red-400 transition-colors shrink-0">
                    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                )}
              </div>
            ))}
          </div>
          <button onClick={addOpt} className="text-[11px] text-gray-500 hover:text-gray-300 mt-1">+ Add option</button>
        </div>
      )}

      {form.type === 'true_false' && (
        <div>
          <label className="block text-[11px] text-gray-500 mb-1">Correct Answer</label>
          <div className="flex gap-2">
            <button onClick={() => setForm((f: any) => ({ ...f, correctAnswer: 'true' }))}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${form.correctAnswer === 'true' ? 'bg-green-600 text-white' : 'bg-zinc-700 text-gray-400 hover:text-white'}`}>
              True
            </button>
            <button onClick={() => setForm((f: any) => ({ ...f, correctAnswer: 'false' }))}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${form.correctAnswer === 'false' ? 'bg-green-600 text-white' : 'bg-zinc-700 text-gray-400 hover:text-white'}`}>
              False
            </button>
          </div>
        </div>
      )}

      {(form.type === 'short_answer' || form.type === 'essay') && (
        <div>
          <label className="block text-[11px] text-gray-500 mb-1">Correct Answer</label>
          {form.type === 'essay' ? (
            <p className="text-[11px] text-gray-500">Essay questions are graded manually.</p>
          ) : (
            <input type="text" value={form.correctAnswer} onChange={e => setForm((f: any) => ({ ...f, correctAnswer: e.target.value }))}
              placeholder="Expected answer"
              className={`w-full bg-zinc-800 border border-white/[0.08] rounded-lg px-3 py-1.5 text-white text-sm focus:outline-none ${variant === 'admin' ? 'focus:border-blue-500/50' : 'focus:border-amber-500/50'}`} />
          )}
        </div>
      )}

      <div className="flex gap-2 pt-1">
        <button onClick={onSave} disabled={isPending}
          className={`px-3 py-1.5 rounded-lg text-white text-xs font-medium disabled:opacity-50 transition-colors ${variant === 'admin' ? 'bg-blue-600 hover:bg-blue-500' : 'bg-amber-600 hover:bg-amber-500'}`}>
          {isPending ? 'Saving...' : 'Save'}
        </button>
        <button onClick={onCancel} className="px-3 py-1.5 rounded-lg bg-zinc-700 text-gray-300 text-xs font-medium hover:bg-zinc-600 transition-colors">
          Cancel
        </button>
      </div>
    </div>
  )
}
