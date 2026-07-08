'use client'

import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import Link from 'next/link'
import Image from 'next/image'
import WishlistButton from '@/components/lms/WishlistButton'

export default function LMSCatalogPage() {
  const [search, setSearch] = useState('')
  const [categoryFilter, setCategoryFilter] = useState('')
  const [levelFilter, setLevelFilter] = useState('')

  const params = new URLSearchParams()
  if (search) params.set('search', search)
  if (categoryFilter) params.set('categoryId', categoryFilter)
  if (levelFilter) params.set('level', levelFilter)
  params.set('status', 'PUBLISHED')
  params.set('limit', '30')

  const { data, isLoading } = useQuery({
    queryKey: ['lms-courses', search, categoryFilter, levelFilter],
    queryFn: () => fetch(`/api/lms/courses?${params}`).then(r => r.json()),
  })

  const { data: categories } = useQuery({
    queryKey: ['lms-categories'],
    queryFn: () => fetch('/api/lms/categories').then(r => r.json()),
  })

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Hero */}
      <div className="text-center mb-12">
        <h1 className="text-4xl sm:text-5xl font-bold text-white tracking-tight mb-4">
          Expand Your Skills
        </h1>
        <div className="flex items-center justify-center gap-2 mb-2">
          <span className="text-[10px] text-blue-400 bg-blue-500/10 px-2 py-0.5 rounded-full uppercase tracking-wider">
            New
          </span>
          <span className="text-[10px] text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full uppercase tracking-wider">
            Updated
          </span>
        </div>
        <p className="text-gray-400 text-lg max-w-2xl mx-auto">
          Explore our curated courses and take your expertise to the next level.
        </p>
      </div>

      {/* Search & Filters */}
      <div className="flex flex-col sm:flex-row gap-4 mb-8">
        <input
          type="text"
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="Search courses..."
          className="flex-1 bg-zinc-900 border border-white/[0.08] rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-blue-500/50"
        />
        <select
          value={categoryFilter}
          onChange={e => setCategoryFilter(e.target.value)}
          className="bg-zinc-900 border border-white/[0.08] rounded-xl px-4 py-3 text-gray-300 focus:outline-none focus:border-blue-500/50"
        >
          <option value="">All Categories</option>
          {categories?.map((c: any) => (
            <option key={c.id} value={c.id}>{c.name}</option>
          ))}
        </select>
        <select
          value={levelFilter}
          onChange={e => setLevelFilter(e.target.value)}
          className="bg-zinc-900 border border-white/[0.08] rounded-xl px-4 py-3 text-gray-300 focus:outline-none focus:border-blue-500/50"
        >
          <option value="">All Levels</option>
          <option value="beginner">Beginner</option>
          <option value="intermediate">Intermediate</option>
          <option value="advanced">Advanced</option>
        </select>
      </div>

      {/* Course Grid */}
      {isLoading ? (
        <div className="flex justify-center py-20">
          <div className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {data?.data?.map((course: any) => (
            <Link
              key={course.id}
              href={`/lms/courses/${course.slug}`}
              className="group rounded-2xl bg-zinc-900/60 border border-white/[0.06] overflow-hidden hover:border-blue-500/30 transition-all duration-300"
            >
              <div className="aspect-video bg-zinc-800 relative overflow-hidden">
                {course.thumbnail ? (
                  <img src={course.thumbnail} alt={course.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-gray-600">
                    <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M15.75 10.5l4.72-4.72a.75.75 0 011.28.53v11.38a.75.75 0 01-1.28.53l-4.72-4.72M4.5 18.75h9a2.25 2.25 0 002.25-2.25v-9a2.25 2.25 0 00-2.25-2.25h-9A2.25 2.25 0 002.25 7.5v9a2.25 2.25 0 002.25 2.25z" />
                    </svg>
                  </div>
                )}
                <div className="absolute top-3 right-3 flex items-center gap-1.5">
                  <WishlistButton courseId={course.id} />
                  <span className="text-[10px] px-2 py-1 rounded-full bg-black/60 text-gray-300 backdrop-blur-sm">
                    {course.level || 'All Levels'}
                  </span>
                </div>
              </div>
              <div className="p-5">
                <div className="flex items-center gap-2 mb-2">
                  {course.category && (
                    <span className="text-[10px] text-blue-400 bg-blue-500/10 px-2 py-0.5 rounded-full">
                      {course.category.name}
                    </span>
                  )}
                  {course.isFree && (
                    <span className="text-[10px] text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full">
                      Free
                    </span>
                  )}
                </div>
                <h3 className="text-white font-semibold text-base group-hover:text-blue-400 transition-colors line-clamp-2">
                  {course.title}
                </h3>
                <p className="text-gray-500 text-xs mt-1 line-clamp-2">
                  {course.description}
                </p>
                <div className="flex items-center gap-4 mt-4 text-gray-500 text-xs">
                  <span className="flex items-center gap-1">
                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    {course.duration || 'Self-paced'}
                  </span>
                  <span className="flex items-center gap-1">
                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
                    </svg>
                    {course._count?.modules || 0} modules
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}

      {!isLoading && data?.data?.length === 0 && (
        <div className="text-center py-20 text-gray-500">
          <p className="text-lg">No courses found</p>
          <p className="text-sm mt-1">Try adjusting your filters</p>
        </div>
      )}
    </div>
  )
}
