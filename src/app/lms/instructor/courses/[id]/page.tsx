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
  const { data: course, isLoading, isError } = useQuery<CourseData>({
    queryKey: ['lms-course', courseId],
    queryFn: async () => {
      const res = await fetch(`/api/lms/courses/${courseId}`)
      if (!res.ok) throw new Error('Failed to load course')
      return res.json()
    },
    enabled: !!courseId,
  })

  const { data: categories } = useQuery<CategoryData[]>({
    queryKey: ['lms-categories'],
    queryFn: () => fetch('/api/lms/categories').then(r => r.json()),
  })

  if (isError) {
    return (
      <div className="max-w-2xl rounded-xl bg-red-500/10 border border-red-500/20 px-5 py-4">
        <p className="text-sm text-red-300">Failed to load course. Please try again.</p>
      </div>
    )
  }

  if (isLoading || !course) {
    return (
      <div className="max-w-2xl">
        <div className="h-8 w-48 bg-zinc-800 rounded animate-pulse mb-6" />
        <div className="space-y-4">
          {Array.from({ length: 6 }).map((_, i) => <div key={i} className="h-10 bg-zinc-800 rounded-xl animate-pulse" />)}
        </div>
      </div>
    )
  }

  return <CourseEditor courseId={courseId} course={course} categories={categories || []} />
}

