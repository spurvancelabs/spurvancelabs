'use client';

import { useEffect, useRef } from 'react';

const processSteps = [
  {
    number: '01',
    title: 'Discovery & Research',
    description: 'We analyze your business needs, market trends, and user requirements to create a solid foundation.',
    icon: 'https://img.icons8.com/3d-fluency/94/search.png',
  },
  {
    number: '02',
    title: 'Planning & Strategy',
    description: 'We create a comprehensive roadmap, define milestones, and establish clear timelines.',
    icon: 'https://img.icons8.com/3d-fluency/94/flow-chart.png',
  },
  {
    number: '03',
    title: 'Design & Prototyping',
    description: 'We craft intuitive user interfaces and interactive prototypes for exceptional experiences.',
    icon: 'https://img.icons8.com/3d-fluency/94/pencil.png',
  },
  {
    number: '04',
    title: 'Development & Coding',
    description: 'Our expert developers build robust, scalable solutions using the latest technologies.',
    icon: 'https://img.icons8.com/3d-fluency/94/code.png',
  },
  {
    number: '05',
    title: 'Testing & QA',
    description: 'We conduct rigorous testing to ensure your application is bug-free and performs optimally.',
    icon: 'https://img.icons8.com/3d-fluency/94/test-passed.png',
  },
  {
    number: '06',
    title: 'Deployment & Launch',
    description: 'We handle deployment and provide ongoing support to ensure your product\'s success.',
    icon: 'https://img.icons8.com/3d-fluency/94/rocket.png',
  },
];

export default function ServiceProcess() {
  const stepsRef = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
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
      { threshold: 0.2, rootMargin: '0px 0px -50px 0px' }
    );

    stepsRef.current.forEach((step) => {
      if (step) observer.observe(step);
    });

    return () => observer.disconnect();
  }, []);

  return (
    <section className="py-20 px-8 pb-24 overflow-hidden">
      <div className="max-w-[1200px] mx-auto">
        <div className="text-center mb-16">
          <span className="inline-block text-[#888] text-[0.75rem] uppercase tracking-[0.1em] bg-[#1a1a1a] px-5 py-[0.3rem] rounded-[20px] mb-5 border border-[#2a2a2a]">
            Our Process
          </span>
          <h2 className="text-white text-[2rem] md:text-[2.8rem] font-bold tracking-[-0.03em] mb-4">
            Service <span className="bg-gradient-to-br from-[#f0f0f0] to-[#888] bg-clip-text text-transparent font-bold">Process</span>
          </h2>
          <p className="text-[#666] text-[1.05rem] leading-[1.8] max-w-[500px] mx-auto">
            A streamlined approach to turn your ideas into reality
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {processSteps.map((step, index) => (
            <div
              key={index}
              className="bg-[#0a0a0a] border border-[#1a1a1a] rounded-xl p-8 transition-[0.4s_ease] opacity-0 translate-y-[30px] [&.visible]:opacity-100 [&.visible]:translate-y-0 hover:border-[#2a2a2a] hover:bg-[#111] hover:-translate-y-1.5 flex flex-col items-center text-center"
              data-delay={index * 100}
              ref={(el) => { stepsRef.current[index] = el; }}
            >
              <div className="w-16 h-16 rounded-full bg-[#1a1a1a] flex items-center justify-center mb-5">
                <img src={step.icon} alt={step.title} className="w-[44px] h-[44px] object-contain" />
              </div>
              <span className="text-blue-500 text-[0.8rem] font-bold mb-2">{step.number}</span>
              <h3 className="text-white text-[1.3rem] font-semibold mb-3">
                {step.title}
              </h3>
              <p className="text-[#666] text-[0.9rem] leading-[1.6]">
                {step.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}