'use client'
import Image from 'next/image'
import React, { useEffect, useRef } from 'react'

function OurNetwork() {
  const featuresRef = useRef<(HTMLDivElement | null)[]>([]);

  // Intersection Observer for feature animations
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const index = featuresRef.current.indexOf(entry.target as HTMLDivElement);
            setTimeout(() => {
              entry.target.classList.add('visible');
            }, index * 150);
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.1, rootMargin: '0px 0px -50px 0px' }
    );

    featuresRef.current.forEach((feature) => {
      if (feature) observer.observe(feature);
    });

    return () => observer.disconnect();
  }, []);

  return (
    <section className="w-full  py-12 sm:py-16 md:py-20 lg:py-24 px-4 sm:px-6 md:px-8 lg:px-12 xl:px-16 border-t border-[#1a1a1a] overflow-hidden relative">
      <div className="max-w-[1200px] mx-auto grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-10 lg:gap-12 items-center relative min-h-[400px] sm:min-h-[450px] md:min-h-[500px]">
        
        {/* Background blurred spots - responsive sizing */}
        <div className="absolute w-[200px] h-[200px] sm:w-[300px] sm:h-[300px] md:w-[350px] md:h-[350px] lg:w-[400px] lg:h-[400px] top-[-60px] sm:top-[-80px] lg:top-[-100px] left-[-60px] sm:left-[-80px] lg:left-[-100px] rounded-full blur-[60px] sm:blur-[80px] lg:blur-[100px] pointer-events-none z-0 bg-[rgba(124,58,237,0.15)] animate-[spotFloat_8s_ease-in-out_infinite]"></div>
        <div className="absolute w-[180px] h-[180px] sm:w-[250px] sm:h-[250px] md:w-[300px] md:h-[300px] lg:w-[350px] lg:h-[350px] bottom-[-40px] sm:bottom-[-60px] lg:bottom-[-80px] left-1/2 -translate-x-1/2 rounded-full blur-[60px] sm:blur-[80px] lg:blur-[100px] pointer-events-none z-0 bg-[rgba(34,211,238,0.1)] animate-[spotFloat_10s_ease-in-out_infinite_reverse]"></div>
        <div className="absolute w-[150px] h-[150px] sm:w-[200px] sm:h-[200px] md:w-[250px] md:h-[250px] lg:w-[300px] lg:h-[300px] top-1/2 right-[-30px] sm:right-[-40px] lg:right-[-50px] -translate-y-1/2 rounded-full blur-[60px] sm:blur-[80px] lg:blur-[100px] pointer-events-none z-0 bg-[rgba(167,139,250,0.12)] animate-[spotFloat_12s_ease-in-out_infinite]"></div>
        
        {/* Left Side - Image */}
        <div className="relative z-[1] flex justify-center items-center">
          <div className="w-full max-w-[250px] xs:max-w-[300px] sm:max-w-[350px] md:max-w-[400px] lg:max-w-[500px] aspect-square mx-auto lg:mx-0">
            <Image 
              src="https://cdn3d.iconscout.com/3d/premium/thumb/coding-3d-icon-png-download-8049728.png" 
              alt="Coding 3D Icon" 
              width={500} 
              height={500}
              className="w-full h-full object-contain"
              priority
            />
          </div>
        </div>
        
        {/* Right Side - Content */}
        <div className="relative z-[1] text-center lg:text-left">
          <div className="p-2 sm:p-3 md:p-4">
            <span className="inline-block text-[#888] text-[0.6rem] xs:text-[0.65rem] sm:text-[0.7rem] uppercase tracking-[0.15em] sm:tracking-[0.2em] bg-[#1a1a1a] px-4 sm:px-5 md:px-6 py-[0.3rem] sm:py-[0.35rem] md:py-[0.4rem] rounded-[30px] mb-3 sm:mb-4 md:mb-5 border border-[#2a2a2a]">
              Our Network
            </span>
            <h2 className="text-white text-2xl xs:text-3xl sm:text-4xl md:text-5xl lg:text-[2.8rem] font-bold tracking-[-0.03em] mb-2 sm:mb-3 md:mb-4 leading-[1.2]">
              Connected <span className="bg-gradient-to-br from-[#7c3aed] to-[#22d3ee] bg-clip-text text-transparent">ecosystem</span>
            </h2>
            <p className="text-[#666] text-sm xs:text-base sm:text-lg md:text-[1.05rem] leading-[1.6] sm:leading-[1.7] md:leading-[1.8] mb-6 sm:mb-7 md:mb-8 max-w-full lg:max-w-[450px] mx-auto lg:mx-0 px-2 sm:px-0">
Our full-stack software development services for startups span across multiple platforms and technologies, creating a seamless experience for your business.            </p>
            
            <div className="flex flex-col gap-3 sm:gap-4 md:gap-5 max-w-full lg:max-w-[500px] mx-auto lg:mx-0">
              {/* Feature 1 */}
              <div 
                className="flex items-center gap-3 sm:gap-4 md:gap-5 p-3 sm:p-3.5 md:p-4 px-4 sm:px-4 md:px-5 bg-[#0a0a0a] border border-[#1a1a1a] rounded-xl transition-[0.4s_ease] opacity-0 translate-x-[30px] [&.visible]:opacity-100 [&.visible]:translate-x-0 hover:border-[#2a2a2a] hover:bg-[#111] hover:translate-x-2 flex-col xs:flex-row text-center xs:text-left"
                ref={(el) => { featuresRef.current[0] = el; }}
              >
                <div className="w-10 h-10 min-w-[40px] xs:w-11 xs:h-11 xs:min-w-[44px] rounded-[10px] bg-[#1a1a1a] border border-[#1a1a1a] flex items-center justify-center transition-[0.3s_ease] hover:bg-[#2a2a2a] hover:border-[#2a2a2a]">
                  <i className="fas fa-code text-[#666] text-[0.9rem] xs:text-[1rem] sm:text-[1.1rem] transition-[0.3s_ease] hover:text-white"></i>
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="text-white text-[0.9rem] xs:text-[0.95rem] sm:text-[1rem] font-semibold mb-[0.2rem]">Full-Stack Development</h4>
                  <p className="text-[#666] text-[0.75rem] xs:text-[0.8rem] sm:text-[0.85rem] m-0 truncate xs:truncate-none">End-to-end solutions from frontend to backend</p>
                </div>
              </div>
              
              {/* Feature 2 */}
              <div 
                className="flex items-center gap-3 sm:gap-4 md:gap-5 p-3 sm:p-3.5 md:p-4 px-4 sm:px-4 md:px-5 bg-[#0a0a0a] border border-[#1a1a1a] rounded-xl transition-[0.4s_ease] opacity-0 translate-x-[30px] [&.visible]:opacity-100 [&.visible]:translate-x-0 hover:border-[#2a2a2a] hover:bg-[#111] hover:translate-x-2 flex-col xs:flex-row text-center xs:text-left"
                ref={(el) => { featuresRef.current[1] = el; }}
              >
                <div className="w-10 h-10 min-w-[40px] xs:w-11 xs:h-11 xs:min-w-[44px] rounded-[10px] bg-[#1a1a1a] border border-[#1a1a1a] flex items-center justify-center transition-[0.3s_ease] hover:bg-[#2a2a2a] hover:border-[#2a2a2a]">
                  <i className="fas fa-cloud text-[#666] text-[0.9rem] xs:text-[1rem] sm:text-[1.1rem] transition-[0.3s_ease] hover:text-white"></i>
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="text-white text-[0.9rem] xs:text-[0.95rem] sm:text-[1rem] font-semibold mb-[0.2rem]">Cloud Infrastructure</h4>
                  <p className="text-[#666] text-[0.75rem] xs:text-[0.8rem] sm:text-[0.85rem] m-0 truncate xs:truncate-none">Scalable, secure, and reliable cloud solutions</p>
                </div>
              </div>
              
              {/* Feature 3 */}
              <div 
                className="flex items-center gap-3 sm:gap-4 md:gap-5 p-3 sm:p-3.5 md:p-4 px-4 sm:px-4 md:px-5 bg-[#0a0a0a] border border-[#1a1a1a] rounded-xl transition-[0.4s_ease] opacity-0 translate-x-[30px] [&.visible]:opacity-100 [&.visible]:translate-x-0 hover:border-[#2a2a2a] hover:bg-[#111] hover:translate-x-2 flex-col xs:flex-row text-center xs:text-left"
                ref={(el) => { featuresRef.current[2] = el; }}
              >
                <div className="w-10 h-10 min-w-[40px] xs:w-11 xs:h-11 xs:min-w-[44px] rounded-[10px] bg-[#1a1a1a] border border-[#1a1a1a] flex items-center justify-center transition-[0.3s_ease] hover:bg-[#2a2a2a] hover:border-[#2a2a2a]">
                  <i className="fas fa-bolt text-[#666] text-[0.9rem] xs:text-[1rem] sm:text-[1.1rem] transition-[0.3s_ease] hover:text-white"></i>
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="text-white text-[0.9rem] xs:text-[0.95rem] sm:text-[1rem] font-semibold mb-[0.2rem]">Real-Time Integration</h4>
                  <p className="text-[#666] text-[0.75rem] xs:text-[0.8rem] sm:text-[0.85rem] m-0 truncate xs:truncate-none">Seamless API and third-party integrations</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default OurNetwork