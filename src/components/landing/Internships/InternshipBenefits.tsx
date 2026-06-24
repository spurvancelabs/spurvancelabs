import React from 'react';

const benefits = [
  {
    icon: 'fa-graduation-cap',
    title: 'Mentorship Program',
    description: 'One-on-one guidance from senior engineers and designers throughout your internship.',
  },
  {
    icon: 'fa-certificate',
    title: 'Certification',
    description: 'Earn industry-recognized certifications and build a portfolio of real projects.',
  },
  {
    icon: 'fa-briefcase',
    title: 'Full-time Opportunity',
    description: 'Top performers get fast-tracked to full-time positions with competitive packages.',
  },
  {
    icon: 'fa-laptop',
    title: 'Latest Tech Stack',
    description: 'Work with modern technologies and tools used by leading tech companies.',
  },
  {
    icon: 'fa-users',
    title: 'Networking Events',
    description: 'Attend tech meetups, conferences, and connect with industry professionals.',
  },
  {
    icon: 'fa-chart-line',
    title: 'Skill Development',
    description: 'Structured learning paths to accelerate your growth in chosen technology.',
  },
];

export default function InternshipBenefits() {
  return (
    <section className="py-20 px-8 pb-24">
      <div className="max-w-[1200px] mx-auto">
        <div className="text-center mb-16">
          <span className="inline-block bg-black text-[#888] text-[0.75rem] uppercase tracking-[0.1em] px-5 py-[0.3rem] rounded-[20px] mb-3 border border-[#2a2a2a]">
            Why Choose Our Internships
          </span>
          <h2 className="text-white text-[2.4rem] font-normal tracking-[-0.02em] mb-2">
            Internship <span className="text-[#888] font-light">Benefits</span>
          </h2>
          <p className="text-[#666] text-[1.05rem] font-light max-w-[500px] mx-auto">
            We invest in your growth with comprehensive support and real-world experience
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {benefits.map((benefit, index) => (
            <div key={index} className="flex flex-col items-center text-center p-8 rounded-xl border border-transparent transition-[0.3s_ease] cursor-default bg-transparent hover:border-[#2a2a2a] hover:bg-[#0a0a0a]">
              <div className="w-[70px] h-[70px] flex items-center justify-center rounded-full bg-[#1a1a1a] mb-5 transition-[0.3s_ease] border border-[#2a2a2a] hover:bg-[#2a2a2a] hover:border-[#444] hover:scale-105">
                <i className={`fas ${benefit.icon} text-[1.8rem] text-blue-500 transition-[0.3s_ease]`}></i>
              </div>
              <h3 className="text-white text-[1.2rem] font-semibold mb-[0.6rem] tracking-[-0.01em]">
                {benefit.title}
              </h3>
              <p className="text-[#666] text-[0.9rem] leading-[1.6] mb-5 max-w-[280px]">
                {benefit.description}
              </p>
            </div>
          ))}
        </div>

     
      </div>
    </section>
  );
}