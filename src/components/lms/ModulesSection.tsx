'use client'

import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import toast from 'react-hot-toast'
import type { ModuleData, LessonData } from '@/lib/lms/types'
import { QuizBuilder } from './QuizBuilder'

export function ModulesSection({ courseId, variant = 'instructor' }: { courseId?: string; variant?: 'instructor' | 'admin' }) {
  const queryClient = useQueryClient()

  const { data: modules, isLoading } = useQuery<ModuleData[]>({
    queryKey: ['lms-modules', courseId],
    queryFn: () => fetch(`/api/lms/modules?courseId=${courseId}`).then(r => r.json()),
    enabled: !!courseId,
  })

  const createModule = useMutation({
    mutationFn: (title: string) =>
      fetch('/api/lms/modules', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ courseId, title }) }),
    onSuccess: () => {
      toast.success('Module added')
      queryClient.invalidateQueries({ queryKey: ['lms-modules', courseId] })
      queryClient.invalidateQueries({ queryKey: ['lms-course', courseId] })
    },
    onError: () => toast.error('Failed to add module'),
  })

  const updateModule = useMutation({
    mutationFn: ({ id, title }: { id: string; title: string }) =>
      fetch(`/api/lms/modules/${id}`, { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ title }) }),
    onSuccess: () => {
      toast.success('Module updated')
      queryClient.invalidateQueries({ queryKey: ['lms-modules', courseId] })
    },
    onError: () => toast.error('Failed to update module'),
  })

  const deleteModule = useMutation({
    mutationFn: (id: string) => fetch(`/api/lms/modules/${id}`, { method: 'DELETE' }),
    onSuccess: () => {
      toast.success('Module deleted')
      queryClient.invalidateQueries({ queryKey: ['lms-modules', courseId] })
      queryClient.invalidateQueries({ queryKey: ['lms-course', courseId] })
    },
    onError: () => toast.error('Failed to delete module'),
  })

  const [newModuleTitle, setNewModuleTitle] = useState('')
  const [editingModuleId, setEditingModuleId] = useState<string | null>(null)
  const [editingTitle, setEditingTitle] = useState('')
  const [expandedModuleId, setExpandedModuleId] = useState<string | null>(null)

  const startEditModule = (mod: ModuleData) => {
    setEditingModuleId(mod.id)
    setEditingTitle(mod.title)
  }

  const saveModule = (id: string) => {
    if (editingTitle.trim()) {
      updateModule.mutate({ id, title: editingTitle.trim() })
    }
    setEditingModuleId(null)
  }

  const addModule = () => {
    if (!newModuleTitle.trim()) { toast.error('Enter a module title'); return }
    createModule.mutate(newModuleTitle.trim())
    setNewModuleTitle('')
  }

  if (!courseId) {
    return (
      <div>
        <h2 className="text-lg font-semibold text-white mb-4">Modules & Lessons</h2>
        <div className="rounded-xl bg-zinc-900/60 border border-white/[0.06] p-8 text-center">
          <p className="text-gray-500 text-sm">Complete the course info first to add modules and lessons.</p>
        </div>
      </div>
    )
  }

  return (
    <div>
      <h2 className="text-lg font-semibold text-white mb-4">Modules & Lessons</h2>

      {isLoading ? (
        <div className="space-y-3">
          {Array.from({ length: 3 }).map((_, i) => <div key={i} className="h-16 bg-zinc-800 rounded-xl animate-pulse" />)}
        </div>
      ) : (
        <div className="space-y-3">
          {modules?.map((mod) => (
            <div key={mod.id} className="rounded-xl bg-zinc-900/60 border border-white/[0.06]">
              <div className="flex items-center gap-3 px-4 py-3">
                <svg className="w-4 h-4 text-gray-500 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8h16M4 16h16" />
                </svg>
                {editingModuleId === mod.id ? (
                  <input
                    type="text"
                    value={editingTitle}
                    onChange={e => setEditingTitle(e.target.value)}
                    onBlur={() => saveModule(mod.id)}
                    onKeyDown={e => e.key === 'Enter' && saveModule(mod.id)}
                    className={`flex-1 bg-zinc-800 border border-white/[0.08] rounded-lg px-3 py-1.5 text-white text-sm focus:outline-none ${variant === 'admin' ? 'focus:border-blue-500/50' : 'focus:border-amber-500/50'}`}
                    autoFocus
                  />
                ) : (
                  <span className="flex-1 text-white text-sm">{mod.title}</span>
                )}
                <span className="text-xs text-gray-500">{mod._count?.lessons ?? 0} lessons</span>
                <button onClick={() => startEditModule(mod)} className="text-gray-500 hover:text-white transition-colors">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                  </svg>
                </button>
                <button onClick={() => { if (window.confirm(`Delete module "${mod.title}"?`)) deleteModule.mutate(mod.id) }} className="text-gray-500 hover:text-red-400 transition-colors">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                </button>
                <button onClick={() => setExpandedModuleId(expandedModuleId === mod.id ? null : mod.id)} className="text-gray-500 hover:text-white transition-colors">
                  <svg className={`w-4 h-4 transition-transform ${expandedModuleId === mod.id ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
              </div>

              {expandedModuleId === mod.id && <LessonsList moduleId={mod.id} courseId={courseId} variant={variant} />}
            </div>
          ))}
        </div>
      )}

      <div className="flex gap-2 mt-4">
        <input
          type="text"
          value={newModuleTitle}
          onChange={e => setNewModuleTitle(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && addModule()}
          placeholder="New module title..."
          className={`flex-1 bg-zinc-900 border border-white/[0.08] rounded-xl px-4 py-2.5 text-white placeholder-gray-500 focus:outline-none ${variant === 'admin' ? 'focus:border-blue-500/50' : 'focus:border-amber-500/50'} text-sm`}
        />
        <button onClick={addModule} disabled={createModule.isPending} className={`px-4 py-2.5 rounded-xl ${variant === 'admin' ? 'bg-blue-600 hover:bg-blue-500' : 'bg-amber-600 hover:bg-amber-500'} text-white text-sm font-medium disabled:opacity-50 transition-colors`}>
          Add Module
        </button>
      </div>
    </div>
  )
}

function LessonsList({ moduleId, courseId, variant }: { moduleId: string; courseId?: string; variant: 'instructor' | 'admin' }) {
  const queryClient = useQueryClient()

  const { data: lessons, isLoading } = useQuery<LessonData[]>({
    queryKey: ['lms-lessons', moduleId],
    queryFn: () => fetch(`/api/lms/lessons?moduleId=${moduleId}`).then(r => r.json()),
    enabled: !!moduleId,
  })

  const createLesson = useMutation({
    mutationFn: (body: Record<string, unknown>) =>
      fetch('/api/lms/lessons', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) }),
    onSuccess: () => {
      toast.success('Lesson added')
      queryClient.invalidateQueries({ queryKey: ['lms-lessons', moduleId] })
      queryClient.invalidateQueries({ queryKey: ['lms-modules', courseId] })
    },
    onError: () => toast.error('Failed to add lesson'),
  })

  const updateLesson = useMutation({
    mutationFn: (body: Record<string, unknown>) =>
      fetch(`/api/lms/lessons/${body.id}`, { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body.data) }),
    onSuccess: () => {
      toast.success('Lesson updated')
      queryClient.invalidateQueries({ queryKey: ['lms-lessons', moduleId] })
      queryClient.invalidateQueries({ queryKey: ['lms-modules', courseId] })
    },
    onError: () => toast.error('Failed to update lesson'),
  })

  const deleteLesson = useMutation({
    mutationFn: (id: string) => fetch(`/api/lms/lessons/${id}`, { method: 'DELETE' }),
    onSuccess: () => {
      toast.success('Lesson deleted')
      queryClient.invalidateQueries({ queryKey: ['lms-lessons', moduleId] })
      queryClient.invalidateQueries({ queryKey: ['lms-modules', courseId] })
    },
    onError: () => toast.error('Failed to delete lesson'),
  })

  const [newLessonTitle, setNewLessonTitle] = useState('')
  const [newLessonType, setNewLessonType] = useState<'TEXT' | 'VIDEO' | 'QUIZ' | 'ASSIGNMENT'>('TEXT')
  const [editorLessonId, setEditorLessonId] = useState<string | null>(null)
  const [editorForm, setEditorForm] = useState({
    title: '',
    type: 'TEXT' as string,
    description: '',
    content: '',
    videoUrl: '',
    duration: '',
  })
  const [videoUploading, setVideoUploading] = useState(false)

  const openEditor = (lesson: LessonData) => {
    setEditorLessonId(lesson.id)
    setEditorForm({
      title: lesson.title,
      type: lesson.type,
      description: lesson.description || '',
      content: typeof lesson.content === 'string' ? lesson.content : JSON.stringify(lesson.content || ''),
      videoUrl: lesson.videoUrl || '',
      duration: lesson.duration?.toString() || '',
    })
  }

  const saveEditor = () => {
    if (!editorForm.title.trim()) { toast.error('Title is required'); return }
    const data: Record<string, unknown> = {
      title: editorForm.title.trim(),
      type: editorForm.type,
      description: editorForm.description.trim() || null,
      duration: editorForm.duration ? parseInt(editorForm.duration, 10) : null,
    }
    if (editorForm.type === 'TEXT') data.content = editorForm.content
    if (editorForm.type === 'VIDEO') data.videoUrl = editorForm.videoUrl || null
    updateLesson.mutate({ id: editorLessonId, data })
    setEditorLessonId(null)
  }

  const handleVideoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    const formData = new FormData()
    formData.append('file', file)
    setVideoUploading(true)
    try {
      const res = await fetch('/api/upload', { method: 'POST', body: formData })
      if (!res.ok) { toast.error('Upload failed'); return }
      const { url } = await res.json()
      setEditorForm(f => ({ ...f, videoUrl: url }))
    } catch {
      toast.error('Upload failed')
    } finally {
      setVideoUploading(false)
    }
  }

  const addLesson = () => {
    if (!newLessonTitle.trim()) { toast.error('Enter a lesson title'); return }
    createLesson.mutate({ moduleId, title: newLessonTitle.trim(), type: newLessonType })
    setNewLessonTitle('')
  }

  if (isLoading) {
    return <div className="px-4 pb-3 pt-1"><div className="h-8 bg-zinc-800 rounded animate-pulse" /></div>
  }

  return (
    <div className="border-t border-white/[0.06]">
      {lessons?.map((lesson) => (
        <div key={lesson.id}>
          <div className="flex items-center gap-3 px-4 py-2.5 hover:bg-white/[0.02]">
            <svg className="w-3.5 h-3.5 text-gray-500 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            <span className="flex-1 text-gray-300 text-sm">{lesson.title}</span>
            <span className="hidden sm:inline text-[10px] text-gray-500 uppercase">{lesson.type}</span>
            <button onClick={() => openEditor(lesson)} className="text-gray-500 hover:text-white transition-colors" title="Edit content">
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
              </svg>
            </button>
            <button onClick={() => { if (window.confirm(`Delete lesson "${lesson.title}"?`)) deleteLesson.mutate(lesson.id) }} className="text-gray-500 hover:text-red-400 transition-colors">
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
            </button>
          </div>

          {editorLessonId === lesson.id && (
            <div className="border-t border-white/[0.04] px-4 py-3 space-y-3 bg-zinc-900/40">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] text-gray-500 mb-1">Title</label>
                  <input type="text" value={editorForm.title} onChange={e => setEditorForm(f => ({ ...f, title: e.target.value }))}
                    className={`w-full bg-zinc-800 border border-white/[0.08] rounded-lg px-3 py-1.5 text-white text-sm focus:outline-none ${variant === 'admin' ? 'focus:border-blue-500/50' : 'focus:border-amber-500/50'}`} />
                </div>
                <div>
                  <label className="block text-[11px] text-gray-500 mb-1">Type</label>
                  <select value={editorForm.type} onChange={e => setEditorForm(f => ({ ...f, type: e.target.value }))}
                    className={`w-full bg-zinc-800 border border-white/[0.08] rounded-lg px-3 py-1.5 text-gray-300 text-sm focus:outline-none ${variant === 'admin' ? 'focus:border-blue-500/50' : 'focus:border-amber-500/50'}`}>
                    <option value="TEXT">Text</option>
                    <option value="VIDEO">Video</option>
                    <option value="QUIZ">Quiz</option>
                    <option value="ASSIGNMENT">Assignment</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-[11px] text-gray-500 mb-1">Description</label>
                <textarea value={editorForm.description} onChange={e => setEditorForm(f => ({ ...f, description: e.target.value }))} rows={2}
                  className={`w-full bg-zinc-800 border border-white/[0.08] rounded-lg px-3 py-1.5 text-white text-sm focus:outline-none ${variant === 'admin' ? 'focus:border-blue-500/50' : 'focus:border-amber-500/50'} resize-none`} />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] text-gray-500 mb-1">Duration (min)</label>
                  <input type="number" min="0" value={editorForm.duration} onChange={e => setEditorForm(f => ({ ...f, duration: e.target.value }))}
                    className={`w-full bg-zinc-800 border border-white/[0.08] rounded-lg px-3 py-1.5 text-white text-sm focus:outline-none ${variant === 'admin' ? 'focus:border-blue-500/50' : 'focus:border-amber-500/50'}`} />
                </div>
              </div>

              {editorForm.type === 'TEXT' && (
                <div>
                  <label className="block text-[11px] text-gray-500 mb-1">Content</label>
                  <textarea value={editorForm.content} onChange={e => setEditorForm(f => ({ ...f, content: e.target.value }))} rows={5}
                    className={`w-full bg-zinc-800 border border-white/[0.08] rounded-lg px-3 py-1.5 text-white text-sm focus:outline-none ${variant === 'admin' ? 'focus:border-blue-500/50' : 'focus:border-amber-500/50'} resize-none font-mono`} />
                </div>
              )}

              {editorForm.type === 'VIDEO' && (
                <div>
                  <label className="block text-[11px] text-gray-500 mb-1">Video URL</label>
                  <div className="flex gap-2">
                    <input type="url" value={editorForm.videoUrl} onChange={e => setEditorForm(f => ({ ...f, videoUrl: e.target.value }))} placeholder="https://example.com/video.mp4"
                      className={`flex-1 bg-zinc-800 border border-white/[0.08] rounded-lg px-3 py-1.5 text-white text-sm focus:outline-none ${variant === 'admin' ? 'focus:border-blue-500/50' : 'focus:border-amber-500/50'}`} />
                    <label className="cursor-pointer px-3 py-1.5 rounded-lg bg-zinc-700 text-gray-300 text-xs font-medium hover:bg-zinc-600 transition-colors">
                      Upload
                      <input type="file" accept="video/mp4,video/webm,video/quicktime" onChange={handleVideoUpload} className="hidden" />
                    </label>
                  </div>
                  {videoUploading && <span className={`text-[11px] mt-1 block ${variant === 'admin' ? 'text-blue-400' : 'text-amber-400'}`}>Uploading...</span>}
                  {editorForm.videoUrl && (
                    <video src={editorForm.videoUrl} controls className="mt-2 w-full max-h-40 rounded-lg bg-black" />
                  )}
                </div>
              )}

              {editorForm.type === 'QUIZ' && (
                <QuizBuilder lessonId={lesson.id} variant={variant} />
              )}

              {editorForm.type === 'ASSIGNMENT' && (
                <div>
                  <label className="block text-[11px] text-gray-500 mb-1">Instructions</label>
                  <textarea value={editorForm.content} onChange={e => setEditorForm(f => ({ ...f, content: e.target.value }))} rows={4}
                    className={`w-full bg-zinc-800 border border-white/[0.08] rounded-lg px-3 py-1.5 text-white text-sm focus:outline-none ${variant === 'admin' ? 'focus:border-blue-500/50' : 'focus:border-amber-500/50'} resize-none`} />
                </div>
              )}

              <div className="flex gap-2 pt-1">
                <button onClick={saveEditor} disabled={updateLesson.isPending}
                  className={`px-3 py-1.5 rounded-lg text-white text-xs font-medium disabled:opacity-50 transition-colors ${variant === 'admin' ? 'bg-blue-600 hover:bg-blue-500' : 'bg-amber-600 hover:bg-amber-500'}`}>
                  {updateLesson.isPending ? 'Saving...' : 'Save'}
                </button>
                <button onClick={() => setEditorLessonId(null)}
                  className="px-3 py-1.5 rounded-lg bg-zinc-700 text-gray-300 text-xs font-medium hover:bg-zinc-600 transition-colors">
                  Cancel
                </button>
              </div>
            </div>
          )}
        </div>
      ))}

      <div className="flex gap-2 px-4 py-3 border-t border-white/[0.04]">
        <input
          type="text"
          value={newLessonTitle}
          onChange={e => setNewLessonTitle(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && addLesson()}
          placeholder="New lesson title..."
          className={`flex-1 bg-zinc-800 border border-white/[0.08] rounded-lg px-3 py-1.5 text-white placeholder-gray-500 text-xs focus:outline-none ${variant === 'admin' ? 'focus:border-blue-500/50' : 'focus:border-amber-500/50'}`}
        />
        <select value={newLessonType} onChange={e => setNewLessonType(e.target.value as any)}
          className={`bg-zinc-800 border border-white/[0.08] rounded-lg px-2 py-1.5 text-gray-300 text-xs focus:outline-none ${variant === 'admin' ? 'focus:border-blue-500/50' : 'focus:border-amber-500/50'}`}>
          <option value="TEXT">Text</option>
          <option value="VIDEO">Video</option>
          <option value="QUIZ">Quiz</option>
          <option value="ASSIGNMENT">Assignment</option>
        </select>
        <button onClick={addLesson} disabled={createLesson.isPending}
          className={`px-3 py-1.5 rounded-lg text-white text-xs font-medium disabled:opacity-50 transition-colors ${variant === 'admin' ? 'bg-blue-600 hover:bg-blue-500' : 'bg-amber-600 hover:bg-amber-500'}`}>
          Add
        </button>
      </div>
    </div>
  )
}
