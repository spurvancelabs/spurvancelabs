'use client'

import { useState, useEffect, useCallback } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useRouter } from 'next/navigation'
import toast from 'react-hot-toast'
import { ModulesSection } from '@/components/lms/ModulesSection'
import type { CourseData, CategoryData } from '@/lib/lms/types'

export default function EditCoursePage({ params }: { params: Promise<{ id: string }> }) {
  const [id, setId] = useState<string | null>(null)

  useEffect(() => {
    params.then(p => setId(p.id))
  }, [params])

  if (!id) return <div className="text-center py-20 text-gray-500">Loading...</div>
  return <EditCourseForm courseId={id} />
}

function EditCourseForm({ courseId }: { courseId: string }) {
  const router = useRouter()
  const queryClient = useQueryClient()

  const { data: course, isLoading } = useQuery<CourseData>({
    queryKey: ['lms-course', courseId],
    queryFn: () => fetch(`/api/lms/courses/${courseId}`).then(r => r.json()),
    enabled: !!courseId,
  })

  const { data: categories } = useQuery<CategoryData[]>({
    queryKey: ['lms-categories'],
    queryFn: () => fetch('/api/lms/categories').then(r => r.json()),
  })

  const [title, setTitle] = useState('')
  const [slug, setSlug] = useState('')
  const [description, setDescription] = useState('')
  const [level, setLevel] = useState('beginner')
  const [categoryId, setCategoryId] = useState('')
  const [isFree, setIsFree] = useState(true)
  const [price, setPrice] = useState('')
  const [status, setStatus] = useState<'DRAFT' | 'PUBLISHED' | 'ARCHIVED'>('DRAFT')

  useEffect(() => {
    if (course) {
      setTitle(course.title)
      setSlug(course.slug)
      setDescription(course.description || '')
      setLevel(course.level || 'beginner')
      setCategoryId(course.categoryId || '')
      setIsFree(course.isFree ?? true)
      setPrice(course.price?.toString() || '')
      setStatus(course.status)
    }
  }, [course])

  const autoSlug = useCallback((val: string) => {
    setTitle(val)
    setSlug(val.toLowerCase().trim().replace(/[^\w\s-]/g, '').replace(/[\s_]+/g, '-').replace(/-+/g, '-').replace(/^-+|-+$/g, ''))
  }, [])

  const updateMutation = useMutation({
    mutationFn: (body: Record<string, unknown>) =>
      fetch(`/api/lms/courses/${courseId}`, { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) }),
    onSuccess: () => {
      toast.success('Course updated')
      queryClient.invalidateQueries({ queryKey: ['lms-course', courseId] })
      queryClient.invalidateQueries({ queryKey: ['lms-admin-courses'] })
    },
    onError: () => toast.error('Failed to update course'),
  })

  const approveMutation = useMutation({
    mutationFn: () =>
      fetch(`/api/lms/courses/${courseId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: 'PUBLISHED' }),
      }),
    onSuccess: () => {
      toast.success('Course approved and published!')
      queryClient.invalidateQueries({ queryKey: ['lms-course', courseId] })
      queryClient.invalidateQueries({ queryKey: ['lms-admin-courses'] })
      setStatus('PUBLISHED')
    },
    onError: () => toast.error('Failed to approve course'),
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!title.trim()) { toast.error('Title is required'); return }
    updateMutation.mutate({
      title: title.trim(),
      slug: slug.trim() || undefined,
      description: description.trim() || undefined,
      level,
      categoryId: categoryId || undefined,
      isFree,
      price: isFree ? null : (price ? parseFloat(price) : null),
      status,
    })
  }

  if (isLoading) {
    return (
      <div className="max-w-2xl">
        <div className="h-8 w-48 bg-zinc-800 rounded animate-pulse mb-6" />
        <div className="space-y-4">
          {Array.from({ length: 6 }).map((_, i) => <div key={i} className="h-10 bg-zinc-800 rounded-xl animate-pulse" />)}
        </div>
      </div>
    )
  }

  return (
    <div>
      <h1 className="text-2xl font-bold text-white mb-6">Edit Course</h1>

      {course?.status === 'DRAFT' && course?.isComplete && (
        <div className="mb-6 rounded-xl bg-blue-500/10 border border-blue-500/20 px-5 py-3 flex items-center justify-between">
          <div>
            <p className="text-sm text-blue-300 font-medium">Pending Review</p>
            <p className="text-xs text-blue-400/70 mt-0.5">This course has been submitted for approval. Review the content and publish when ready.</p>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm text-gray-400 mb-1.5">Title</label>
            <input type="text" value={title} onChange={e => autoSlug(e.target.value)}
              className="w-full bg-zinc-900 border border-white/[0.08] rounded-xl px-4 py-2.5 text-white focus:outline-none focus:border-blue-500/50 text-sm" required />
          </div>
          <div>
            <label className="block text-sm text-gray-400 mb-1.5">Slug</label>
            <input type="text" value={slug} onChange={e => setSlug(e.target.value)}
              className="w-full bg-zinc-900 border border-white/[0.08] rounded-xl px-4 py-2.5 text-white focus:outline-none focus:border-blue-500/50 text-sm" />
          </div>
          <div>
            <label className="block text-sm text-gray-400 mb-1.5">Description</label>
            <textarea value={description} onChange={e => setDescription(e.target.value)} rows={4}
              className="w-full bg-zinc-900 border border-white/[0.08] rounded-xl px-4 py-2.5 text-white focus:outline-none focus:border-blue-500/50 text-sm resize-none" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm text-gray-400 mb-1.5">Level</label>
              <select value={level} onChange={e => setLevel(e.target.value)}
                className="w-full bg-zinc-900 border border-white/[0.08] rounded-xl px-4 py-2.5 text-gray-300 focus:outline-none focus:border-blue-500/50 text-sm">
                <option value="beginner">Beginner</option>
                <option value="intermediate">Intermediate</option>
                <option value="advanced">Advanced</option>
              </select>
            </div>
            <div>
              <label className="block text-sm text-gray-400 mb-1.5">Category</label>
              <select value={categoryId} onChange={e => setCategoryId(e.target.value)}
                className="w-full bg-zinc-900 border border-white/[0.08] rounded-xl px-4 py-2.5 text-gray-300 focus:outline-none focus:border-blue-500/50 text-sm">
                <option value="">None</option>
                {categories?.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
              </select>
            </div>
          </div>
          <label className="flex items-center gap-2 cursor-pointer">
            <input type="checkbox" checked={isFree} onChange={e => setIsFree(e.target.checked)}
              className="w-4 h-4 rounded border-white/[0.08] bg-zinc-900 text-blue-600 focus:ring-blue-500" />
            <span className="text-sm text-gray-300">Free course</span>
          </label>
          {!isFree && (
            <div>
              <label className="block text-sm text-gray-400 mb-1.5">Price</label>
              <input type="number" step="0.01" min="0" value={price} onChange={e => setPrice(e.target.value)}
                className="w-full bg-zinc-900 border border-white/[0.08] rounded-xl px-4 py-2.5 text-white focus:outline-none focus:border-blue-500/50 text-sm" />
            </div>
          )}
          <div>
            <label className="block text-sm text-gray-400 mb-1.5">Status</label>
            <select value={status} onChange={e => setStatus(e.target.value as 'DRAFT' | 'PUBLISHED' | 'ARCHIVED')}
              className="w-full bg-zinc-900 border border-white/[0.08] rounded-xl px-4 py-2.5 text-gray-300 focus:outline-none focus:border-blue-500/50 text-sm">
              <option value="DRAFT">Draft</option>
              <option value="PUBLISHED">Published</option>
              <option value="ARCHIVED">Archived</option>
            </select>
          </div>
          <div className="flex gap-3 pt-2">
            <button type="submit" disabled={updateMutation.isPending}
              className="px-6 py-2.5 rounded-xl bg-blue-600 text-white text-sm font-medium hover:bg-blue-500 disabled:opacity-50 transition-colors">
              {updateMutation.isPending ? 'Saving...' : 'Save Changes'}
            </button>
            {status === 'DRAFT' && (
              <button type="button" onClick={() => { if (window.confirm('Approve and publish this course? It will be visible to all users.')) approveMutation.mutate() }} disabled={approveMutation.isPending}
                className="px-6 py-2.5 rounded-xl bg-emerald-600 text-white text-sm font-medium hover:bg-emerald-500 disabled:opacity-50 transition-colors">
                {approveMutation.isPending ? 'Publishing...' : 'Approve & Publish'}
              </button>
            )}
            <button type="button" onClick={() => router.push('/lms/admin/courses')}
              className="px-6 py-2.5 rounded-xl bg-zinc-800 text-gray-300 text-sm font-medium hover:bg-zinc-700 transition-colors">
              Cancel
            </button>
          </div>
        </form>

        <div>
          <ModulesSection courseId={courseId} variant="admin" />
        </div>
      </div>
    </div>
  )
}


