import React from 'react';
import Image from 'next/image';

function JobsHero() {
  return (
    <div className="min-h-screen relative flex items-center justify-center overflow-hidden">
      <div className="relative z-10 max-w-6xl mx-auto px-8 text-center">
        <span className="inline-block bg-[#1a1a1a] text-[#888] text-[0.75rem] uppercase tracking-[0.1em] px-5 py-[0.3rem] rounded-[20px] mb-5 border border-[#2a2a2a]">
          Join Our Team
        </span>
        <h1 className="text-white text-5xl md:text-6xl font-bold tracking-[-0.02em] mb-6">
          Find Your <span className="text-blue-500">Dream Job</span>
        </h1>
        <p className="text-[#666] text-lg max-w-3xl mx-auto mb-12">
          Explore exciting career opportunities in software development, design, and technology. 
          We&apos;re looking for passionate individuals to join our growing team.
        </p>
        
        <div className="relative max-w-2xl mx-auto">
          <input
            type="text"
            placeholder="Search by role, skill, or location..."
            className="w-full px-6 py-4 pl-14 bg-[#0a0a0a] border border-[#1a1a1a] rounded-full text-white text-[1rem] focus:outline-none focus:border-[#2a2a2a] placeholder:text-[#444]"
          />
          <i className="fas fa-search absolute left-6 top-1/2 -translate-y-1/2 text-[#666] text-lg"></i>
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

export default JobsHero;