'use client'

import { useState, useRef } from 'react'
import Link from 'next/link'
import { useMutation } from '@tanstack/react-query'
import toast from 'react-hot-toast'
import { createWorker } from 'tesseract.js'

const UUID_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i

type VerifyResult = {
  valid: boolean
  certificate?: {
    id: string
    verificationCode: string
    studentName: string
    studentEmail: string
    courseTitle: string
    issuedAt: string
  }
  error?: string
}

export default function VerifyPage() {
  const [tab, setTab] = useState<'code' | 'upload'>('code')
  const [code, setCode] = useState('')
  const [result, setResult] = useState<VerifyResult | null>(null)
  const [ocrProgress, setOcrProgress] = useState('')
  const fileRef = useRef<HTMLInputElement>(null)

  const verifyMutation = useMutation({
    mutationFn: async (verificationCode: string) => {
      const res = await fetch(`/api/verify/certificate/${encodeURIComponent(verificationCode)}`)
      const data = await res.json()
      if (!res.ok || !data.valid) throw new Error(data.error || 'Certificate not found')
      return data as VerifyResult
    },
    onSuccess: (data) => {
      setResult(data)
      toast.success('Certificate verified successfully!')
    },
    onError: (err) => {
      setResult(null)
      toast.error(err instanceof Error ? err.message : 'Verification failed')
    },
  })

  const handleVerify = () => {
    const trimmed = code.trim()
    if (!trimmed) {
      toast.error('Please enter a verification code')
      return
    }
    if (!UUID_REGEX.test(trimmed)) {
      toast.error('Invalid verification code format')
      return
    }
    verifyMutation.mutate(trimmed)
  }

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    if (file.size > 10 * 1024 * 1024) {
      toast.error('File too large. Max 10MB.')
      return
    }
    setOcrProgress('Initializing OCR...')
    try {
      const worker = await createWorker('eng', 1, {
        logger: (m) => {
          if (m.status === 'recognizing text') setOcrProgress(`Reading text... ${Math.round(m.progress * 100)}%`)
        },
      })
      setOcrProgress('Processing image...')
      const { data } = await worker.recognize(file)
      await worker.terminate()
      const text = data.text.trim()
      if (!text) {
        toast.error('No text found in image. Try a clearer image.')
        setOcrProgress('')
        return
      }
      const extracted = extractCode(text)
      if (!extracted) {
        toast.error('No certificate code found in image.')
        setOcrProgress('')
        return
      }
      setCode(extracted)
      toast.success('Code extracted from image!')
      setOcrProgress('')
      verifyMutation.mutate(extracted)
    } catch {
      toast.error('OCR processing failed. Try entering the code manually.')
      setOcrProgress('')
    }
  }

  return (
    <div className="min-h-screen bg-black">
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

      <main className="max-w-2xl mx-auto px-4 py-16">
        <div className="text-center mb-10">
          <div className="w-14 h-14 rounded-2xl bg-green-500/10 flex items-center justify-center mx-auto mb-4">
            <svg className="w-7 h-7 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12.75L11.25 15 15 9.75M21 12c0 1.268-.63 2.39-1.593 3.068a3.745 3.745 0 01-1.043 3.296 3.745 3.745 0 01-3.296 1.043A3.745 3.745 0 0112 21c-1.268 0-2.39-.63-3.068-1.593a3.746 3.746 0 01-3.296-1.043 3.745 3.745 0 01-1.043-3.296A3.745 3.745 0 013 12c0-1.268.63-2.39 1.593-3.068a3.745 3.745 0 011.043-3.296 3.746 3.746 0 013.296-1.043A3.746 3.746 0 0112 3c1.268 0 2.39.63 3.068 1.593a3.746 3.746 0 013.296 1.043 3.746 3.746 0 011.043 3.296A3.745 3.745 0 0121 12z" />
            </svg>
          </div>
          <h1 className="text-3xl font-bold text-white">Certificate Verification</h1>
          <p className="text-gray-400 mt-2">Verify the authenticity of a Spurvance certificate</p>
        </div>

        <div className="rounded-2xl bg-zinc-900/60 border border-white/[0.06] p-6">
          <div className="flex gap-1 mb-6 bg-black/40 rounded-xl p-1">
            <button
              onClick={() => setTab('code')}
              className={`flex-1 py-2.5 text-sm font-medium rounded-lg transition-all ${tab === 'code' ? 'bg-blue-600 text-white' : 'text-gray-400 hover:text-white'}`}
            >
              Enter Code
            </button>
            <button
              onClick={() => setTab('upload')}
              className={`flex-1 py-2.5 text-sm font-medium rounded-lg transition-all ${tab === 'upload' ? 'bg-blue-600 text-white' : 'text-gray-400 hover:text-white'}`}
            >
              Upload & OCR
            </button>
          </div>

          {tab === 'code' ? (
            <div className="space-y-4">
              <p className="text-sm text-gray-400">Enter the verification code from your certificate</p>
              <div className="flex gap-3">
                <input
                  type="text"
                  value={code}
                  onChange={(e) => { setCode(e.target.value); setResult(null) }}
                  placeholder="e.g. a1b2c3d4-e5f6-..."
                  className="flex-1 px-4 py-3 bg-black/40 border border-white/[0.08] rounded-xl text-white placeholder-gray-600 focus:outline-none focus:border-blue-500/50 text-sm"
                />
                <button
                  onClick={handleVerify}
                  disabled={verifyMutation.isPending}
                  className="px-6 py-3 bg-blue-600 hover:bg-blue-500 disabled:bg-blue-600/50 text-white text-sm font-medium rounded-xl transition-all"
                >
                  {verifyMutation.isPending ? 'Verifying...' : 'Verify'}
                </button>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <p className="text-sm text-gray-400">Upload a certificate image and we'll extract the code automatically</p>
              <label className="flex flex-col items-center gap-3 px-6 py-10 border-2 border-dashed border-white/[0.08] rounded-xl cursor-pointer hover:border-blue-500/30 transition-colors">
                <svg className="w-10 h-10 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5" />
                </svg>
                <span className="text-gray-500 text-sm">Click to upload or drag & drop</span>
                <span className="text-gray-600 text-xs">PNG, JPG (max 10MB)</span>
                <input
                  ref={fileRef}
                  type="file"
                  accept="image/*"
                  onChange={handleFileUpload}
                  className="hidden"
                />
              </label>
              {ocrProgress && (
                <div className="flex items-center gap-3 text-sm text-gray-400">
                  <div className="w-5 h-5 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
                  {ocrProgress}
                </div>
              )}
            </div>
          )}

          {(verifyMutation.isPending && tab === 'code') && (
            <div className="mt-4 flex items-center gap-3 text-sm text-gray-400">
              <div className="w-5 h-5 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
              Verifying certificate...
            </div>
          )}

          {result?.valid && result.certificate && (
            <div className="mt-6 p-5 rounded-xl bg-green-500/10 border border-green-500/20">
              <div className="flex items-center gap-2 mb-4">
                <svg className="w-5 h-5 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12.75L11.25 15 15 9.75M21 12c0 1.268-.63 2.39-1.593 3.068a3.745 3.745 0 01-1.043 3.296 3.745 3.745 0 01-3.296 1.043A3.745 3.745 0 0112 21c-1.268 0-2.39-.63-3.068-1.593a3.746 3.746 0 01-3.296-1.043 3.745 3.745 0 01-1.043-3.296A3.745 3.745 0 013 12c0-1.268.63-2.39 1.593-3.068a3.745 3.745 0 011.043-3.296 3.746 3.746 0 013.296-1.043A3.746 3.746 0 0112 3c1.268 0 2.39.63 3.068 1.593a3.746 3.746 0 013.296 1.043 3.746 3.746 0 011.043 3.296A3.745 3.745 0 0121 12z" />
                </svg>
                <span className="text-green-400 font-semibold">✓ Verified Certificate</span>
              </div>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between py-2 border-b border-white/[0.06]">
                  <span className="text-gray-500">Student</span>
                  <span className="text-white font-medium">{result.certificate.studentName}</span>
                </div>
                <div className="flex justify-between py-2 border-b border-white/[0.06]">
                  <span className="text-gray-500">Email</span>
                  <span className="text-white">{result.certificate.studentEmail}</span>
                </div>
                <div className="flex justify-between py-2 border-b border-white/[0.06]">
                  <span className="text-gray-500">Course</span>
                  <span className="text-white font-medium">{result.certificate.courseTitle}</span>
                </div>
                <div className="flex justify-between py-2 border-b border-white/[0.06]">
                  <span className="text-gray-500">Issued</span>
                  <span className="text-white">{new Date(result.certificate.issuedAt).toLocaleDateString()}</span>
                </div>
                <div className="flex justify-between py-2">
                  <span className="text-gray-500">Code</span>
                  <span className="text-white font-mono text-xs">{result.certificate.id}</span>
                </div>
              </div>
              <div className="mt-4 pt-3 border-t border-white/[0.06] text-center">
                <a
                  href={`/verify/${result.certificate.id}`}
                  className="text-blue-400 hover:text-blue-300 text-sm"
                >
                  Permanent verification link →
                </a>
              </div>
            </div>
          )}
        </div>

        <div className="mt-8 text-center text-sm text-gray-600">
          This is an official verification system for Spurvance certificates.
        </div>
      </main>
    </div>
  )
}

function extractCode(text: string): string | null {
  const uuidRegex = /[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}/i
  const match = text.match(uuidRegex)
  return match ? match[0] : null
}
