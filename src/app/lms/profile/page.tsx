'use client'

import { useQuery } from '@tanstack/react-query'
import Link from 'next/link'
import { getRoleColor, getRoleLabel } from '@/lib/lms/roles'

function StatCard({ label, value, href }: { label: string; value: string | number; href?: string }) {
  const inner = (
    <div className="rounded-2xl bg-zinc-900/60 border border-white/[0.06] p-5 text-center hover:border-blue-500/30 transition-all">
      <p className="text-3xl font-bold text-white mb-1">{value}</p>
      <p className="text-gray-400 text-sm">{label}</p>
    </div>
  )
  return href ? <Link href={href}>{inner}</Link> : inner
}

export default function ProfilePage() {
  const { data, isLoading } = useQuery({
    queryKey: ['my-profile'],
    queryFn: () => fetch('/api/lms/profile').then(r => r.json()),
  })

  if (isLoading) {
    return (
      <div className="flex justify-center py-20">
        <div className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  if (!data) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 text-center text-gray-500">
        <p>Please log in to view your profile.</p>
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Profile Header */}
      <div className="rounded-2xl bg-zinc-900/60 border border-white/[0.06] p-6 sm:p-8 mb-8">
        <div className="flex items-center gap-6">
          <div className="w-16 h-16 rounded-full bg-blue-500/10 flex items-center justify-center text-2xl font-bold text-blue-400">
            {(data.name || data.email || '?')[0].toUpperCase()}
          </div>
          <div>
            <h1 className="text-2xl font-bold text-white">{data.name || 'Student'}</h1>
            <p className="text-gray-400 text-sm mt-1">{data.email}</p>
            <span className={`inline-block mt-2 text-[10px] px-2 py-0.5 rounded-full border ${getRoleColor(data.role)}`}>{getRoleLabel(data.role)}</span>
          </div>
        </div>
      </div>

      {/* Stats */}
      <h2 className="text-lg font-semibold text-white mb-4">Learning Stats</h2>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
        <StatCard label="Enrolled" value={data.stats?.enrollments ?? 0} href="/lms/my-courses" />
        <StatCard label="Completed" value={data.stats?.completedEnrollments ?? 0} href="/lms/my-courses" />
        <StatCard label="Certificates" value={data.stats?.certificates ?? 0} href="/lms/certificates" />
        <StatCard label="Wishlist" value={data.stats?.wishlistCount ?? 0} href="/lms/wishlist" />
      </div>

      {/* Quick Links */}
      <h2 className="text-lg font-semibold text-white mb-4">Quick Links</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Link href="/lms/my-courses" className="rounded-2xl bg-zinc-900/60 border border-white/[0.06] p-5 hover:border-blue-500/30 transition-all flex items-center gap-4">
          <div className="w-10 h-10 rounded-xl bg-blue-500/10 flex items-center justify-center">
            <svg className="w-5 h-5 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25" />
            </svg>
          </div>
          <div>
            <p className="text-white font-medium text-sm">My Learning</p>
            <p className="text-gray-500 text-xs mt-0.5">Continue your courses</p>
          </div>
        </Link>
        <Link href="/lms/certificates" className="rounded-2xl bg-zinc-900/60 border border-white/[0.06] p-5 hover:border-blue-500/30 transition-all flex items-center gap-4">
          <div className="w-10 h-10 rounded-xl bg-emerald-500/10 flex items-center justify-center">
            <svg className="w-5 h-5 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12.75L11.25 15 15 9.75M21 12c0 1.268-.63 2.39-1.593 3.068a3.745 3.745 0 01-1.043 3.296 3.745 3.745 0 01-3.296 1.043A3.745 3.745 0 0112 21c-1.268 0-2.39-.63-3.068-1.593a3.746 3.746 0 01-3.296-1.043 3.745 3.745 0 01-1.043-3.296A3.745 3.745 0 013 12c0-1.268.63-2.39 1.593-3.068a3.745 3.745 0 011.043-3.296 3.746 3.746 0 013.296-1.043A3.746 3.746 0 0112 3c1.268 0 2.39.63 3.068 1.593a3.746 3.746 0 013.296 1.043 3.746 3.746 0 011.043 3.296A3.745 3.745 0 0121 12z" />
            </svg>
          </div>
          <div>
            <p className="text-white font-medium text-sm">Certificates</p>
            <p className="text-gray-500 text-xs mt-0.5">View your earned certificates</p>
          </div>
        </Link>
        <Link href="/lms/wishlist" className="rounded-2xl bg-zinc-900/60 border border-white/[0.06] p-5 hover:border-blue-500/30 transition-all flex items-center gap-4">
          <div className="w-10 h-10 rounded-xl bg-red-500/10 flex items-center justify-center">
            <svg className="w-5 h-5 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" />
            </svg>
          </div>
          <div>
            <p className="text-white font-medium text-sm">Wishlist</p>
            <p className="text-gray-500 text-xs mt-0.5">Courses saved for later</p>
          </div>
        </Link>
        <Link href="/lms" className="rounded-2xl bg-zinc-900/60 border border-white/[0.06] p-5 hover:border-blue-500/30 transition-all flex items-center gap-4">
          <div className="w-10 h-10 rounded-xl bg-purple-500/10 flex items-center justify-center">
            <svg className="w-5 h-5 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 21a9.004 9.004 0 008.716-6.747M12 21a9.004 9.004 0 01-8.716-6.747M12 21c2.485 0 4.5-4.03 4.5-9S14.485 3 12 3m0 18c-2.485 0-4.5-4.03-4.5-9S9.515 3 12 3m0 0a8.997 8.997 0 017.843 4.582M12 3a8.997 8.997 0 00-7.843 4.582m15.686 0A11.953 11.953 0 0112 10.5c-2.998 0-5.74-1.1-7.843-2.918m15.686 0A8.959 8.959 0 0121 12c0 .778-.099 1.533-.284 2.253m0 0A17.919 17.919 0 0112 16.5c-3.162 0-6.133-.815-8.716-2.247m0 0A9.015 9.015 0 013 12c0-1.605.42-3.113 1.157-4.418" />
            </svg>
          </div>
          <div>
            <p className="text-white font-medium text-sm">Browse Courses</p>
            <p className="text-gray-500 text-xs mt-0.5">Explore new topics</p>
          </div>
        </Link>
      </div>
    </div>
  )
}
