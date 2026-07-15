import React from 'react';
import Image from 'next/image';

function AboutHero() {
  return (
    <div className="min-h-screen relative flex items-center justify-center overflow-hidden ">
      <div className="relative z-10 max-w-6xl mx-auto px-5 sm:px-8 text-center mt-20">
        <h1 className="text-white text-3xl sm:text-5xl md:text-6xl font-bold tracking-[-0.02em] mb-4 sm:mb-6">
          About <span className="text-blue-500">Spurvancelab</span>
        </h1>
        <p className="text-[#666] text-sm sm:text-lg max-w-3xl mx-auto mb-8 sm:mb-12">
          We're a software development company for remote teams
and startups, passionate about creating innovative solutions that
transform businesses and empower people through cutting-edge software
development.
        </p>
        
        {/* Mission / Vision / Values */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16 text-left">
          <div className="bg-[#0a0a0a] border border-[#1a1a1a] rounded-2xl p-6 md:p-8 transition-all duration-300 hover:border-[#2a2a2a] hover:-translate-y-1">
            <h3 className="text-white text-lg font-semibold mb-3">Our Mission</h3>
            <p className="text-[#666] text-sm leading-relaxed">Empower startups and remote teams with world-class software solutions that drive growth and innovation.</p>
          </div>
          <div className="bg-[#0a0a0a] border border-[#1a1a1a] rounded-2xl p-6 md:p-8 transition-all duration-300 hover:border-[#2a2a2a] hover:-translate-y-1">
            <h3 className="text-white text-lg font-semibold mb-3">Our Vision</h3>
            <p className="text-[#666] text-sm leading-relaxed">Be the most trusted technology partner for businesses building the future — from idea to scale.</p>
          </div>
          <div className="bg-[#0a0a0a] border border-[#1a1a1a] rounded-2xl p-6 md:p-8 transition-all duration-300 hover:border-[#2a2a2a] hover:-translate-y-1">
            <h3 className="text-white text-lg font-semibold mb-3">Our Values</h3>
            <p className="text-[#666] text-sm leading-relaxed">Transparency, quality, and relentless commitment to delivering results that matter.</p>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-16">
          <div className="bg-[#0a0a0a] border border-[#1a1a1a] rounded-2xl p-6 md:p-8 transition-all duration-300 hover:border-[#2a2a2a] hover:-translate-y-2">
            <div className="w-16 h-16 md:w-20 md:h-20 rounded-full flex items-center justify-center mx-auto mb-5">
              <span className="text-white text-3xl font-bold">10+</span>
            </div>
            <h3 className="text-white text-xl font-semibold mb-3">Years Experience</h3>
            <p className="text-[#666] text-sm">Delivering excellence since 2015</p>
          </div>
          
          <div className="bg-[#0a0a0a] border border-[#1a1a1a] rounded-2xl p-6 md:p-8 transition-all duration-300 hover:border-[#2a2a2a] hover:-translate-y-2">
            <div className="w-16 h-16 md:w-20 md:h-20 rounded-full  flex items-center justify-center mx-auto mb-5">
              <span className="text-white text-3xl font-bold">500+</span>
            </div>
            <h3 className="text-white text-xl font-semibold mb-3">Projects Completed</h3>
            <p className="text-[#666] text-sm">From startups to enterprises</p>
          </div>
          
          <div className="bg-[#0a0a0a] border border-[#1a1a1a] rounded-2xl p-6 md:p-8 transition-all duration-300 hover:border-[#2a2a2a] hover:-translate-y-2">
            <div className="w-16 h-16 md:w-20 md:h-20 rounded-full  flex items-center justify-center mx-auto mb-5">
              <span className="text-white text-3xl font-bold">98%</span>
            </div>
            <h3 className="text-white text-xl font-semibold mb-3">Client Satisfaction</h3>
            <p className="text-[#666] text-sm">Building lasting relationships</p>
          </div>
        </div>
      </div>
      
      <div className="absolute -top-20 -left-40 pointer-events-none opacity-30">
        <Image src="/leftservicelight.svg" width={492} height={500} alt="bg" />
      </div>
      <div className="absolute -bottom-20 -right-40 pointer-events-none opacity-30">
        <Image src="/rightservicelight.svg" width={492} height={500} alt="bg" />
      </div>
    </div>
  );
}

export default AboutHero;