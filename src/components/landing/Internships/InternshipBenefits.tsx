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

        <div className="mt-20 text-center">
          <div className="bg-[#0a0a0a] border border-[#1a1a1a] rounded-2xl p-12 max-w-4xl mx-auto">
            <h3 className="text-white text-[2rem] font-bold mb-6">
              Ready to Start Your Journey?
            </h3>
            <p className="text-[#666] text-[1.1rem] mb-8 max-w-2xl mx-auto">
              Submit your application with your resume, portfolio, and a cover letter explaining why you&apos;d be a great fit for our team.
            </p>
            <button className="inline-flex items-center gap-3 px-10 py-4 bg-blue-500 text-white rounded-full font-medium cursor-pointer transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_20px_40px_rgba(59,130,246,0.3)]">
              <span>Apply Now</span>
              <i className="fas fa-arrow-right"></i>
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}