import React from 'react'

function DesignShowCase() {
  return (
    <section className="py-12 px-4 sm:py-20 sm:px-8 pb-16 sm:pb-24 border-t border-[#1a1a1a] overflow-hidden">
      <div className="max-w-[1200px] mx-auto">
        <div className="text-center mb-16">
          <span className="inline-block text-[#888] text-[0.7rem] uppercase tracking-[0.2em] bg-[#1a1a1a] px-6 py-[0.4rem] rounded-[30px] mb-3 border border-[#2a2a2a]">
            Design Showcase
          </span>
          <h2 className="text-white text-[2rem] sm:text-[2.6rem] md:text-[3.2rem] font-bold tracking-[-0.03em] mb-3">
            Where <span className="bg-gradient-to-br from-[#f0f0f0] to-[#777] bg-clip-text text-transparent">vision</span> meets <span className="bg-gradient-to-br from-[#f0f0f0] to-[#777] bg-clip-text text-transparent">craft</span>
          </h2>
          <p className="text-[#666] text-[0.9rem] sm:text-[1.1rem] font-light max-w-[500px] mx-auto">
From wireframes to polished interfaces — see our UI/UX design services for startups in action          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-[500px] md:max-w-none mx-auto md:mx-0">
          {/* Wireframes Card */}
          <div className="bg-[#0a0a0a] border border-[#1a1a1a] rounded-2xl p-5 sm:p-8 transition-[0.4s_cubic-bezier(0.25,0.46,0.45,0.94)] relative overflow-hidden flex flex-col hover:border-[#2a2a2a] hover:-translate-y-2 hover:shadow-[0_20px_50px_rgba(0,0,0,0.5)]">
            <div className="absolute top-0 left-0 right-0 bottom-0 bg-gradient-to-br from-transparent via-transparent to-[rgba(255,255,255,0.02)] pointer-events-none"></div>
            
            <div className="flex justify-between items-center mb-3">
              <span className="text-[#444] text-[0.7rem] sm:text-[0.8rem] font-semibold tracking-[0.05em]">01</span>
              <span className="text-[#666] text-[0.6rem] uppercase tracking-[0.1em] bg-[#1a1a1a] px-3 py-[0.2rem] rounded-[20px] border border-[#1a1a1a]">Process</span>
            </div>
            <h3 className="text-white text-[1.2rem] sm:text-[1.5rem] font-semibold mb-2 tracking-[-0.02em]">Wireframes</h3>
            <p className="text-[#666] text-[0.85rem] sm:text-[0.9rem] leading-[1.7] mb-5">Low-fidelity sketches that define structure, layout, and user flow before any code is written.</p>
            
            <div className="rounded-xl p-6 mb-5 min-h-[180px] flex items-center justify-center flex-col bg-[#0a0a0a] border border-[#1a1a1a] transition-[0.3s_ease] w-full hover:border-[#2a2a2a]">
              <div className="grid grid-cols-3 gap-1.5 w-full mb-3">
                <div className="aspect-square bg-[#1a1a1a] rounded border border-[#222] transition-[0.3s_ease]"></div>
                <div className="aspect-square bg-[#1a1a1a] rounded border border-[#222] transition-[0.3s_ease]"></div>
                <div className="aspect-square bg-[#1a1a1a] rounded border border-[#222] transition-[0.3s_ease]"></div>
                <div className="aspect-square bg-[#1a1a1a] rounded border border-[#222] transition-[0.3s_ease]"></div>
                <div className="aspect-square bg-[#2a2a2a] rounded border border-[#3a3a3a] transition-[0.3s_ease]"></div>
                <div className="aspect-square bg-[#1a1a1a] rounded border border-[#222] transition-[0.3s_ease]"></div>
                <div className="aspect-square bg-[#1a1a1a] rounded border border-[#222] transition-[0.3s_ease]"></div>
                <div className="aspect-square bg-[#1a1a1a] rounded border border-[#222] transition-[0.3s_ease]"></div>
                <div className="aspect-square bg-[#1a1a1a] rounded border border-[#222] transition-[0.3s_ease]"></div>
              </div>
              <div className="flex gap-2 w-full">
                <span className="flex-1 h-1 bg-[#1a1a1a] rounded"></span>
                <span className="flex-[2] h-1 bg-[#1a1a1a] rounded"></span>
                <span className="flex-1 h-1 bg-[#1a1a1a] rounded"></span>
              </div>
            </div>
            
            <div className="flex flex-wrap gap-2 mt-auto">
              <span className="text-[#666] text-[0.7rem] bg-[#1a1a1a] px-3 py-[0.2rem] rounded-[20px] border border-[#1a1a1a] transition-[0.3s_ease] hover:border-[#2a2a2a] hover:text-[#999]">User flows</span>
              <span className="text-[#666] text-[0.7rem] bg-[#1a1a1a] px-3 py-[0.2rem] rounded-[20px] border border-[#1a1a1a] transition-[0.3s_ease] hover:border-[#2a2a2a] hover:text-[#999]">Layout planning</span>
              <span className="text-[#666] text-[0.7rem] bg-[#1a1a1a] px-3 py-[0.2rem] rounded-[20px] border border-[#1a1a1a] transition-[0.3s_ease] hover:border-[#2a2a2a] hover:text-[#999]">Information architecture</span>
            </div>
          </div>

          {/* UI Screens Card */}
          <div className="bg-[#0a0a0a] border border-[#1a1a1a] rounded-2xl p-8 transition-[0.4s_cubic-bezier(0.25,0.46,0.45,0.94)] relative overflow-hidden flex flex-col hover:border-[#2a2a2a] hover:-translate-y-2 hover:shadow-[0_20px_50px_rgba(0,0,0,0.5)]">
            <div className="absolute top-0 left-0 right-0 bottom-0 bg-gradient-to-br from-transparent via-transparent to-[rgba(255,255,255,0.02)] pointer-events-none"></div>
            
            <div className="flex justify-between items-center mb-3">
              <span className="text-[#444] text-[0.7rem] sm:text-[0.8rem] font-semibold tracking-[0.05em]">02</span>
              <span className="text-[#666] text-[0.6rem] uppercase tracking-[0.1em] bg-[#1a1a1a] px-3 py-[0.2rem] rounded-[20px] border border-[#1a1a1a]">Visual</span>
            </div>
            <h3 className="text-white text-[1.2rem] sm:text-[1.5rem] font-semibold mb-2 tracking-[-0.02em]">UI Screens</h3>
            <p className="text-[#666] text-[0.85rem] sm:text-[0.9rem] leading-[1.7] mb-5">High-fidelity designs with pixel-perfect typography, colors, and interactive components.</p>
            
            <div className="rounded-xl p-4 sm:p-6 mb-5 min-h-[140px] sm:min-h-[180px] flex items-center justify-center flex-col bg-[#0a0a0a] border border-[#1a1a1a] transition-[0.3s_ease] w-full hover:border-[#2a2a2a]">
              <div className="w-[140px] sm:w-[160px] h-[200px] sm:h-[240px] bg-[#0a0a0a] border-2 border-[#1a1a1a] rounded-2xl p-2.5 relative">
                <div className="w-full h-full bg-[#0a0a0a] rounded-lg overflow-hidden flex flex-col">
                  <div className="flex gap-1 px-2 py-1.5 bg-[#0a0a0a]">
                    <div className="w-1.5 h-1.5 rounded-full bg-[#1a1a1a]"></div>
                    <div className="w-1.5 h-1.5 rounded-full bg-[#1a1a1a]"></div>
                    <div className="w-1.5 h-1.5 rounded-full bg-[#1a1a1a]"></div>
                  </div>
                  <div className="flex-1 px-2 py-2 flex flex-col gap-1.5">
                    <div className="h-2 rounded bg-gradient-to-r from-[#2a2a2a] to-[#3a3a3a] transition-[0.3s_ease] w-[70%] hover:from-[#7c3aed] hover:to-[#22d3ee]"></div>
                    <div className="h-2 rounded bg-gradient-to-r from-[#2a2a2a] to-[#3a3a3a] transition-[0.3s_ease] w-[85%] hover:from-[#7c3aed] hover:to-[#22d3ee]"></div>
                    <div className="h-2 rounded bg-gradient-to-r from-[#2a2a2a] to-[#3a3a3a] transition-[0.3s_ease] w-[55%] hover:from-[#7c3aed] hover:to-[#22d3ee]"></div>
                    <div className="h-2 rounded bg-gradient-to-r from-[#2a2a2a] to-[#3a3a3a] transition-[0.3s_ease] w-[90%] hover:from-[#7c3aed] hover:to-[#22d3ee]"></div>
                    <div className="h-2 rounded bg-gradient-to-r from-[#2a2a2a] to-[#3a3a3a] transition-[0.3s_ease] w-[40%] hover:from-[#7c3aed] hover:to-[#22d3ee]"></div>
                    <div className="h-2 rounded bg-gradient-to-r from-[#2a2a2a] to-[#3a3a3a] transition-[0.3s_ease] w-[75%] hover:from-[#7c3aed] hover:to-[#22d3ee]"></div>
                  </div>
                  <div className="flex gap-1.5 px-2 py-1.5">
                    <div className="flex-1 h-3 bg-[#1a1a1a] rounded"></div>
                    <div className="flex-1 h-3 bg-[#2a2a2a] rounded"></div>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="flex flex-wrap gap-2 mt-auto">
              <span className="text-[#666] text-[0.7rem] bg-[#1a1a1a] px-3 py-[0.2rem] rounded-[20px] border border-[#1a1a1a] transition-[0.3s_ease] hover:border-[#2a2a2a] hover:text-[#999]">Interactive prototypes</span>
              <span className="text-[#666] text-[0.7rem] bg-[#1a1a1a] px-3 py-[0.2rem] rounded-[20px] border border-[#1a1a1a] transition-[0.3s_ease] hover:border-[#2a2a2a] hover:text-[#999]">Responsive design</span>
              <span className="text-[#666] text-[0.7rem] bg-[#1a1a1a] px-3 py-[0.2rem] rounded-[20px] border border-[#1a1a1a] transition-[0.3s_ease] hover:border-[#2a2a2a] hover:text-[#999]">Design tokens</span>
            </div>
          </div>

          {/* Design Systems Card */}
          <div className="bg-[#0a0a0a] border border-[#1a1a1a] rounded-2xl p-5 sm:p-8 transition-[0.4s_cubic-bezier(0.25,0.46,0.45,0.94)] relative overflow-hidden flex flex-col hover:border-[#2a2a2a] hover:-translate-y-2 hover:shadow-[0_20px_50px_rgba(0,0,0,0.5)]">
            <div className="absolute top-0 left-0 right-0 bottom-0 bg-gradient-to-br from-transparent via-transparent to-[rgba(255,255,255,0.02)] pointer-events-none"></div>
            
            <div className="flex justify-between items-center mb-3">
              <span className="text-[#444] text-[0.7rem] sm:text-[0.8rem] font-semibold tracking-[0.05em]">03</span>
              <span className="text-[#666] text-[0.6rem] uppercase tracking-[0.1em] bg-[#1a1a1a] px-3 py-[0.2rem] rounded-[20px] border border-[#1a1a1a]">Foundation</span>
            </div>
            <h3 className="text-white text-[1.2rem] sm:text-[1.5rem] font-semibold mb-2 tracking-[-0.02em]">Design Systems</h3>
            <p className="text-[#666] text-[0.85rem] sm:text-[0.9rem] leading-[1.7] mb-5">Scalable systems with reusable components, patterns, and guidelines for consistent experiences.</p>
            
            <div className="rounded-xl p-4 sm:p-6 mb-5 min-h-[140px] sm:min-h-[180px] flex items-center justify-center flex-col bg-[#0a0a0a] border border-[#1a1a1a] transition-[0.3s_ease] w-full hover:border-[#2a2a2a]">
              <div className="grid grid-cols-3 gap-1.5 w-full mb-3">
                <div className="h-[30px] rounded bg-[#7c3aed]"></div>
                <div className="h-[30px] rounded bg-[#22d3ee]"></div>
                <div className="h-[30px] rounded bg-[#f59e0b]"></div>
                <div className="h-[30px] rounded bg-[#888]"></div>
                <div className="h-[30px] rounded bg-[#1a1a1a] border border-[#2a2a2a]"></div>
                <div className="h-[30px] rounded bg-[#e0e0e0]"></div>
              </div>
              <div className="grid grid-cols-4 gap-1.5 w-full">
                <div className="h-5 bg-[#1a1a1a] rounded border border-[#222] rounded-[10px]"></div>
                <div className="h-5 bg-[#2a2a2a] rounded border border-[#222]"></div>
                <div className="h-5 bg-[#1a1a1a] rounded border border-[#222]"></div>
                <div className="h-5 bg-[#1a1a1a] rounded border border-[#222]"></div>
              </div>
            </div>
            
            <div className="flex flex-wrap gap-2 mt-auto">
              <span className="text-[#666] text-[0.7rem] bg-[#1a1a1a] px-3 py-[0.2rem] rounded-[20px] border border-[#1a1a1a] transition-[0.3s_ease] hover:border-[#2a2a2a] hover:text-[#999]">Component library</span>
              <span className="text-[#666] text-[0.7rem] bg-[#1a1a1a] px-3 py-[0.2rem] rounded-[20px] border border-[#1a1a1a] transition-[0.3s_ease] hover:border-[#2a2a2a] hover:text-[#999]">Typography scale</span>
              <span className="text-[#666] text-[0.7rem] bg-[#1a1a1a] px-3 py-[0.2rem] rounded-[20px] border border-[#1a1a1a] transition-[0.3s_ease] hover:border-[#2a2a2a] hover:text-[#999]">Color palette</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default DesignShowCase