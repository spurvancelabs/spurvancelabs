'use client';

import { useEffect, useRef } from 'react';

export default function WhyChooseUs() {
  const featuresRef = useRef<(HTMLDivElement | null)[]>([]);
  const cardsRef = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    const allElements = [...featuresRef.current, ...cardsRef.current];
    
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const delay = parseInt(entry.target.getAttribute('data-delay') || '0');
            setTimeout(() => {
              entry.target.classList.add('visible');
            }, delay);
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.15, rootMargin: '0px 0px -50px 0px' }
    );

    allElements.forEach((el) => {
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, []);

  return (
    <section className="py-12 px-4 sm:py-20 sm:px-8 pb-16 sm:pb-24 overflow-hidden">
      <div className="max-w-[1200px] mx-auto grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-16 items-start">
        {/* Left Side */}
        <div className="text-left lg:text-left">
          <span className="inline-block text-[#888] text-[0.75rem] uppercase tracking-[0.1em] bg-[#1a1a1a] px-5 py-[0.3rem] rounded-[20px] mb-5 border border-[#2a2a2a]">
            Why Choose Us
          </span>
          <h2 className="text-white text-[2rem] sm:text-[2.4rem] md:text-[2.8rem] font-bold tracking-[-0.03em] mb-4 leading-[1.2]">
            We're <span className="bg-gradient-to-br from-[#f0f0f0] to-[#888] bg-clip-text text-transparent font-bold">different</span> because we <span className="bg-gradient-to-br from-[#f0f0f0] to-[#888] bg-clip-text text-transparent font-bold">care</span>
          </h2>
          <p className="text-[#666] text-[0.9rem] sm:text-[1.05rem] leading-[1.8] max-w-[500px] mb-10 lg:max-w-[500px]">
            We combine technical expertise with a deep understanding of your business goals to deliver exceptional results.
          </p>
          
          <div className="flex flex-col gap-[0.2rem] lg:max-w-[600px] lg:mx-0 mx-auto">
            <div 
              className="flex items-center gap-5 py-[0.1rem] px-[0.1rem] rounded-[10px] border border-transparent transition-[0.4s_cubic-bezier(0.25,0.46,0.45,0.94)] bg-transparent opacity-0 -translate-x-[60px] [&.visible]:opacity-100 [&.visible]:translate-x-0 hover:border-[#2a2a2a] hover:bg-[#0a0a0a] hover:translate-x-[10px] lg:hover:!translate-x-[10px] lg:flex-row flex-col items-center text-center lg:text-left"
              data-delay="0" 
              ref={(el) => { featuresRef.current[0] = el; }}
            >
              <div className="text-[1.5rem] font-bold text-[#444] min-w-[40px] bg-gradient-to-br from-[#444] to-[#666] bg-clip-text text-transparent transition-[0.3s_ease] hover:bg-gradient-to-br hover:from-[#f0f0f0] hover:to-[#888] hover:bg-clip-text hover:text-transparent">
                01
              </div>
              <div className="feature-content">
                  <h4 className="text-white text-[0.9rem] sm:text-[1rem] font-semibold mb-[0.3rem]">10+ Years Experience</h4>
                <p className="text-[#666] text-[0.8rem] sm:text-[0.85rem] leading-[1.5]">Proven track record of delivering successful projects</p>
              </div>
            </div>

            <div 
              className="flex items-center gap-5 py-[0.1rem] px-[0.1rem] rounded-[10px] border border-transparent transition-[0.4s_cubic-bezier(0.25,0.46,0.45,0.94)] bg-transparent opacity-0 -translate-x-[60px] [&.visible]:opacity-100 [&.visible]:translate-x-0 hover:border-[#2a2a2a] hover:bg-[#0a0a0a] hover:translate-x-[10px] lg:hover:!translate-x-[10px] lg:flex-row flex-col items-center text-center lg:text-left"
              data-delay="100" 
              ref={(el) => { featuresRef.current[1] = el; }}
            >
              <div className="text-[1.5rem] font-bold text-[#444] min-w-[40px] bg-gradient-to-br from-[#444] to-[#666] bg-clip-text text-transparent transition-[0.3s_ease] hover:bg-gradient-to-br hover:from-[#f0f0f0] hover:to-[#888] hover:bg-clip-text hover:text-transparent">
                02
              </div>
              <div className="feature-content">
                  <h4 className="text-white text-[0.9rem] sm:text-[1rem] font-semibold mb-[0.3rem]">500+ Projects Completed</h4>
                <p className="text-[#666] text-[0.8rem] sm:text-[0.85rem] leading-[1.5]">From startups to Fortune 500 companies</p>
              </div>
            </div>

            <div 
              className="flex items-center gap-5 py-[0.1rem] px-[0.1rem] rounded-[10px] border border-transparent transition-[0.4s_cubic-bezier(0.25,0.46,0.45,0.94)] bg-transparent opacity-0 -translate-x-[60px] [&.visible]:opacity-100 [&.visible]:translate-x-0 hover:border-[#2a2a2a] hover:bg-[#0a0a0a] hover:translate-x-[10px] lg:hover:!translate-x-[10px] lg:flex-row flex-col items-center text-center lg:text-left"
              data-delay="200" 
              ref={(el) => { featuresRef.current[2] = el; }}
            >
              <div className="text-[1.5rem] font-bold text-[#444] min-w-[40px] bg-gradient-to-br from-[#444] to-[#666] bg-clip-text text-transparent transition-[0.3s_ease] hover:bg-gradient-to-br hover:from-[#f0f0f0] hover:to-[#888] hover:bg-clip-text hover:text-transparent">
                03
              </div>
              <div className="feature-content">
                  <h4 className="text-white text-[0.9rem] sm:text-[1rem] font-semibold mb-[0.3rem]">98% Client Retention</h4>
                <p className="text-[#666] text-[0.8rem] sm:text-[0.85rem] leading-[1.5]">We build lasting relationships with our clients</p>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side */}
        <div className="flex flex-col gap-5">
          <div 
            className="bg-[#0a0a0a] border border-[#1a1a1a] rounded-xl px-4 sm:px-8 py-[1.2rem] sm:py-[1.8rem] flex items-center gap-4 sm:gap-6 transition-[0.5s_cubic-bezier(0.25,0.46,0.45,0.94)] relative overflow-hidden opacity-0 translate-x-[60px] [&.visible]:opacity-100 [&.visible]:translate-x-0 hover:border-[#2a2a2a] hover:translate-x-[10px] lg:hover:!translate-x-[10px] hover:bg-[#111] flex-col sm:flex-row text-center sm:text-left"
            data-delay="0" 
            ref={(el) => { cardsRef.current[0] = el; }}
          >
            <div className="absolute top-0 left-0 right-0 bottom-0 bg-gradient-to-br from-[rgba(255,255,255,0.02)] to-transparent opacity-0 transition-[0.4s_ease] hover:opacity-100"></div>
            <div className="w-[55px] h-[55px] min-w-[55px] flex items-center justify-center rounded-xl bg-[#1a1a1a] border border-[#2a2a2a] transition-[0.4s_ease] relative z-[1] hover:bg-[#2a2a2a] hover:border-[#444] hover:scale-105 hover:-rotate-[5deg]">
              <i className="fas fa-bolt text-[1.5rem] text-[#888] transition-[0.4s_ease] hover:text-white hover:scale-110"></i>
            </div>
            <div className="flex-1 relative z-[1]">
              <h3 className="text-white text-[1rem] sm:text-[1.1rem] font-semibold mb-[0.3rem]">Fast &amp; Reliable</h3>
              <p className="text-[#666] text-[0.8rem] sm:text-[0.85rem] leading-[1.5] m-0">Lightning-fast development with robust, scalable solutions</p>
            </div>
          </div>

          <div 
            className="bg-[#0a0a0a] border border-[#1a1a1a] rounded-xl px-4 sm:px-8 py-[1.2rem] sm:py-[1.8rem] flex items-center gap-4 sm:gap-6 transition-[0.5s_cubic-bezier(0.25,0.46,0.45,0.94)] relative overflow-hidden opacity-0 translate-x-[60px] [&.visible]:opacity-100 [&.visible]:translate-x-0 hover:border-[#2a2a2a] hover:translate-x-[10px] lg:hover:!translate-x-[10px] hover:bg-[#111] flex-col sm:flex-row text-center sm:text-left"
            data-delay="150" 
            ref={(el) => { cardsRef.current[1] = el; }}
          >
            <div className="absolute top-0 left-0 right-0 bottom-0 bg-gradient-to-br from-[rgba(255,255,255,0.02)] to-transparent opacity-0 transition-[0.4s_ease] hover:opacity-100"></div>
            <div className="w-[55px] h-[55px] min-w-[55px] flex items-center justify-center rounded-xl bg-[#1a1a1a] border border-[#2a2a2a] transition-[0.4s_ease] relative z-[1] hover:bg-[#2a2a2a] hover:border-[#444] hover:scale-105 hover:-rotate-[5deg]">
              <i className="fas fa-star text-[1.5rem] text-[#888] transition-[0.4s_ease] hover:text-white hover:scale-110"></i>
            </div>
            <div className="flex-1 relative z-[1]">
              <h3 className="text-white text-[1rem] sm:text-[1.1rem] font-semibold mb-[0.3rem]">Quality First</h3>
              <p className="text-[#666] text-[0.8rem] sm:text-[0.85rem] leading-[1.5] m-0">Rigorous testing and quality assurance in every project</p>
            </div>
          </div>

          <div 
            className="bg-[#0a0a0a] border border-[#1a1a1a] rounded-xl px-4 sm:px-8 py-[1.2rem] sm:py-[1.8rem] flex items-center gap-4 sm:gap-6 transition-[0.5s_cubic-bezier(0.25,0.46,0.45,0.94)] relative overflow-hidden opacity-0 translate-x-[60px] [&.visible]:opacity-100 [&.visible]:translate-x-0 hover:border-[#2a2a2a] hover:translate-x-[10px] lg:hover:!translate-x-[10px] hover:bg-[#111] flex-col sm:flex-row text-center sm:text-left"
            data-delay="300" 
            ref={(el) => { cardsRef.current[2] = el; }}
          >
            <div className="absolute top-0 left-0 right-0 bottom-0 bg-gradient-to-br from-[rgba(255,255,255,0.02)] to-transparent opacity-0 transition-[0.4s_ease] hover:opacity-100"></div>
            <div className="w-[55px] h-[55px] min-w-[55px] flex items-center justify-center rounded-xl bg-[#1a1a1a] border border-[#2a2a2a] transition-[0.4s_ease] relative z-[1] hover:bg-[#2a2a2a] hover:border-[#444] hover:scale-105 hover:-rotate-[5deg]">
              <i className="fas fa-heart text-[1.5rem] text-[#888] transition-[0.4s_ease] hover:text-white hover:scale-110"></i>
            </div>
            <div className="flex-1 relative z-[1]">
              <h3 className="text-white text-[1rem] sm:text-[1.1rem] font-semibold mb-[0.3rem]">Passionate Team</h3>
              <p className="text-[#666] text-[0.8rem] sm:text-[0.85rem] leading-[1.5] m-0">Dedicated professionals who love what they do</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}