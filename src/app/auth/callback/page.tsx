'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'

export default function AuthCallback() {
  const router = useRouter()

  useEffect(() => {
    const hash = window.location.hash

    if (!hash) {
      router.push('/login')
      return
    }

    const params = new URLSearchParams(hash.replace('#', ''))

    const access_token = params.get('access_token')
    const refresh_token = params.get('refresh_token')

    if (access_token) {
      // optional: send to backend to set cookies
      fetch('/api/auth/session', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ access_token, refresh_token }),
      })
    }

    router.push('/dashboard')
  }, [])

  return (
    <div className="flex items-center justify-center min-h-screen text-white bg-black">
      Loading...
    </div>
  )
}