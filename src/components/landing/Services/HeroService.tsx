import Image from 'next/image'
import React from 'react'

function HeroService() {
  return (
    <div className='min-h-screen overflow-hidden relative w-full'> 
        {/* Heading */}
        <div className='mt-25 z-20 flex justify-center items-center px-4 sm:px-0'>
            <h1 className='text-white font-bold text-4xl md:text-5xl lg:text-6xl w-full max-w-[1000px] px-4 sm:px-0 text-center leading-tight'>
                Software Development Services for <span className='font-serif text-blue-500 italic font-semibold tracking-wide'>Startups and Remote</span>
 Teams
            </h1>
        </div>

        {/* Cards Container */}
        <div className='mt-6 z-20 relative left-1/7 w-full overflow-x-auto pb-4 max-sm:pb-6'>
          <div className='flex flex-col sm:flex-row gap-4 sm:gap-6 px-4 sm:px-8 min-w-0'>
            {/* Card 1 */}
            <div className='w-80 max-sm:w-[85%] sm:min-w-[280px] h-80 flex items-center justify-center shrink-0 rounded-2xl backdrop-blur-xl bg-white/5 border border-white/10 shadow-2xl shadow-black/50 hover:shadow-white/5 transition-all duration-700 group hover:scale-105 hover:-translate-y-2'>
                <div className='text-center px-6 relative'>
                    <div className='absolute -top-6 -right-4 w-20 h-20 bg-purple-500/30 rounded-full blur-2xl'></div>
                    <h3 className='text-white/50 text-[10px] uppercase tracking-[0.25em] font-medium mb-2'>Scalable Infrastructure</h3>
                    <p className='text-white/80 text-sm font-light leading-relaxed'>Deploy globally with <span className='text-white font-medium'>zero downtime</span></p>
                    <div className='w-12 h-[1px] bg-gradient-to-r from-transparent via-white/30 to-transparent mx-auto mt-4'></div>
                </div>
            </div>
            
            {/* Card 2 */}
            <div className='w-80 max-sm:w-[85%] sm:min-w-[280px] h-80 flex items-center justify-center shrink-0 rounded-2xl backdrop-blur-xl bg-white/5 border border-white/10 shadow-2xl shadow-black/50 hover:shadow-white/5 transition-all duration-700 delay-100 group hover:scale-105 hover:-translate-y-2'>
                <div className='text-center px-6 relative'>
                    <div className='absolute -bottom-6 -left-4 w-24 h-24 bg-blue-500/20 rounded-full blur-2xl'></div>
                    <h3 className='text-white/50 text-[10px] uppercase tracking-[0.25em] font-medium mb-2'>Real-time Analytics</h3>
                    <p className='text-white/80 text-sm font-light leading-relaxed'>Actionable insights at <span className='text-white font-medium'>lightning speed</span></p>
                    <div className='w-12 h-[1px] bg-gradient-to-r from-transparent via-white/30 to-transparent mx-auto mt-4'></div>
                </div>
            </div>
            
            {/* Card 3 */}
            <div className='w-80 max-sm:w-[85%] sm:min-w-[280px] h-80 flex items-center justify-center shrink-0 rounded-2xl backdrop-blur-xl bg-white/5 border border-white/10 shadow-2xl shadow-black/50 hover:shadow-white/5 transition-all duration-700 delay-200 group hover:scale-105 hover:-translate-y-2'>
                <div className='text-center px-6 relative'>
                    <div className='absolute -top-4 -right-6 w-16 h-16 bg-emerald-500/20 rounded-full blur-2xl'></div>
                    <h3 className='text-white/50 text-[10px] uppercase tracking-[0.25em] font-medium mb-2'>Enterprise Security</h3>
                    <p className='text-white/80 text-sm font-light leading-relaxed'>Bank-grade encryption <span className='text-white font-medium'>built-in</span></p>
                    <div className='w-12 h-[1px] bg-gradient-to-r from-transparent via-white/30 to-transparent mx-auto mt-4'></div>
                </div>
            </div>
          </div>
        </div>
        

    </div>
  )
}

export default HeroService