function CourseEditor({ courseId, course, categories }: { courseId: string; course: CourseData; categories: CategoryData[] }) {
  const router = useRouter()
  const queryClient = useQueryClient()

  const [title, setTitle] = useState(course.title)
  const [slug, setSlug] = useState(course.slug)
  const [description, setDescription] = useState(course.description || '')
  const [thumbnail, setThumbnail] = useState(course.thumbnail || '')
  const [thumbnailUploading, setThumbnailUploading] = useState(false)
  const [duration, setDuration] = useState(course.duration?.toString() || '')
  const [level, setLevel] = useState(course.level || 'beginner')
  const [categoryId, setCategoryId] = useState(course.categoryId || '')
  const [isFree, setIsFree] = useState(course.isFree ?? true)
  const [price, setPrice] = useState(course.price?.toString() || '')
  const [status, setStatus] = useState<string>(course.status)

  const autoSlug = useCallback((val: string) => {
    setTitle(val)
    setSlug(val.toLowerCase().trim().replace(/[^\w\s-]/g, '').replace(/[\s_]+/g, '-').replace(/-+/g, '-').replace(/^-+|-+$/g, ''))
  }, [])

  const handleThumbnailUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    const formData = new FormData()
    formData.append('file', file)

    setThumbnailUploading(true)
    try {
      const res = await fetch('/api/upload', { method: 'POST', body: formData })
      if (!res.ok) { toast.error('Upload failed'); return }
      const { url } = await res.json()
      setThumbnail(url)
    } catch {
      toast.error('Upload failed')
    } finally {
      setThumbnailUploading(false)
    }
  }

  const updateMutation = useMutation({
    mutationFn: (body: Record<string, unknown>) =>
      fetch(`/api/lms/courses/${courseId}`, { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) }),
    onSuccess: () => {
      toast.success('Course updated')
      queryClient.invalidateQueries({ queryKey: ['lms-course', courseId] })
      queryClient.invalidateQueries({ queryKey: ['instructor-courses'] })
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
      queryClient.invalidateQueries({ queryKey: ['instructor-courses'] })
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
      thumbnail: thumbnail.trim() || undefined,
      duration: duration ? parseInt(duration, 10) : undefined,
      level,
      categoryId: categoryId || undefined,
      isFree,
      price: isFree ? null : (price ? parseFloat(price) : null),
      status,
    })
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
            <input type="text" value={title} onChange={e => autoSlug(e.target.value)} placeholder="e.g. Complete Web Development Bootcamp"
              className="w-full bg-zinc-900 border border-white/[0.08] rounded-xl px-4 py-2.5 text-white placeholder-gray-500 focus:outline-none focus:border-amber-500/50 text-sm" required />
          </div>
          <div>
            <label className="block text-sm text-gray-400 mb-1.5">Slug</label>
            <input type="text" value={slug} onChange={e => setSlug(e.target.value)} placeholder="Auto-generated from title"
              className="w-full bg-zinc-900 border border-white/[0.08] rounded-xl px-4 py-2.5 text-white placeholder-gray-500 focus:outline-none focus:border-amber-500/50 text-sm" />
          </div>
          <div>
            <label className="block text-sm text-gray-400 mb-1.5">Description</label>
            <textarea value={description} onChange={e => setDescription(e.target.value)} placeholder="What will students learn?" rows={4}
              className="w-full bg-zinc-900 border border-white/[0.08] rounded-xl px-4 py-2.5 text-white placeholder-gray-500 focus:outline-none focus:border-amber-500/50 text-sm resize-none" />
          </div>
          <div>
            <label className="block text-sm text-gray-400 mb-1.5">Thumbnail</label>
            <label className="cursor-pointer group block">
              <div className="relative w-52 h-28 rounded-lg border-2 border-dashed border-white/[0.12] bg-zinc-900/50 flex items-center justify-center text-gray-500 group-hover:border-amber-500/50 group-hover:text-amber-400 transition-colors overflow-hidden">
                {thumbnail ? (
                  <img src={thumbnail} alt="Thumbnail" className="absolute inset-0 w-full h-full object-cover" />
                ) : (
                  <div className="flex flex-col items-center gap-1">
                    <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    <span className="text-[11px] text-gray-600">Add thumbnail</span>
                  </div>
                )}
              </div>
              <span className="text-[10px] text-gray-600 mt-1 block">16:9 ratio · 1280×720px · JPG, PNG, WebP or GIF · Max 5MB</span>
              {thumbnail && (
                <button type="button" onClick={e => { e.stopPropagation(); setThumbnail('') }} className="text-xs text-red-400 hover:text-red-300 mt-1.5">
                  Remove
                </button>
              )}
              {thumbnailUploading && <span className="text-xs text-amber-400 mt-1">Uploading...</span>}
              <input type="file" accept="image/jpeg,image/png,image/webp,image/gif" onChange={handleThumbnailUpload} className="hidden" />
            </label>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm text-gray-400 mb-1.5">Level</label>
              <select value={level} onChange={e => setLevel(e.target.value)}
                className="w-full bg-zinc-900 border border-white/[0.08] rounded-xl px-4 py-2.5 text-gray-300 focus:outline-none focus:border-amber-500/50 text-sm">
                <option value="beginner">Beginner</option>
                <option value="intermediate">Intermediate</option>
                <option value="advanced">Advanced</option>
              </select>
            </div>
            <div>
              <label className="block text-sm text-gray-400 mb-1.5">Category</label>
              <select value={categoryId} onChange={e => setCategoryId(e.target.value)}
                className="w-full bg-zinc-900 border border-white/[0.08] rounded-xl px-4 py-2.5 text-gray-300 focus:outline-none focus:border-amber-500/50 text-sm">
                <option value="">None</option>
                {categories?.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
              </select>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm text-gray-400 mb-1.5">Duration (min)</label>
              <input type="number" min="0" value={duration} onChange={e => setDuration(e.target.value)} placeholder="60"
                className="w-full bg-zinc-900 border border-white/[0.08] rounded-xl px-4 py-2.5 text-white placeholder-gray-500 focus:outline-none focus:border-amber-500/50 text-sm" />
            </div>
            <div className="flex items-end pb-1.5">
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" checked={isFree} onChange={e => setIsFree(e.target.checked)}
                  className="w-4 h-4 rounded border-white/[0.08] bg-zinc-900 text-amber-600 focus:ring-amber-500" />
                <span className="text-sm text-gray-300">Free course</span>
              </label>
            </div>
          </div>
          {!isFree && (
            <div>
              <label className="block text-sm text-gray-400 mb-1.5">Price</label>
              <input type="number" step="0.01" min="0" value={price} onChange={e => setPrice(e.target.value)} placeholder="0.00"
                className="w-full bg-zinc-900 border border-white/[0.08] rounded-xl px-4 py-2.5 text-white placeholder-gray-500 focus:outline-none focus:border-amber-500/50 text-sm" />
            </div>
          )}
          <div>
            <label className="block text-sm text-gray-400 mb-1.5">Status</label>
            <select value={status} onChange={e => setStatus(e.target.value as string)}
              className="w-full bg-zinc-900 border border-white/[0.08] rounded-xl px-4 py-2.5 text-gray-300 focus:outline-none focus:border-amber-500/50 text-sm">
              <option value="DRAFT">Draft</option>
              <option value="PUBLISHED">Published</option>
              <option value="ARCHIVED">Archived</option>
            </select>
            {status === 'DRAFT' && (
              <div className="mt-3 flex items-center gap-1.5 rounded-lg bg-blue-500/5 border border-blue-500/10 px-3 py-2">
                <svg className="w-3.5 h-3.5 text-blue-400 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <p className="text-[11px] text-blue-300">Approve this course to publish it for students.</p>
              </div>
            )}
            {status === 'ARCHIVED' && (
              <div className="mt-3 flex items-center gap-1.5 rounded-lg bg-gray-500/5 border border-gray-500/10 px-3 py-2">
                <p className="text-[11px] text-gray-400">This course is archived and hidden from students.</p>
              </div>
            )}
          </div>
          <div className="flex gap-3 pt-2">
            <button type="submit" disabled={updateMutation.isPending}
              className="px-6 py-2.5 rounded-xl bg-amber-600 text-white text-sm font-medium hover:bg-amber-500 disabled:opacity-50 transition-colors">
              {updateMutation.isPending ? 'Saving...' : 'Save Changes'}
            </button>
            {status === 'DRAFT' && (
              <button type="button" onClick={() => { if (window.confirm('Approve and publish this course? It will be visible to all users.')) approveMutation.mutate() }} disabled={approveMutation.isPending}
                className="px-6 py-2.5 rounded-xl bg-emerald-600 text-white text-sm font-medium hover:bg-emerald-500 disabled:opacity-50 transition-colors">
                {approveMutation.isPending ? 'Publishing...' : 'Approve & Publish'}
              </button>
            )}
            <button type="button" onClick={() => router.push('/lms/instructor/courses')}
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
