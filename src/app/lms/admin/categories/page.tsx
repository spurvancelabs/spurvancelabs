'use client'

import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import toast from 'react-hot-toast'
import type { CategoryData } from '@/lib/lms/types'

export default function AdminCategoriesPage() {
  const queryClient = useQueryClient()

  const { data: categories, isLoading } = useQuery<CategoryData[]>({
    queryKey: ['lms-categories-admin'],
    queryFn: () => fetch('/api/lms/categories?includeCounts=true').then(r => r.json()),
  })

  const createMutation = useMutation({
    mutationFn: (body: { name: string; slug: string }) =>
      fetch('/api/lms/categories', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) }),
    onSuccess: () => {
      toast.success('Category created')
      queryClient.invalidateQueries({ queryKey: ['lms-categories-admin'] })
    },
    onError: () => toast.error('Failed to create category'),
  })

  const updateMutation = useMutation({
    mutationFn: ({ id, body }: { id: string; body: { name: string; slug: string } }) =>
      fetch(`/api/lms/categories/${id}`, { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) }),
    onSuccess: () => {
      toast.success('Category updated')
      queryClient.invalidateQueries({ queryKey: ['lms-categories-admin'] })
    },
    onError: () => toast.error('Failed to update category'),
  })

  const deleteMutation = useMutation({
    mutationFn: (id: string) => fetch(`/api/lms/categories/${id}`, { method: 'DELETE' }),
    onSuccess: () => {
      toast.success('Category deleted')
      queryClient.invalidateQueries({ queryKey: ['lms-categories-admin'] })
    },
    onError: () => toast.error('Failed to delete category'),
  })

  const [newName, setNewName] = useState('')
  const [newSlug, setNewSlug] = useState('')
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editName, setEditName] = useState('')
  const [editSlug, setEditSlug] = useState('')

  const autoSlug = (val: string) => {
    return val.toLowerCase().trim().replace(/[^\w\s-]/g, '').replace(/[\s_]+/g, '-').replace(/-+/g, '-').replace(/^-+|-+$/g, '')
  }

  const handleCreate = () => {
    if (!newName.trim()) { toast.error('Name is required'); return }
    const slug = newSlug.trim() || autoSlug(newName)
    createMutation.mutate({ name: newName.trim(), slug })
    setNewName('')
    setNewSlug('')
  }

  const startEdit = (cat: CategoryData) => {
    setEditingId(cat.id)
    setEditName(cat.name)
    setEditSlug(cat.slug)
  }

  const saveEdit = (id: string) => {
    if (!editName.trim()) { toast.error('Name is required'); return }
    updateMutation.mutate({ id, body: { name: editName.trim(), slug: editSlug.trim() || autoSlug(editName) } })
    setEditingId(null)
  }

  return (
    <div>
      <h1 className="text-2xl font-bold text-white mb-6">Categories</h1>

      <div className="rounded-xl bg-zinc-900 border border-white/[0.06] p-4 mb-6">
        <div className="flex gap-3 items-end">
          <div className="flex-1">
            <label className="block text-xs text-gray-500 mb-1">Name</label>
            <input
              type="text"
              value={newName}
              onChange={e => { setNewName(e.target.value); if (!newSlug) setNewSlug(autoSlug(e.target.value)) }}
              onKeyDown={e => e.key === 'Enter' && handleCreate()}
              placeholder="Category name"
              className="w-full bg-zinc-950 border border-white/[0.08] rounded-xl px-4 py-2.5 text-white placeholder-gray-500 focus:outline-none focus:border-blue-500/50 text-sm"
            />
          </div>
          <div className="flex-1">
            <label className="block text-xs text-gray-500 mb-1">Slug</label>
            <input
              type="text"
              value={newSlug}
              onChange={e => setNewSlug(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleCreate()}
              placeholder="category-slug"
              className="w-full bg-zinc-950 border border-white/[0.08] rounded-xl px-4 py-2.5 text-white placeholder-gray-500 focus:outline-none focus:border-blue-500/50 text-sm"
            />
          </div>
          <button
            onClick={handleCreate}
            disabled={createMutation.isPending}
            className="px-5 py-2.5 rounded-xl bg-blue-600 text-white text-sm font-medium hover:bg-blue-500 disabled:opacity-50 transition-colors shrink-0"
          >
            Add
          </button>
        </div>
      </div>

      <div className="rounded-xl bg-zinc-900 border border-white/[0.06] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-white/[0.06]">
                <th className="text-left px-5 py-3 text-gray-500 font-medium">Name</th>
                <th className="text-left px-5 py-3 text-gray-500 font-medium">Slug</th>
                <th className="text-center px-5 py-3 text-gray-500 font-medium">Courses</th>
                <th className="text-right px-5 py-3 text-gray-500 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                Array.from({ length: 4 }).map((_, i) => (
                  <tr key={i} className="border-b border-white/[0.03]">
                    {Array.from({ length: 4 }).map((_, j) => (
                      <td key={j} className="px-5 py-3"><div className="h-4 bg-zinc-800 rounded animate-pulse" style={{ width: `${50 + Math.random() * 40}%` }} /></td>
                    ))}
                  </tr>
                ))
              ) : categories?.length === 0 ? (
                <tr><td colSpan={4} className="px-5 py-8 text-center text-gray-500">No categories yet</td></tr>
              ) : (
                categories?.map((cat) => (
                  <tr key={cat.id} className="border-b border-white/[0.03] hover:bg-white/[0.02]">
                    {editingId === cat.id ? (
                      <>
                        <td className="px-5 py-2">
                          <input type="text" value={editName} onChange={e => setEditName(e.target.value)}
                            className="w-full bg-zinc-800 border border-white/[0.08] rounded-lg px-3 py-1.5 text-white text-sm focus:outline-none focus:border-blue-500/50" />
                        </td>
                        <td className="px-5 py-2">
                          <input type="text" value={editSlug} onChange={e => setEditSlug(e.target.value)}
                            className="w-full bg-zinc-800 border border-white/[0.08] rounded-lg px-3 py-1.5 text-white text-sm focus:outline-none focus:border-blue-500/50" />
                        </td>
                        <td className="px-5 py-2 text-center text-gray-400">{cat._count?.courses ?? 0}</td>
                        <td className="px-5 py-2 text-right">
                          <div className="flex items-center justify-end gap-2">
                            <button onClick={() => saveEdit(cat.id)} className="text-xs text-emerald-400 hover:text-emerald-300">Save</button>
                            <button onClick={() => setEditingId(null)} className="text-xs text-gray-500 hover:text-white">Cancel</button>
                          </div>
                        </td>
                      </>
                    ) : (
                      <>
                        <td className="px-5 py-3 text-white">{cat.name}</td>
                        <td className="px-5 py-3 text-gray-400">{cat.slug}</td>
                        <td className="px-5 py-3 text-center text-gray-400">{cat._count?.courses ?? 0}</td>
                        <td className="px-5 py-3 text-right">
                          <div className="flex items-center justify-end gap-2">
                            <button onClick={() => startEdit(cat)} className="px-3 py-1.5 text-xs rounded-lg bg-blue-500/10 text-blue-400 hover:bg-blue-500/20 transition-colors">Edit</button>
                            <button onClick={() => { if (window.confirm(`Delete "${cat.name}"?`)) deleteMutation.mutate(cat.id) }} className="px-3 py-1.5 text-xs rounded-lg bg-red-500/10 text-red-400 hover:bg-red-500/20 transition-colors">Delete</button>
                          </div>
                        </td>
                      </>
                    )}
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
