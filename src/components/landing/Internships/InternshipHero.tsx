import React from 'react';
import Image from 'next/image';

function InternshipHero() {
  return (
    <div className="min-h-screen relative flex items-center justify-center overflow-hidden mt-10">
      <div className="relative z-10 max-w-6xl mx-auto px-8 text-center">
        
        <h1 className="text-white text-5xl md:text-6xl font-bold tracking-[-0.02em] mb-6">
          Launch Your Tech <span className="text-blue-500">Career</span>
        </h1>
        <p className="text-[#666] text-lg max-w-3xl mx-auto mb-12">
          Join Spurvancelab as an intern and gain hands-on experience working with cutting-edge technologies, 
          expert mentors, and real-world projects that shape the future of tech.
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-16">
          <div className="bg-[#0a0a0a] border border-[#1a1a1a] rounded-2xl p-8 transition-all duration-300 hover:border-[#2a2a2a] hover:-translate-y-2">
            <div className="w-20 h-20 rounded-full bg-[#1a1a1a] border border-[#2a2a2a] flex items-center justify-center mx-auto mb-5">
             <img className='w-10 h-10 object-cover' src="https://img.icons8.com/3d-fluency/94/rocket.png" alt="rocket"/>

            </div>
            <h3 className="text-white text-xl font-semibold mb-3">Fast Track Growth</h3>
            <p className="text-[#666] text-sm">Accelerate your learning with mentorship from industry experts</p>
          </div>
          
          <div className="bg-[#0a0a0a] border border-[#1a1a1a] rounded-2xl p-8 transition-all duration-300 hover:border-[#2a2a2a] hover:-translate-y-2">
            <div className="w-20 h-20 rounded-full bg-[#1a1a1a] border border-[#2a2a2a] flex items-center justify-center mx-auto mb-5">
              <img className='w-10 h-10 object-cover' src="https://img.icons8.com/3d-fluency/94/programming.png" alt="programming"/>

            </div>
            <h3 className="text-white text-xl font-semibold mb-3">Real Projects</h3>
            <p className="text-[#666] text-sm">Work on production code used by real clients and users</p>
          </div>
          
          <div className="bg-[#0a0a0a] border border-[#1a1a1a] rounded-2xl p-8 transition-all duration-300 hover:border-[#2a2a2a] hover:-translate-y-2">
            <div className="w-20 h-20 rounded-full bg-[#1a1a1a] border border-[#2a2a2a] flex items-center justify-center mx-auto mb-5">
              <img className='w-10 h-10 object-cover' src="https://img.icons8.com/3d-fluency/94/conference-call--v2.png" alt="collaboration"/>

            </div>
            <h3 className="text-white text-xl font-semibold mb-3">Team Collaboration</h3>
            <p className="text-[#666] text-sm">Join a passionate team of developers and designers</p>
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

export default InternshipHero;