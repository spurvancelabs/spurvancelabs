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
    <section className="py-10 px-5 sm:py-20 sm:px-8 overflow-hidden">
      <div
        ref={sectionRef}
        className="max-w-[1100px] mx-auto"
      >
        <div className="relative bg-[#0a0a0a] border border-[#1a1a1a] rounded-2xl p-8 sm:p-12 md:p-16 text-center overflow-hidden transition-all duration-500 hover:border-[#2a2a2a] group">
          <div className="absolute top-0 left-0 right-0 bottom-0 bg-gradient-to-br from-white/[0.02] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

          <div className="relative z-10">
            <span className="inline-block bg-[#1a1a1a] text-[#888] text-[0.7rem] sm:text-[0.75rem] uppercase tracking-[0.1em] px-5 py-[0.3rem] rounded-[20px] mb-5 border border-[#2a2a2a]">
              Now Available
            </span>

            <h2 className="text-white text-[1.8rem] sm:text-[2.2rem] md:text-[2.6rem] font-bold tracking-[-0.03em] mb-4 leading-[1.2]">
              Introducing{' '}
              <span className="bg-gradient-to-br from-[#f0f0f0] to-[#888] bg-clip-text text-transparent">
                Cyber Community Pakistan
              </span>
            </h2>

            <p className="text-[#666] text-[0.9rem] sm:text-[1.05rem] font-light max-w-[600px] mx-auto mb-4 leading-relaxed">
              A thriving platform built for Pakistan&apos;s cybersecurity community by Spurvancelab. Cyber Community Pakistan brings together security professionals, researchers, and enthusiasts to share knowledge, conduct workshops, and strengthen the nation&apos;s cyber defense ecosystem.
            </p>
            <p className="text-[#555] text-[0.8rem] sm:text-[0.9rem] font-light max-w-[500px] mx-auto mb-8 leading-relaxed">
              As an initiative of Spurvancelab, CCP reflects our commitment to building a safer digital future for Pakistan.
            </p>

            <a
              href="https://cybercommunity.com.pk/"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-3 px-8 py-3 bg-white text-black rounded-full text-[0.95rem] font-semibold no-underline transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_20px_40px_rgba(255,255,255,0.1)] group/btn"
            >
              <span>Visit CCP</span>
              <svg className="h-4 w-4 transition-transform duration-300 group-hover/btn:translate-x-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
              </svg>
            </a>
          </div>
        </div>
      </div>
    </section>
  )
}
