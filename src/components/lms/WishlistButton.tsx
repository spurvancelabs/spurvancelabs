'use client'

import { useState, useEffect } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useRouter } from 'next/navigation'
import { wishlistApi } from '@/lib/lms/api'

function hasToken(): boolean {
  if (typeof document === 'undefined') return false
  return document.cookie.split(';').some(c => c.trim().startsWith('token='))
}

export default function WishlistButton({ courseId, className = '' }: { courseId: string; className?: string }) {
  const router = useRouter()
  const qc = useQueryClient()
  const [isAuthenticated, setIsAuthenticated] = useState(false)

  useEffect(() => {
    setIsAuthenticated(hasToken())
  }, [])

  const { data: wishlist } = useQuery({
    queryKey: ['wishlist'],
    queryFn: wishlistApi.list,
    enabled: isAuthenticated,
    retry: false,
  })

  const toggle = useMutation({
    mutationFn: () => wishlistApi.toggle(courseId),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['wishlist'] })
    },
  })

  const isWishlisted = wishlist?.some((item: any) => item.courseId === courseId)

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (!isAuthenticated) {
      router.push('/login')
      return
    }
    toggle.mutate()
  }

  if (!isAuthenticated) {
    return (
      <button
        onClick={handleClick}
        className={`p-1.5 rounded-full transition-all text-gray-400 bg-black/40 hover:text-red-300 hover:bg-black/60 ${className}`}
        title="Login to save to wishlist"
      >
        <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" />
        </svg>
      </button>
    )
  }

  return (
    <button
      onClick={handleClick}
      disabled={toggle.isPending}
      className={`p-1.5 rounded-full transition-all ${isWishlisted ? 'text-red-400 bg-red-500/10 hover:bg-red-500/20' : 'text-gray-400 bg-black/40 hover:text-red-300 hover:bg-black/60'} ${className}`}
      title={isWishlisted ? 'Remove from wishlist' : 'Add to wishlist'}
    >
      <svg className="w-4 h-4" viewBox="0 0 24 24" fill={isWishlisted ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" />
      </svg>
    </button>
  )
}
