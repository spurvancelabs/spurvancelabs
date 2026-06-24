import React from 'react';
import Image from 'next/image';

function AboutHero() {
  return (
    <div className="min-h-screen relative flex items-center justify-center overflow-hidden">
      <div className="relative z-10 max-w-6xl mx-auto px-8 text-center">
        <span className="inline-block bg-[#1a1a1a] text-[#888] text-[0.75rem] uppercase tracking-[0.1em] px-5 py-[0.3rem] rounded-[20px] mb-5 border border-[#2a2a2a]">
          Our Story
        </span>
        <h1 className="text-white text-5xl md:text-6xl font-bold tracking-[-0.02em] mb-6">
          About <span className="text-blue-500">Spurvancelab</span>
        </h1>
        <p className="text-[#666] text-lg max-w-3xl mx-auto mb-12">
          We are a technology-driven company passionate about creating innovative solutions 
          that transform businesses and empower people through cutting-edge software development.
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-16">
          <div className="bg-[#0a0a0a] border border-[#1a1a1a] rounded-2xl p-8 transition-all duration-300 hover:border-[#2a2a2a] hover:-translate-y-2">
            <div className="w-20 h-20 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center mx-auto mb-5">
              <span className="text-white text-3xl font-bold">10+</span>
            </div>
            <h3 className="text-white text-xl font-semibold mb-3">Years Experience</h3>
            <p className="text-[#666] text-sm">Delivering excellence since 2015</p>
          </div>
          
          <div className="bg-[#0a0a0a] border border-[#1a1a1a] rounded-2xl p-8 transition-all duration-300 hover:border-[#2a2a2a] hover:-translate-y-2">
            <div className="w-20 h-20 rounded-full bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center mx-auto mb-5">
              <span className="text-white text-3xl font-bold">500+</span>
            </div>
            <h3 className="text-white text-xl font-semibold mb-3">Projects Completed</h3>
            <p className="text-[#666] text-sm">From startups to enterprises</p>
          </div>
          
          <div className="bg-[#0a0a0a] border border-[#1a1a1a] rounded-2xl p-8 transition-all duration-300 hover:border-[#2a2a2a] hover:-translate-y-2">
            <div className="w-20 h-20 rounded-full bg-gradient-to-br from-orange-500 to-red-600 flex items-center justify-center mx-auto mb-5">
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