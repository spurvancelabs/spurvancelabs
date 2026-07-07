'use client'

import { useState, useCallback } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useRouter } from 'next/navigation'
import toast from 'react-hot-toast'
import type { CategoryData } from '@/lib/lms/types'

export default function NewCoursePage() {
  const router = useRouter()
  const queryClient = useQueryClient()

  const [title, setTitle] = useState('')
  const [slug, setSlug] = useState('')
  const [description, setDescription] = useState('')
  const [level, setLevel] = useState('beginner')
  const [categoryId, setCategoryId] = useState('')
  const [isFree, setIsFree] = useState(true)
  const [price, setPrice] = useState('')
  const [status, setStatus] = useState<'DRAFT' | 'PUBLISHED'>('DRAFT')

  const { data: categories } = useQuery<CategoryData[]>({
    queryKey: ['lms-categories'],
    queryFn: () => fetch('/api/lms/categories').then(r => r.json()),
  })

  const autoSlug = useCallback((val: string) => {
    setTitle(val)
    setSlug(val.toLowerCase().trim().replace(/[^\w\s-]/g, '').replace(/[\s_]+/g, '-').replace(/-+/g, '-').replace(/^-+|-+$/g, ''))
  }, [])

  const createMutation = useMutation({
    mutationFn: (body: Record<string, unknown>) =>
      fetch('/api/lms/courses', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) }),
    onSuccess: () => {
      toast.success('Course created')
      queryClient.invalidateQueries({ queryKey: ['lms-admin-courses'] })
      router.push('/lms/admin/courses')
    },
    onError: () => toast.error('Failed to create course'),
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!title.trim()) { toast.error('Title is required'); return }
    createMutation.mutate({
      title: title.trim(),
      slug: slug.trim() || undefined,
      description: description.trim() || undefined,
      level,
      categoryId: categoryId || undefined,
      isFree,
      price: isFree ? undefined : (price ? parseFloat(price) : undefined),
      status,
    })
  }

  return (
    <div className="max-w-2xl">
      <h1 className="text-2xl font-bold text-white mb-6">New Course</h1>

      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label className="block text-sm text-gray-400 mb-1.5">Title</label>
          <input
            type="text"
            value={title}
            onChange={e => autoSlug(e.target.value)}
            className="w-full bg-zinc-900 border border-white/[0.08] rounded-xl px-4 py-2.5 text-white placeholder-gray-500 focus:outline-none focus:border-blue-500/50 text-sm"
            required
          />
        </div>

        <div>
          <label className="block text-sm text-gray-400 mb-1.5">Slug</label>
          <input
            type="text"
            value={slug}
            onChange={e => setSlug(e.target.value)}
            className="w-full bg-zinc-900 border border-white/[0.08] rounded-xl px-4 py-2.5 text-white placeholder-gray-500 focus:outline-none focus:border-blue-500/50 text-sm"
          />
        </div>

        <div>
          <label className="block text-sm text-gray-400 mb-1.5">Description</label>
          <textarea
            value={description}
            onChange={e => setDescription(e.target.value)}
            rows={4}
            className="w-full bg-zinc-900 border border-white/[0.08] rounded-xl px-4 py-2.5 text-white placeholder-gray-500 focus:outline-none focus:border-blue-500/50 text-sm resize-none"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm text-gray-400 mb-1.5">Level</label>
            <select
              value={level}
              onChange={e => setLevel(e.target.value)}
              className="w-full bg-zinc-900 border border-white/[0.08] rounded-xl px-4 py-2.5 text-gray-300 focus:outline-none focus:border-blue-500/50 text-sm"
            >
              <option value="beginner">Beginner</option>
              <option value="intermediate">Intermediate</option>
              <option value="advanced">Advanced</option>
            </select>
          </div>

          <div>
            <label className="block text-sm text-gray-400 mb-1.5">Category</label>
            <select
              value={categoryId}
              onChange={e => setCategoryId(e.target.value)}
              className="w-full bg-zinc-900 border border-white/[0.08] rounded-xl px-4 py-2.5 text-gray-300 focus:outline-none focus:border-blue-500/50 text-sm"
            >
              <option value="">None</option>
              {categories?.map((c) => (
                <option key={c.id} value={c.id}>{c.name}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={isFree}
              onChange={e => setIsFree(e.target.checked)}
              className="w-4 h-4 rounded border-white/[0.08] bg-zinc-900 text-blue-600 focus:ring-blue-500"
            />
            <span className="text-sm text-gray-300">Free course</span>
          </label>
        </div>

        {!isFree && (
          <div>
            <label className="block text-sm text-gray-400 mb-1.5">Price</label>
            <input
              type="number"
              step="0.01"
              min="0"
              value={price}
              onChange={e => setPrice(e.target.value)}
              className="w-full bg-zinc-900 border border-white/[0.08] rounded-xl px-4 py-2.5 text-white placeholder-gray-500 focus:outline-none focus:border-blue-500/50 text-sm"
            />
          </div>
        )}

        <div>
          <label className="block text-sm text-gray-400 mb-1.5">Status</label>
          <select
            value={status}
            onChange={e => setStatus(e.target.value as 'DRAFT' | 'PUBLISHED')}
            className="w-full bg-zinc-900 border border-white/[0.08] rounded-xl px-4 py-2.5 text-gray-300 focus:outline-none focus:border-blue-500/50 text-sm"
          >
            <option value="DRAFT">Draft</option>
            <option value="PUBLISHED">Published</option>
          </select>
        </div>

        <div className="flex gap-3 pt-2">
          <button
            type="submit"
            disabled={createMutation.isPending}
            className="px-6 py-2.5 rounded-xl bg-blue-600 text-white text-sm font-medium hover:bg-blue-500 disabled:opacity-50 transition-colors"
          >
            {createMutation.isPending ? 'Creating...' : 'Create Course'}
          </button>
          <button
            type="button"
            onClick={() => router.back()}
            className="px-6 py-2.5 rounded-xl bg-zinc-800 text-gray-300 text-sm font-medium hover:bg-zinc-700 transition-colors"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  )
}
