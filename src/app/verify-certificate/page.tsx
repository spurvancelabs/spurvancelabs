'use client'

import { useRef, useState } from 'react'
import Link from 'next/link'
import toast from 'react-hot-toast'

type Mode = 'id' | 'upload'

interface CertificateResult {
  id: string
  certificateId: string
  name: string
  email: string
  internshipField: string
  performance: string
  startDate: string
  endDate: string
  fileType: string
  fileUrl: string
  downloadUrl: string
}

interface VerifyResponse {
  valid: boolean
  certificate?: CertificateResult
  error?: string
}

export default function VerifyCertificatePage() {
  const [mode, setMode] = useState<Mode>('id')
  const [idInput, setIdInput] = useState('')
  const [result, setResult] = useState<VerifyResponse | null>(null)
  const [checking, setChecking] = useState(false)
  const [ocrStage, setOcrStage] = useState('')
  const [uploadedName, setUploadedName] = useState('')
  const fileInputRef = useRef<HTMLInputElement>(null)

  const verifyWithId = async (rawId: string) => {
    const id = rawId.trim()
    if (!id) {
      toast.error('Please enter a certificate ID')
      return
    }
    setChecking(true)
    setResult(null)
    try {
      const res = await fetch(`/api/certificates/verify?id=${encodeURIComponent(id)}`)
      const data: VerifyResponse = await res.json()
      setResult(data)
    } catch {
      setResult({ valid: false, error: 'Something went wrong. Please try again.' })
    } finally {
      setChecking(false)
      setOcrStage('')
    }
  }

  const runOcr = async (file: File) => {
    setUploadedName(file.name)
    setResult(null)
    setChecking(true)

    try {
      let imageSource: File | string = file

      if (file.type === 'application/pdf') {
        setOcrStage('Opening the PDF…')
        const pdfjs = await import('pdfjs-dist')
        pdfjs.GlobalWorkerOptions.workerSrc = new URL(
          'pdfjs-dist/build/pdf.worker.min.mjs',
          import.meta.url
        ).toString()

        const data = await file.arrayBuffer()
        const pdf = await pdfjs.getDocument({ data }).promise
        const page = await pdf.getPage(1)

        const scale = 2
        const viewport = page.getViewport({ scale })
        const canvas = document.createElement('canvas')
        canvas.width = viewport.width
        canvas.height = viewport.height
        const ctx = canvas.getContext('2d')
        if (!ctx) throw new Error('Canvas unsupported')

        await page.render({ canvasContext: ctx, viewport }).promise
        imageSource = canvas.toDataURL('image/png')
        setOcrStage('Certificate opened — scanning for the ID…')
      } else {
        setOcrStage('Scanning the certificate…')
      }

      const Tesseract = (await import('tesseract.js')).default
      const { data } = await Tesseract.recognize(imageSource, 'eng')

      const found = data.text.match(/SPR-CERT-\d+/i)
      if (!found) {
        setResult({
          valid: false,
          error: "We couldn't find a certificate ID in that file. Try a clearer image, or enter the ID manually instead.",
        })
        setOcrStage('')
        return
      }

      await verifyWithId(found[0].toUpperCase())
    } catch {
      setOcrStage('')
      setResult({
        valid: false,
        error: "We couldn't read that file. Try a clearer image, or enter the ID manually instead.",
      })
    } finally {
      setChecking(false)
    }
  }

  const handleFile = (selected: File | undefined | null) => {
    if (!selected) return
    const isImage = selected.type.startsWith('image/')
    const isPdf = selected.type === 'application/pdf'
    if (!isImage && !isPdf) {
      toast.error('Please upload an image or PDF')
      return
    }
    runOcr(selected)
  }

  const reset = () => {
    setResult(null)
    setIdInput('')
    setUploadedName('')
  }

  return (
    <div className="min-h-screen bg-black text-white">
      <style>{`
        .cert-soft-shadow { box-shadow: 0 24px 60px -24px rgba(0,0,0,0.9); }
        @keyframes certFadeUp { from { opacity: 0; transform: translateY(12px); } to { opacity: 1; transform: translateY(0); } }
        .cert-fade-up { animation: certFadeUp .45s ease-out forwards; }
      `}</style>

      {/* Header */}
      <header className="backdrop-blur-[20px] fixed top-0 left-0 right-0 z-[100] border-b border-[#1a1a1a] px-4 md:px-8 h-[70px] max-md:h-[60px] flex items-center">
        <div className="flex justify-between items-center w-full max-w-[1300px] mx-auto">
          <Link href="/" className="flex items-center gap-2.5">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/spurvance-logo-removebg-preview.png"
              alt="Spurvancelab"
              className="h-10 w-auto max-md:h-[30px] object-contain"
            />
            <div className="flex items-center gap-2">
              <span className="text-[1.2rem] font-bold bg-gradient-to-r from-[#f0f0f0] to-[#aaa] bg-clip-text text-transparent max-md:text-[1rem]">
                Spurvancelab
              </span>
              <span className="text-[#333] hidden sm:inline">/</span>
              <span className="text-sm text-[#666] hidden sm:inline">
                Certificate Verification
              </span>
            </div>
          </Link>
          <Link
            href="/landing"
            className="text-[0.85rem] font-medium text-[#ccc] hover:text-white px-4 py-2 rounded-[40px] transition-all duration-200 hover:bg-[#1a1a1a]"
          >
            ← Back to Home
          </Link>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4 sm:px-6 pt-[100px] pb-16">
        {/* Hero */}
        <div className="text-center mb-10 pt-6">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#0a0a0a] border border-[#1a1a1a] text-[#999] text-xs font-medium mb-6">
            <svg className="w-3.5 h-3.5 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
            </svg>
            Official · Secure · Instant
          </div>
          <h1 className="text-3xl sm:text-5xl font-bold tracking-tight text-white">
            Verify a Spurvance certificate
          </h1>
          <p className="mt-4 text-[#666] text-base sm:text-lg max-w-xl mx-auto leading-relaxed">
            Enter the certificate ID printed on the certificate, or upload the image / PDF and we&apos;ll read it for you.
          </p>
        </div>

        {/* Verification card */}
        <div className="max-w-2xl mx-auto bg-[#0a0a0a] rounded-3xl cert-soft-shadow border border-[#1a1a1a] p-6 sm:p-8">
          {/* Segmented toggle */}
          <div className="grid grid-cols-2 gap-1 p-1 rounded-full bg-[#111] border border-[#1a1a1a] mb-6">
            <button
              onClick={() => setMode('id')}
              className={`py-2.5 rounded-full text-sm font-medium transition-all cursor-pointer ${
                mode === 'id' ? 'bg-white text-black' : 'text-[#999] hover:text-white'
              }`}
            >
              Enter certificate ID
            </button>
            <button
              onClick={() => setMode('upload')}
              className={`py-2.5 rounded-full text-sm font-medium transition-all cursor-pointer ${
                mode === 'upload' ? 'bg-white text-black' : 'text-[#999] hover:text-white'
              }`}
            >
              Upload certificate
            </button>
          </div>

          {mode === 'id' ? (
            <form
              onSubmit={(e) => {
                e.preventDefault()
                verifyWithId(idInput)
              }}
              className="space-y-4"
            >
              <label className="block text-sm text-[#999]">Certificate ID</label>
              <input
                type="text"
                value={idInput}
                onChange={(e) => setIdInput(e.target.value.toUpperCase())}
                placeholder="SPR-CERT-0001"
                disabled={checking}
                className="w-full font-mono tracking-wide text-base bg-[#111] border border-[#2a2a2a] rounded-xl px-4 py-3 text-white placeholder-[#444] outline-none focus:border-blue-500/50 focus:bg-[#161616] transition-all disabled:opacity-60"
              />
              <button
                type="submit"
                disabled={checking}
                className="w-full py-3.5 rounded-full bg-white text-black text-sm font-medium hover:bg-[#a4a4a4] transition-all duration-200 cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {checking ? (
                  <span className="flex items-center justify-center gap-2">
                    <span className="w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin" />
                    Verifying…
                  </span>
                ) : (
                  'Verify Certificate'
                )}
              </button>
            </form>
          ) : (
            <div className="space-y-4">
              <button
                onClick={() => fileInputRef.current?.click()}
                onDragOver={(e) => e.preventDefault()}
                onDrop={(e) => {
                  e.preventDefault()
                  handleFile(e.dataTransfer.files?.[0])
                }}
                disabled={checking}
                className="w-full border-2 border-dashed border-[#2a2a2a] hover:border-blue-500/40 rounded-2xl p-10 text-center transition-colors cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed bg-[#0a0a0a]"
              >
                {checking && ocrStage ? (
                  <div className="flex flex-col items-center gap-3">
                    <span className="w-10 h-10 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
                    <p className="text-sm font-medium text-blue-400">{ocrStage}</p>
                    {uploadedName && <p className="text-xs text-[#555] truncate max-w-full">{uploadedName}</p>}
                  </div>
                ) : (
                  <div className="flex flex-col items-center gap-3">
                    <div className="w-14 h-14 rounded-2xl bg-[#111] border border-[#1a1a1a] flex items-center justify-center">
                      <svg className="w-7 h-7 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5" />
                      </svg>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-white">Upload an image or PDF</p>
                      <p className="text-xs text-[#666] mt-1">
                        We&apos;ll scan the certificate ID for you · JPG, PNG, WebP, PDF · up to 15MB
                      </p>
                    </div>
                  </div>
                )}
              </button>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*,application/pdf,.pdf,.jpg,.jpeg,.png,.webp"
                className="hidden"
                onChange={(e) => handleFile(e.target.files?.[0])}
              />
              <p className="text-xs text-center text-[#555]">
                Your file is read locally in your browser and never stored.
              </p>
            </div>
          )}
        </div>

        {/* Result */}
        {checking && mode === 'id' && (
          <div className="max-w-2xl mx-auto mt-6 text-center text-sm text-[#666]">
            <span className="inline-flex items-center gap-2">
              <span className="w-3.5 h-3.5 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
              Checking the official records…
            </span>
          </div>
        )}

        {result && (
          <div className="max-w-2xl mx-auto mt-8 cert-fade-up">
            {result.valid && result.certificate ? (
              <>
                <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-3xl p-6 mb-6 flex items-start gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-emerald-500 flex items-center justify-center shrink-0">
                    <svg className="w-6 h-6 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M4.5 12.75l6 6 9-13.5" />
                    </svg>
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-emerald-400">This certificate is verified</h2>
                    <p className="text-sm text-emerald-200/70 mt-1">
                      The details below match our official records.
                    </p>
                    <button
                      onClick={reset}
                      className="text-xs font-medium text-emerald-300 hover:text-emerald-200 mt-2 underline decoration-emerald-500/40 underline-offset-2 cursor-pointer"
                    >
                      Check another certificate
                    </button>
                  </div>
                </div>

                <div className="bg-[#0a0a0a] rounded-3xl cert-soft-shadow border border-[#1a1a1a] p-6 sm:p-8">
                  {/* Preview */}
                  <div className="rounded-2xl overflow-hidden bg-[#111] border border-[#1a1a1a] mb-6">
                    {result.certificate.fileType === 'pdf' ? (
                      <iframe
                        src={result.certificate.fileUrl}
                        title="Certificate preview"
                        className="w-full h-72 bg-[#111]"
                      />
                    ) : (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={result.certificate.fileUrl}
                        alt={`Certificate for ${result.certificate.name}`}
                        className="w-full max-h-80 object-contain bg-[#111] p-3"
                      />
                    )}
                  </div>

                  <dl className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-4">
                    <div>
                      <dt className="text-xs font-medium uppercase tracking-wider text-[#666]">Certificate ID</dt>
                      <dd className="mt-1 font-mono text-sm font-semibold text-blue-400">{result.certificate.certificateId}</dd>
                    </div>
                    <div>
                      <dt className="text-xs font-medium uppercase tracking-wider text-[#666]">Recipient</dt>
                      <dd className="mt-1 text-sm font-medium text-white">{result.certificate.name}</dd>
                    </div>
                    <div>
                      <dt className="text-xs font-medium uppercase tracking-wider text-[#666]">Email</dt>
                      <dd className="mt-1 text-sm text-gray-300">{result.certificate.email}</dd>
                    </div>
                    <div>
                      <dt className="text-xs font-medium uppercase tracking-wider text-[#666]">Internship Field</dt>
                      <dd className="mt-1 text-sm font-medium text-white">{result.certificate.internshipField}</dd>
                    </div>
                    <div>
                      <dt className="text-xs font-medium uppercase tracking-wider text-[#666]">Performance</dt>
                      <dd className="mt-1 text-sm font-medium text-emerald-400">{result.certificate.performance}</dd>
                    </div>
                    <div>
                      <dt className="text-xs font-medium uppercase tracking-wider text-[#666]">Internship Period</dt>
                      <dd className="mt-1 text-sm text-gray-300">
                        {new Date(result.certificate.startDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                        {' — '}
                        {new Date(result.certificate.endDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                      </dd>
                    </div>
                  </dl>

                  <div className="flex flex-col sm:flex-row gap-3 pt-6 mt-6 border-t border-[#1a1a1a]">
                    <a
                      href={result.certificate.downloadUrl}
                      className="flex-1 inline-flex items-center justify-center gap-2 py-3 rounded-full bg-white text-black text-sm font-medium hover:bg-[#a4a4a4] transition-all duration-200"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3" />
                      </svg>
                      Download Certificate
                    </a>
                    <a
                      href={result.certificate.fileUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center justify-center gap-2 py-3 px-5 rounded-full bg-white/[0.03] border border-[#2a2a2a] hover:border-[#3a3a3a] hover:bg-[#111] text-gray-200 text-sm font-medium transition-colors"
                    >
                      View Original
                    </a>
                  </div>
                </div>
              </>
            ) : (
              <div className="bg-rose-500/10 border border-rose-500/20 rounded-3xl p-6 flex items-start gap-4">
                <div className="w-12 h-12 rounded-2xl bg-rose-500 flex items-center justify-center shrink-0">
                  <svg className="w-6 h-6 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728L5.636 5.636M12 8v4m0 4h.01" />
                  </svg>
                </div>
                <div>
                  <h2 className="text-xl font-bold text-rose-400">Not verified</h2>
                  <p className="text-sm text-rose-200/70 mt-1 leading-relaxed">
                    {result.error || 'This certificate could not be verified.'}
                  </p>
                  <button
                    onClick={reset}
                    className="text-xs font-medium text-rose-300 hover:text-rose-200 mt-2 underline decoration-rose-500/40 underline-offset-2 cursor-pointer"
                  >
                    Try again
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

        {/* How it works */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-16 max-w-3xl mx-auto">
          {[
            { step: '1', title: 'Find your certificate', text: 'Open the certificate you received after completing your internship.' },
            { step: '2', title: 'Enter or upload', text: 'Type its SPR-CERT ID, or upload the image or PDF — we read it automatically.' },
            { step: '3', title: 'Instantly verified', text: 'Matches our official records and shows all the issued details.' },
          ].map((item) => (
            <div key={item.step} className="bg-[#0a0a0a] border border-[#1a1a1a] rounded-2xl p-5">
              <div className="w-8 h-8 rounded-full bg-white text-black text-sm font-bold flex items-center justify-center mb-3">
                {item.step}
              </div>
              <h3 className="text-sm font-semibold text-white">{item.title}</h3>
              <p className="text-xs text-[#666] mt-1 leading-relaxed">{item.text}</p>
            </div>
          ))}
        </div>
      </main>

      <footer className="px-4 sm:px-8 py-8 bg-[#0a0a0a] border-t border-[#1a1a1a]">
        <div className="max-w-[1300px] mx-auto text-center">
          <p className="text-[#444] text-[0.85rem]">
            © {new Date().getFullYear()} Spurvancelab · Internship certificates are issued to interns who completed their program.
          </p>
        </div>
      </footer>
    </div>
  )
}