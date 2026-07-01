'use client'

import { useEffect, useRef } from 'react'

export default function CcpBanner() {
  const sectionRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const el = sectionRef.current
    if (!el) return

    el.style.opacity = '0'
    el.style.transform = 'translateY(40px)'
    el.style.transition = 'opacity 0.8s ease, transform 0.8s ease'

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            el.style.opacity = '1'
            el.style.transform = 'translateY(0)'
            observer.unobserve(el)
          }
        })
      },
      { threshold: 0.1, rootMargin: '0px 0px -50px 0px' }
    )

    observer.observe(el)
    return () => observer.disconnect()
  }, [])

  return (
    <section className="relative py-16 sm:py-24 overflow-hidden">
      {/* Background glow */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-purple-600/10 blur-[120px]" />
        <div className="absolute top-1/3 right-1/4 w-[300px] h-[300px] rounded-full bg-blue-500/10 blur-[100px]" />
      </div>

      <div
        ref={sectionRef}
        className="relative max-w-[1100px] mx-auto px-4 sm:px-6"
      >
        <div className="relative bg-gradient-to-br from-purple-900/40 via-blue-900/20 to-purple-900/40 border border-purple-500/20 rounded-3xl p-8 sm:p-12 md:p-16 text-center overflow-hidden shadow-2xl shadow-purple-500/10 hover:border-purple-500/40 transition-all duration-500">
          {/* Orb decorations */}
          <div className="absolute w-[400px] h-[400px] top-[-150px] right-[-100px] rounded-full blur-[100px] pointer-events-none bg-purple-500/10 animate-pulse" />
          <div className="absolute w-[250px] h-[250px] bottom-[-100px] left-[-80px] rounded-full blur-[100px] pointer-events-none bg-blue-500/10 animate-pulse" />

          <div className="relative z-10">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-purple-500/10 border border-purple-500/20 text-purple-300 text-xs font-semibold mb-6">
              <span className="h-2 w-2 rounded-full bg-purple-400 animate-pulse" />
              Now Available
            </div>

            <h2 className="text-white text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight leading-tight mb-4">
              Introducing{' '}
              <span className="bg-gradient-to-r from-purple-400 via-blue-400 to-purple-300 bg-clip-text text-transparent">
                CCP Platform
              </span>
            </h2>

            <p className="text-gray-400 text-sm sm:text-base max-w-xl mx-auto mb-8 leading-relaxed">
              A revolutionary platform built for the future. Experience speed, reliability, and innovation like never before.
            </p>

            <a
              href="https://ccp.spurvancelabs.com/"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-3 px-10 py-3.5 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-full text-base font-semibold shadow-lg shadow-purple-500/20 hover:shadow-purple-500/40 hover:-translate-y-0.5 transition-all duration-300"
            >
              Visit CCP
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
              </svg>
            </a>
          </div>
        </div>
      </div>
    </section>
  )
}
