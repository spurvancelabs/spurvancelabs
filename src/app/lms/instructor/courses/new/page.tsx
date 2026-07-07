'use client'

import { useState, useCallback } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useRouter } from 'next/navigation'
import toast from 'react-hot-toast'
import { ModulesSection } from '@/components/lms/ModulesSection'
import type { CategoryData, ModuleData } from '@/lib/lms/types'

const steps = [
  { num: 1, label: 'Course Info' },
  { num: 2, label: 'Modules & Lessons' },
  { num: 3, label: 'Review & Save' },
]

export default function NewCoursePage() {
  const router = useRouter()
  const queryClient = useQueryClient()

  const [step, setStep] = useState(1)
  const [courseId, setCourseId] = useState<string | null>(null)

  const [title, setTitle] = useState('')
  const [slug, setSlug] = useState('')
  const [description, setDescription] = useState('')
  const [thumbnail, setThumbnail] = useState('')
  const [thumbnailUploading, setThumbnailUploading] = useState(false)
  const [duration, setDuration] = useState('')
  const [level, setLevel] = useState('beginner')
  const [categoryId, setCategoryId] = useState('')
  const [isFree, setIsFree] = useState(true)
  const [price, setPrice] = useState('')

  const { data: categories } = useQuery<CategoryData[]>({
    queryKey: ['lms-categories'],
    queryFn: () => fetch('/api/lms/categories').then(r => r.json()),
  })

  const autoSlug = useCallback((val: string) => {
    setTitle(val)
    setSlug(val.toLowerCase().trim().replace(/[^\w\s-]/g, '').replace(/[\s_]+/g, '-').replace(/-+/g, '-').replace(/^-+|-+$/g, ''))
  }, [])

  const createMutation = useMutation({
    mutationFn: async (body: Record<string, unknown>) => {
      const res = await fetch('/api/lms/courses', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) })
      if (!res.ok) throw new Error('Failed')
      return res.json()
    },
    onSuccess: (course) => {
      toast.success('Course created')
      queryClient.invalidateQueries({ queryKey: ['instructor-courses'] })
      setCourseId(course.id)
      setStep(2)
    },
    onError: () => toast.error('Failed to create course'),
  })

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

  const getMissingFields = () => {
    const missing: string[] = []
    if (!title.trim()) missing.push('Title')
    if (!description.trim()) missing.push('Description')
    return missing
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const missing = getMissingFields()
    if (missing.length > 0) {
      toast.error(`Please fill in: ${missing.join(', ')}`)
      return
    }
    createMutation.mutate({
      title: title.trim(),
      slug: slug.trim() || undefined,
      description: description.trim() || undefined,
      thumbnail: thumbnail || undefined,
      duration: duration ? parseInt(duration, 10) : undefined,
      level,
      categoryId: categoryId || undefined,
      isFree,
      price: isFree ? undefined : (price ? parseFloat(price) : undefined),
    })
  }

  const handleStep2Next = async (cid: string) => {
    try {
      const res = await fetch(`/api/lms/modules?courseId=${cid}`)
      const modules = await res.json()
      if (!Array.isArray(modules) || modules.length === 0) {
        toast.error('Add at least one module before reviewing')
        return
      }
      const totalLessons = modules.reduce((sum: number, m: any) => sum + (m._count?.lessons ?? 0), 0)
      if (totalLessons === 0) {
        toast.error('Add at least one lesson before reviewing')
        return
      }
      setStep(3)
    } catch {
      toast.error('Failed to check course content')
    }
  }

  const handleStepClick = (num: number) => setStep(num)

  return (
    <div className="max-w-2xl">
      <div className="flex items-center gap-3 mb-6" onClick={e => { const target = (e.target as HTMLElement).closest('[data-step]'); if (target) setStep(Number(target.getAttribute('data-step'))); }}>
        {steps.map(s => (
          <div key={s.num} data-step={s.num} className="flex items-center gap-2 cursor-pointer group">
            <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-medium transition-colors ${step >= s.num ? 'bg-amber-600 text-white' : 'bg-zinc-800 text-gray-500'} group-hover:opacity-80`}>
              {s.num}
            </div>
            <span className={`text-sm hidden sm:inline transition-colors ${step >= s.num ? 'text-white' : 'text-gray-500'} group-hover:text-amber-400`}>{s.label}</span>
            {s.num < steps.length && <div className={`w-8 h-px mx-1 ${step > s.num ? 'bg-amber-600' : 'bg-zinc-700'}`} />}
          </div>
        ))}
      </div>

      {step === 1 && (
        <form onSubmit={handleSubmit} className="space-y-5">
          <h1 className="text-2xl font-bold text-white">New Course</h1>

          <div>
            <label className="block text-sm text-gray-400 mb-1.5">Title</label>
            <input
              type="text"
              value={title}
              onChange={e => autoSlug(e.target.value)}
              placeholder="e.g. Complete Web Development Bootcamp"
              className="w-full bg-zinc-900 border border-white/[0.08] rounded-xl px-4 py-2.5 text-white placeholder-gray-500 focus:outline-none focus:border-amber-500/50 text-sm"
              required
            />
          </div>

          <div>
            <label className="block text-sm text-gray-400 mb-1.5">Slug</label>
            <input
              type="text"
              value={slug}
              onChange={e => setSlug(e.target.value)}
              placeholder="Auto-generated from title"
              className="w-full bg-zinc-900 border border-white/[0.08] rounded-xl px-4 py-2.5 text-white placeholder-gray-500 focus:outline-none focus:border-amber-500/50 text-sm"
            />
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

          <div>
            <label className="block text-sm text-gray-400 mb-1.5">Description</label>
            <textarea
              value={description}
              onChange={e => setDescription(e.target.value)}
              placeholder="What will students learn?"
              rows={4}
              className="w-full bg-zinc-900 border border-white/[0.08] rounded-xl px-4 py-2.5 text-white placeholder-gray-500 focus:outline-none focus:border-amber-500/50 text-sm resize-none"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm text-gray-400 mb-1.5">Level</label>
              <select value={level} onChange={e => setLevel(e.target.value)} className="w-full bg-zinc-900 border border-white/[0.08] rounded-xl px-4 py-2.5 text-gray-300 focus:outline-none focus:border-amber-500/50 text-sm">
                <option value="beginner">Beginner</option>
                <option value="intermediate">Intermediate</option>
                <option value="advanced">Advanced</option>
              </select>
            </div>
            <div>
              <label className="block text-sm text-gray-400 mb-1.5">Duration (min)</label>
              <input type="number" min="0" value={duration} onChange={e => setDuration(e.target.value)} placeholder="60" className="w-full bg-zinc-900 border border-white/[0.08] rounded-xl px-4 py-2.5 text-white placeholder-gray-500 focus:outline-none focus:border-amber-500/50 text-sm" />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm text-gray-400 mb-1.5">Category</label>
              <select value={categoryId} onChange={e => setCategoryId(e.target.value)} className="w-full bg-zinc-900 border border-white/[0.08] rounded-xl px-4 py-2.5 text-gray-300 focus:outline-none focus:border-amber-500/50 text-sm">
                <option value="">None</option>
                {categories?.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
              </select>
            </div>
            <div className="flex items-center gap-3 pt-6">
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" checked={isFree} onChange={e => setIsFree(e.target.checked)} className="w-4 h-4 rounded border-white/[0.08] bg-zinc-900 text-amber-600 focus:ring-amber-500" />
                <span className="text-sm text-gray-300">Free course</span>
              </label>
            </div>
          </div>

          {!isFree && (
            <div>
              <label className="block text-sm text-gray-400 mb-1.5">Price</label>
              <input type="number" step="0.01" min="0" value={price} onChange={e => setPrice(e.target.value)} placeholder="0.00" className="w-full bg-zinc-900 border border-white/[0.08] rounded-xl px-4 py-2.5 text-white placeholder-gray-500 focus:outline-none focus:border-amber-500/50 text-sm" />
            </div>
          )}

          <div className="flex items-center gap-2 rounded-lg bg-blue-500/5 border border-blue-500/10 px-4 py-3">
            <svg className="w-4 h-4 text-blue-400 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <p className="text-xs text-blue-300">Courses are created as draft and must be approved by an admin before being published.</p>
          </div>

          <div className="flex gap-3 pt-2">
            <button type="submit" disabled={createMutation.isPending} className="px-6 py-2.5 rounded-xl bg-amber-600 text-white text-sm font-medium hover:bg-amber-500 disabled:opacity-50 transition-colors">
              {createMutation.isPending ? 'Creating...' : 'Next'}
            </button>
            <button type="button" onClick={() => router.back()} className="px-6 py-2.5 rounded-xl bg-zinc-800 text-gray-300 text-sm font-medium hover:bg-zinc-700 transition-colors">
              Cancel
            </button>
          </div>
        </form>
      )}

      {step === 2 && (
        <div>
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-2xl font-bold text-white">Add Content</h1>
              <p className="text-sm text-gray-400 mt-1">Add modules and lessons to your course</p>
            </div>
            <button onClick={() => courseId ? handleStep2Next(courseId) : setStep(3)} className="px-4 py-2.5 rounded-xl bg-amber-600 text-white text-sm font-medium hover:bg-amber-500 transition-colors">
              Next: Review
            </button>
          </div>
          <ModulesSection courseId={courseId ?? undefined} />
        </div>
      )}

      {step === 3 && <ReviewStep courseId={courseId} title={title} description={description} level={level} isFree={isFree} price={price} onBack={() => setStep(2)} />}
    </div>
  )
}

function ReviewStep({ courseId, title, description, level, isFree, price, onBack }: { courseId: string | null; title: string; description: string; level: string; isFree: boolean; price: string; onBack: () => void }) {
  const router = useRouter()
  const queryClient = useQueryClient()

  const { data: modules } = useQuery<ModuleData[]>({
    queryKey: ['lms-modules', courseId],
    queryFn: () => fetch(`/api/lms/modules?courseId=${courseId}`).then(r => r.json()),
    enabled: !!courseId,
  })

  const totalLessons = modules?.reduce((sum, m) => sum + (m._count?.lessons ?? 0), 0) ?? 0

  const completeMutation = useMutation({
    mutationFn: () =>
      fetch(`/api/lms/courses/${courseId}`, { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ isComplete: true }) }),
    onSuccess: () => {
      toast.success('Course saved')
      queryClient.invalidateQueries({ queryKey: ['instructor-courses'] })
      router.push('/lms/instructor/courses')
    },
    onError: () => toast.error('Failed to save course'),
  })

  const moduleCount = modules?.length ?? 0
  const lessonCount = totalLessons
  const isMissingCourseInfo = !title.trim() || !description.trim()
  const isMissingContent = moduleCount === 0 || lessonCount === 0
  const canSave = !isMissingCourseInfo && !isMissingContent

  const handleSave = () => {
    if (isMissingCourseInfo) {
      toast.error('Complete course info (Title, Description) before submitting')
      return
    }
    if (isMissingContent) {
      toast.error('Add at least one module with lessons before submitting')
      return
    }
    completeMutation.mutate()
  }

  return (
    <div>
      <h1 className="text-2xl font-bold text-white mb-6">Review & Save</h1>

      <div className="space-y-4 mb-8">
        <div className="rounded-xl bg-zinc-900/60 border border-white/[0.06] p-5">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-sm font-semibold text-gray-400 uppercase tracking-wider">Course Info</h2>
            {isMissingCourseInfo && <span className="text-[10px] text-amber-400">Incomplete</span>}
          </div>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-gray-500 text-sm">Title</span>
              <span className={`text-sm font-medium ${title.trim() ? 'text-white' : 'text-red-400'}`}>{title.trim() || '(not set)'}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500 text-sm">Description</span>
              <span className={`text-sm ${description.trim() ? 'text-white' : 'text-red-400'}`}>{description.trim() ? description : '(not set)'}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500 text-sm">Level</span>
              <span className="text-white text-sm capitalize">{level}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500 text-sm">Price</span>
              <span className="text-white text-sm">{isFree ? 'Free' : `$${parseFloat(price || '0').toFixed(2)}`}</span>
            </div>
          </div>
        </div>

        <div className="rounded-xl bg-zinc-900/60 border border-white/[0.06] p-5">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-sm font-semibold text-gray-400 uppercase tracking-wider">Content</h2>
            {isMissingContent && <span className="text-[10px] text-amber-400">Incomplete</span>}
          </div>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-gray-500 text-sm">Modules</span>
              <span className={`text-sm font-medium ${moduleCount > 0 ? 'text-white' : 'text-red-400'}`}>{moduleCount}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500 text-sm">Lessons</span>
              <span className={`text-sm font-medium ${lessonCount > 0 ? 'text-white' : 'text-red-400'}`}>{lessonCount}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-2 rounded-lg bg-blue-500/5 border border-blue-500/10 px-4 py-3 mb-6">
        <svg className="w-4 h-4 text-blue-400 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <p className="text-xs text-blue-300">After saving, the course will be submitted for admin review and approval.</p>
      </div>

      <div className="flex gap-3">
        <button onClick={handleSave} disabled={completeMutation.isPending || !canSave} className="px-6 py-2.5 rounded-xl bg-amber-600 text-white text-sm font-medium hover:bg-amber-500 disabled:opacity-50 transition-colors">
          {completeMutation.isPending ? 'Saving...' : 'Save & Finish'}
        </button>
        <button onClick={onBack} className="px-6 py-2.5 rounded-xl bg-zinc-800 text-gray-300 text-sm font-medium hover:bg-zinc-700 transition-colors">
          Back
        </button>
      </div>
    </div>
  )
}
