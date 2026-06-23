'use client';

import { useEffect, useRef } from 'react';

const processSteps = [
  {
    number: '01',
    title: 'Discovery & Research',
    description: 'We analyze your business needs, market trends, and user requirements to create a solid foundation for your project.',
    image: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=400&h=400&fit=crop&crop=center',
    icon: 'fa-search',
    details: ['Requirements gathering', 'Market analysis', 'User research'],
  },
  {
    number: '02',
    title: 'Planning & Strategy',
    description: 'We create a comprehensive roadmap, define milestones, and establish clear timelines to ensure project success.',
    image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=400&h=400&fit=crop&crop=center',
    icon: 'fa-sitemap',
    details: ['Architecture design', 'Technology stack', 'Timeline planning'],
  },
  {
    number: '03',
    title: 'Design & Prototyping',
    description: 'We craft intuitive user interfaces and interactive prototypes that deliver exceptional user experiences.',
    image: 'https://images.unsplash.com/photo-1561070791-2526d30994b5?w=400&h=400&fit=crop&crop=center',
    icon: 'fa-pencil-ruler',
    details: ['UI/UX design', 'Interactive prototypes', 'User testing'],
  },
  {
    number: '04',
    title: 'Development & Coding',
    description: 'Our expert developers build robust, scalable solutions using the latest technologies and best practices.',
    image: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=400&h=400&fit=crop&crop=center',
    icon: 'fa-code',
    details: ['Agile development', 'Code reviews', 'Continuous integration'],
  },
  {
    number: '05',
    title: 'Testing & QA',
    description: 'We conduct rigorous testing to ensure your application is bug-free, secure, and performs optimally.',
    image: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=400&h=400&fit=crop&crop=center',
    icon: 'fa-bug',
    details: ['Automated testing', 'Performance testing', 'Security audits'],
  },
  {
    number: '06',
    title: 'Deployment & Launch',
    description: 'We handle the deployment process and provide ongoing support to ensure your product\'s success.',
    image: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=400&h=400&fit=crop&crop=center',
    icon: 'fa-rocket',
    details: ['Deployment strategy', 'Monitoring setup', 'Ongoing support'],
  },
];

export default function Process() {
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
      <div className="text-center mb-16">
        <h2 className="text-white text-[2.8rem] font-bold tracking-[-0.03em] mb-2">
          Our <span className="bg-gradient-to-br from-[#f0f0f0] to-[#888] bg-clip-text text-transparent">development process</span>
        </h2>
        <p className="text-[#666] text-[1.05rem] font-light max-w-[500px] mx-auto">
          A streamlined approach to turn your ideas into reality
        </p>
      </div>

      <div className="max-w-[1000px] mx-auto relative before:content-[''] before:absolute before:left-1/2 before:top-0 before:bottom-0 before:w-[2px] before:bg-gradient-to-b before:from-transparent before:via-[#2a2a2a] before:via-[#444] before:to-transparent before:-translate-x-1/2 lg:before:block before:hidden">
        {processSteps.map((step, index) => (
          <div
            key={index}
            className="flex items-center mb-16 relative opacity-0 translate-y-[50px] transition-[0.8s_cubic-bezier(0.25,0.46,0.45,0.94)] [&.visible]:opacity-100 [&.visible]:translate-y-0 last:mb-0 flex-col lg:flex-row lg:odd:flex-row lg:even:flex-row-reverse pl-[70px] lg:pl-0"
            data-delay={index * 150}
            ref={(el) => { stepsRef.current[index] = el; }}
          >
            <div className="absolute left-[30px] lg:left-1/2 -translate-x-1/2 w-[50px] h-[50px] lg:w-[50px] lg:h-[50px] rounded-full bg-[#1a1a1a] border-2 border-[#2a2a2a] flex items-center justify-center text-[1rem] font-bold text-[#888] z-[2] transition-[0.4s_ease] hover:bg-[#2a2a2a] hover:border-[#444] hover:text-white hover:scale-110 lg:hover:scale-110">
              {step.number}
            </div>
            
            <div className={`flex items-center gap-8 w-full lg:w-[calc(50%-40px)] p-6 rounded-xl border border-transparent transition-[0.4s_ease] bg-transparent hover:border-[#2a2a2a] hover:bg-[#0a0a0a] hover:scale-[1.02] flex-col lg:flex-row ${index % 2 === 0 ? 'lg:mr-auto' : 'lg:ml-auto'}`}>
              <div className="relative w-full lg:w-[120px] h-[200px] lg:h-[120px] min-w-full lg:min-w-[120px] rounded-xl overflow-hidden border border-[#1a1a1a]">
                <img 
                  src={step.image} 
                  alt={step.title} 
                  className="w-full h-full object-cover transition-[0.4s_ease] hover:scale-110"
                />
                <div className="absolute top-0 left-0 right-0 bottom-0 bg-black/60 flex items-center justify-center opacity-0 transition-[0.4s_ease] hover:opacity-100">
                  <i className={`fas ${step.icon} text-4xl text-white`}></i>
                </div>
              </div>
              <div className="flex-1">
                <h3 className="text-white text-[1.2rem] font-semibold mb-2">{step.title}</h3>
                <p className="text-[#666] text-[0.9rem] leading-[1.6] mb-3">{step.description}</p>
                <ul className="list-none p-0 flex flex-wrap gap-2 gap-x-4">
                  {step.details.map((detail, i) => (
                    <li key={i} className="text-[#666] text-[0.8rem] flex items-center gap-1.5">
                      <i className="fas fa-check text-[#888] text-[0.7rem]"></i> {detail}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}