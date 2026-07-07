'use client'

import { useQuery } from '@tanstack/react-query'
import Link from 'next/link'
import WishlistButton from '@/components/lms/WishlistButton'
import { wishlistApi } from '@/lib/lms/api'

export default function WishlistPage() {
  const { data, isLoading } = useQuery({
    queryKey: ['wishlist'],
    queryFn: wishlistApi.list,
  })

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-white">My Wishlist</h1>
          <p className="text-gray-400 mt-1">Courses you&apos;ve saved for later</p>
        </div>
        <Link href="/lms" className="text-sm text-blue-400 hover:text-blue-300 transition-colors">
          Browse Courses
        </Link>
      </div>

      {isLoading ? (
        <div className="flex justify-center py-20">
          <div className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
        </div>
      ) : !data?.length ? (
        <div className="text-center py-20 text-gray-500">
          <svg className="w-16 h-16 mx-auto mb-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" />
          </svg>
          <p className="text-lg">Your wishlist is empty</p>
          <Link href="/lms" className="text-blue-400 hover:text-blue-300 text-sm mt-2 inline-block">
            Explore courses
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {data.map((item: any) => {
            const c = item.course
            return (
              <Link
                key={item.id}
                href={`/lms/courses/${c.slug}`}
                className="group rounded-2xl bg-zinc-900/60 border border-white/[0.06] overflow-hidden hover:border-red-500/30 transition-all duration-300 relative"
              >
                <div className="aspect-video bg-zinc-800 relative overflow-hidden">
                  {c.thumbnail ? (
                    <img src={c.thumbnail} alt={c.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-600">
                      <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M15.75 10.5l4.72-4.72a.75.75 0 011.28.53v11.38a.75.75 0 01-1.28.53l-4.72-4.72M4.5 18.75h9a2.25 2.25 0 002.25-2.25v-9a2.25 2.25 0 00-2.25-2.25h-9A2.25 2.25 0 002.25 7.5v9a2.25 2.25 0 002.25 2.25z" />
                      </svg>
                    </div>
                  )}
                  <div className="absolute top-3 right-3">
                    <WishlistButton courseId={c.id} />
                  </div>
                </div>
                <div className="p-5">
                  <div className="flex items-center gap-2 mb-2">
                    {c.category && (
                      <span className="text-[10px] text-blue-400 bg-blue-500/10 px-2 py-0.5 rounded-full">{c.category.name}</span>
                    )}
                    {c.isFree && (
                      <span className="text-[10px] text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full">Free</span>
                    )}
                  </div>
                  <h3 className="text-white font-semibold text-base group-hover:text-red-400 transition-colors line-clamp-2">
                    {c.title}
                  </h3>
                  <p className="text-gray-500 text-xs mt-1 line-clamp-2">{c.description}</p>
                  <div className="flex items-center gap-4 mt-4 text-gray-500 text-xs">
                    <span>{c._count?.modules || 0} modules</span>
                    <span>{c._count?.enrollments || 0} students</span>
                  </div>
                </div>
              </Link>
            )
          })}
        </div>
      )}
    </div>
  )
}
