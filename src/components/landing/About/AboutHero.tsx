import React from 'react';
import Image from 'next/image';

const technologies = [
  'React', 'Next.js', 'Node.js', 'TypeScript', 'Python', 'React Native',
  'Flutter', 'AWS', 'Docker', 'Kubernetes', 'PostgreSQL', 'TensorFlow',
];

const achievements = [
  { icon: 'fa-trophy', title: 'Trusted by 120+ startups' },
  { icon: 'fa-medal', title: 'ISO-certified development process' },
  { icon: 'fa-award', title: 'Top-rated on Clutch & Upwork' },
  { icon: 'fa-handshake', title: 'Technology partners: AWS, Google Cloud, Microsoft' },
];

function AboutHero() {
  return (
    <div className="min-h-screen relative flex items-center justify-center overflow-hidden ">
      <div className="relative z-10 max-w-6xl mx-auto px-5 sm:px-8 text-center mt-20">
        <h1 className="text-white text-3xl sm:text-5xl md:text-6xl font-bold tracking-[-0.02em] mb-4 sm:mb-6">
          About <span className="text-blue-500">Spurvancelab</span>
        </h1>
        <p className="text-[#666] text-sm sm:text-lg max-w-3xl mx-auto mb-8 sm:mb-12">
          We&apos;re a full-stack software development company helping remote teams
and startups design, build, and scale web, mobile, and AI products. From
idea to launch, our senior engineers turn your roadmap into a working
product — without the overhead of an in-house team.
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

        {/* Stats */}
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

        {/* Technologies Used */}
        <div className="mt-16 bg-[#0a0a0a] border border-[#1a1a1a] rounded-2xl p-6 md:p-10">
          <h3 className="text-white text-xl md:text-2xl font-semibold mb-2">Technologies We Use</h3>
          <p className="text-[#666] text-sm mb-6">Battle-tested tools we use to build, ship, and scale products</p>
          <div className="flex flex-wrap gap-3 justify-center">
            {technologies.map((tech) => (
              <span key={tech} className="text-[0.85rem] text-[#ccc] bg-[#1a1a1a] border border-[#2a2a2a] px-4 py-1.5 rounded-full hover:border-blue-500/50 hover:text-white transition-[0.3s_ease]">
                {tech}
              </span>
            ))}
          </div>
        </div>

        {/* Achievements / Recognition */}
        <div className="mt-16 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {achievements.map((item) => (
            <div key={item.title} className="bg-[#0a0a0a] border border-[#1a1a1a] rounded-2xl p-6 text-left transition-all duration-300 hover:border-[#2a2a2a] hover:-translate-y-1">
              <div className="w-11 h-11 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center mb-4">
                <i className={`fas ${item.icon} text-blue-400`}></i>
              </div>
              <p className="text-white text-[0.95rem] font-medium leading-snug">{item.title}</p>
            </div>
          ))}
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
