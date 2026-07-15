'use client'

import { use } from 'react'
import Link from 'next/link'
import { useQuery } from '@tanstack/react-query'
import toast from 'react-hot-toast'

export default function VerifyByCodePage({ params }: { params: Promise<{ code: string }> }) {
  const { code } = use(params)

  const { data, isLoading, error } = useQuery({
    queryKey: ['verify-certificate', code],
    queryFn: async () => {
      const res = await fetch(`/api/verify/certificate/${encodeURIComponent(code)}`)
      const data = await res.json()
      if (!res.ok || !data.valid) throw new Error(data.error || 'Certificate not found')
      return data
    },
    enabled: !!code,
  })

  if (isLoading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
          <p className="text-gray-400 text-sm">Verifying certificate...</p>
        </div>
      </div>
    )
  }

  if (error || !data?.valid) {
    return (
      <div className="min-h-screen bg-black">
        <Header />
        <main className="max-w-2xl mx-auto px-4 py-24">
          <div className="text-center">
            <div className="w-16 h-16 rounded-full bg-red-500/10 flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </div>
            <h1 className="text-2xl font-bold text-white mb-2">Certificate Not Found</h1>
            <p className="text-gray-400 mb-6">The certificate with this verification code could not be verified.</p>
            <Link href="/verify" className="text-blue-400 hover:text-blue-300 text-sm">Try another code →</Link>
          </div>
        </main>
      </div>
    )
  }

  const cert = data.certificate

  return (
    <div className="min-h-screen bg-black">
      <Header />
      <main className="max-w-2xl mx-auto px-4 py-24">
        <div className="rounded-2xl bg-zinc-900/60 border border-white/[0.06] p-8 max-w-md mx-auto">
          <div className="flex flex-col items-center text-center mb-6">
            <div className="w-16 h-16 rounded-full bg-green-500/10 flex items-center justify-center mb-4">
              <svg className="w-8 h-8 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12.75L11.25 15 15 9.75M21 12c0 1.268-.63 2.39-1.593 3.068a3.745 3.745 0 01-1.043 3.296 3.745 3.745 0 01-3.296 1.043A3.745 3.745 0 0112 21c-1.268 0-2.39-.63-3.068-1.593a3.746 3.746 0 01-3.296-1.043 3.745 3.745 0 01-1.043-3.296A3.745 3.745 0 013 12c0-1.268.63-2.39 1.593-3.068a3.745 3.745 0 011.043-3.296 3.746 3.746 0 013.296-1.043A3.746 3.746 0 0112 3c1.268 0 2.39.63 3.068 1.593a3.746 3.746 0 013.296 1.043 3.746 3.746 0 011.043 3.296A3.745 3.745 0 0121 12z" />
              </svg>
            </div>
            <h1 className="text-2xl font-bold text-white">✓ Verified</h1>
            <p className="text-gray-400 text-sm mt-1">This is a valid Spurvance certificate</p>
          </div>
          <div className="space-y-3 text-sm">
            <div className="flex justify-between py-2 border-b border-white/[0.06]">
              <span className="text-gray-500">Student</span>
              <span className="text-white font-medium">{cert.studentName}</span>
            </div>
            <div className="flex justify-between py-2 border-b border-white/[0.06]">
              <span className="text-gray-500">Course</span>
              <span className="text-white font-medium">{cert.courseTitle}</span>
            </div>
            <div className="flex justify-between py-2 border-b border-white/[0.06]">
              <span className="text-gray-500">Issued</span>
              <span className="text-white">{new Date(cert.issuedAt).toLocaleDateString()}</span>
            </div>
            <div className="flex justify-between py-2">
              <span className="text-gray-500">Code</span>
              <span className="text-white font-mono text-xs">{cert.id}</span>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}

function Header() {
  return (
    <header className="border-b border-white/[0.06] bg-zinc-950/90 backdrop-blur-xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center gap-3">
        <Link href="/" className="flex items-center gap-3">
          <img src="/spurvance-logo-removebg-preview.png" alt="Spurvance" className="w-8 h-8 object-contain" />
          <span className="text-white font-semibold">Spurvance</span>
        </Link>
        <span className="text-gray-500">/</span>
        <span className="text-gray-400 text-sm">Certificate Verification</span>
      </div>
    </header>
  )
}
