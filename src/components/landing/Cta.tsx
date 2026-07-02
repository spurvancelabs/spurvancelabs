'use client';

import Link from 'next/link';
import { useEffect, useRef } from 'react';

export default function Cta() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // Fade in animation
    container.style.opacity = '0';
    container.style.transform = 'translateY(30px)';
    container.style.transition = 'opacity 0.8s ease, transform 0.8s ease';

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            container.style.opacity = '1';
            container.style.transform = 'translateY(0)';
            observer.unobserve(container);
          }
        });
      },
      { threshold: 0.1, rootMargin: '0px 0px -50px 0px' }
    );

    observer.observe(container);

    return () => observer.disconnect();
  }, []);

  return (
    <section className="py-12 px-4 sm:py-20 sm:px-8 overflow-hidden relative">
      <div 
        className="max-w-[1100px] mx-auto relative bg-gradient-to-br from-[#0a0a0a] to-[#111] border border-[#1a1a1a] rounded-3xl p-6 sm:p-10 md:p-16 md:px-12 overflow-hidden transition-[0.4s_ease] hover:border-[#2a2a2a] hover:shadow-[0_30px_80px_rgba(0,0,0,0.6)]"
        ref={containerRef}
      >
        <div className="absolute w-[300px] h-[300px] top-[-100px] right-[-50px] rounded-full blur-[80px] pointer-events-none bg-[rgba(79,70,229,0.1)] animate-[floatOrb_8s_ease-in-out_infinite]"></div>
        <div className="absolute w-[200px] h-[200px] bottom-[-50px] left-[-50px] rounded-full blur-[80px] pointer-events-none bg-[rgba(124,58,237,0.08)] animate-[floatOrb_8s_ease-in-out_infinite] -animation-delay-2s"></div>
        <div className="absolute w-[150px] h-[150px] top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full blur-[80px] pointer-events-none bg-[rgba(79,70,229,0.05)] animate-[floatOrb_8s_ease-in-out_infinite] -animation-delay-4s"></div>
        
        <div className="relative z-[2] text-center">
          <h2 className="text-white text-[3.5rem] font-bold tracking-[-0.03em] mb-4 leading-[1.2] md:text-[2.8rem] sm:text-[2.2rem] max-sm:text-[1.8rem]">
            Ready to build something <span className="bg-gradient-to-br from-[#f0f0f0] to-[#777] bg-clip-text text-transparent">amazing</span>?
          </h2>
          <p className="text-[#666] text-[1.15rem] font-light max-w-[550px] mx-auto mb-8 leading-[1.8] sm:text-[1rem] max-sm:text-[0.9rem]">
            Let's collaborate and turn your vision into reality. We're here to help you succeed.
          </p>
          
          <div className="flex justify-center items-center gap-4 flex-wrap mb-12 flex-col sm:flex-row w-full sm:w-auto">
            <Link
              href="/contact" 
              className="inline-flex items-center gap-3 px-10 py-[0.9rem] bg-white text-black rounded-[50px] text-[1rem] font-semibold no-underline transition-[0.4s_cubic-bezier(0.25,0.46,0.45,0.94)] relative overflow-hidden hover:-translate-y-1 hover:shadow-[0_20px_40px_rgba(255,255,255,0.15)] hover:gap-5 w-full sm:w-auto justify-center sm:justify-start"
            >
              <span className="absolute top-0 left-[-100%] w-full h-full bg-gradient-to-r from-transparent via-white/20 to-transparent transition-[0.6s_ease] hover:left-full"></span>
              Start Your Project
              <i className="fas fa-arrow-right text-[0.9rem] transition-[0.3s_ease] hover:translate-x-1"></i>
            </Link>
            <Link 
              href="/contact" 
              className="inline-flex items-center gap-[0.6rem] px-8 py-[0.9rem] bg-transparent text-white border border-[#2a2a2a] rounded-[50px] text-[1rem] font-medium no-underline transition-[0.4s_cubic-bezier(0.25,0.46,0.45,0.94)] hover:bg-[#1a1a1a] hover:border-[#444] hover:-translate-y-1 hover:shadow-[0_20px_40px_rgba(0,0,0,0.3)] w-full sm:w-auto justify-center sm:justify-start"
            >
              <i className="fas fa-phone text-[0.9rem]"></i>
              Book a Call
            </Link>
          </div>
          
          <div className="flex justify-center items-center gap-6 sm:gap-8 pt-8 border-t border-[#1a1a1a] flex-col sm:flex-row">
            <div className="flex flex-col items-center">
              <span className="text-white text-[1.5rem] font-bold tracking-[-0.02em] max-sm:text-[1.2rem]">500+</span>
              <span className="text-[#666] text-[0.8rem] font-light mt-[0.2rem] max-sm:text-[0.7rem]">Projects Delivered</span>
            </div>
            <div className="w-px h-10 bg-[#1a1a1a] sm:block hidden"></div>
            <div className="w-[60px] h-px bg-[#1a1a1a] sm:hidden block"></div>
            <div className="flex flex-col items-center">
              <span className="text-white text-[1.5rem] font-bold tracking-[-0.02em] max-sm:text-[1.2rem]">98%</span>
              <span className="text-[#666] text-[0.8rem] font-light mt-[0.2rem] max-sm:text-[0.7rem]">Client Satisfaction</span>
            </div>
            <div className="w-px h-10 bg-[#1a1a1a] sm:block hidden"></div>
            <div className="w-[60px] h-px bg-[#1a1a1a] sm:hidden block"></div>
            <div className="flex flex-col items-center">
              <span className="text-white text-[1.5rem] font-bold tracking-[-0.02em] max-sm:text-[1.2rem]">24/7</span>
              <span className="text-[#666] text-[0.8rem] font-light mt-[0.2rem] max-sm:text-[0.7rem]">Support Available</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}