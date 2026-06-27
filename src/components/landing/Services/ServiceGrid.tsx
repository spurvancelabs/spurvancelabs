'use client';

import { useEffect, useRef } from 'react';

const services = [
  {
    icon: 'https://img.icons8.com/3d-fluency/94/programming.png',
    title: 'Web Development',
    description: 'Custom websites, web applications, and responsive designs built with modern technologies.',
  },
  {
    icon: 'https://img.icons8.com/3d-fluency/94/smartphone.png',
    title: 'Mobile Apps',
    description: 'Native and cross-platform mobile applications for iOS and Android with seamless UX.',
  },
  {
    icon: 'https://img.icons8.com/3d-fluency/94/cloud.png',
    title: 'Cloud Solutions',
    description: 'Scalable cloud infrastructure, migration services, and DevOps implementation.',
  },
  {
    icon: 'https://img.icons8.com/3d-fluency/94/robot.png',
    title: 'AI & Machine Learning',
    description: 'Intelligent automation, predictive analytics, and custom ML models for your data.',
  },
  {
    icon: 'https://img.icons8.com/3d-fluency/94/shield.png',
    title: 'Cybersecurity',
    description: 'Comprehensive security audits, penetration testing, and compliance solutions.',
  },
  {
    icon: 'https://img.icons8.com/3d-fluency/94/analytics.png',
    title: 'Data Analytics',
    description: 'Business intelligence, data visualization, and actionable insights from your data.',
  },
];

export default function ServiceGrid() {
  const itemsRef = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const index = itemsRef.current.indexOf(entry.target as HTMLDivElement);
            setTimeout(() => {
              entry.target.classList.add('visible');
            }, index * 100);
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.1, rootMargin: '0px 0px -50px 0px' }
    );

    itemsRef.current.forEach((item) => {
      if (item) observer.observe(item);
    });

    return () => observer.disconnect();
  }, []);

  return (
    <section className="py-16 px-8 pb-20 max-w-[1200px] mx-auto text-center">
      <div className="mb-14">
        <span className="inline-block bg-black text-[#888] text-[0.75rem] uppercase tracking-[0.1em] px-5 py-[0.3rem] rounded-[20px] mb-3 border border-[#2a2a2a]">
          What We Do
        </span>
        <h2 className="text-white text-[1.8rem] md:text-[2.4rem] font-normal tracking-[-0.02em] mb-2">
          Our <span className="text-[#888] font-light">services</span>
        </h2>
        <p className="text-[#666] text-[1.05rem] font-light max-w-[500px] mx-auto">
          Comprehensive solutions tailored to your business needs
        </p>
      </div>
      <div className="grid grid-cols-[repeat(auto-fit,minmax(300px,1fr))] gap-[2rem_1.5rem] mt-4">
        {services.map((service, index) => (
          <div
            key={index}
            className="flex flex-col items-center text-center p-6 md:p-10 px-6 rounded-xl border border-transparent transition-[0.3s_ease] cursor-default bg-transparent relative overflow-hidden opacity-0 translate-y-[30px] [&.visible]:opacity-100 [&.visible]:translate-y-0 hover:border-[#2a2a2a] hover:bg-[#0a0a0a] hover:-translate-y-1.5"
            ref={(el) => { itemsRef.current[index] = el; }}
          >
            <div className="w-[70px] h-[70px] flex items-center justify-center rounded-full bg-[#1a1a1a] mb-5 transition-[0.3s_ease] border border-[#2a2a2a] hover:bg-[#2a2a2a] hover:border-[#444] hover:scale-105">
              <img src={service.icon} alt={service.title} className="w-[52px] h-[52px] object-contain" />
            </div>
            <h3 className="text-white text-[1.2rem] font-semibold mb-[0.6rem] tracking-[-0.01em]">
              {service.title}
            </h3>
            <p className="text-[#666] text-[0.9rem] leading-[1.6] mb-5 max-w-[280px]">
              {service.description}
            </p>
            <a 
              href="#" 
              className="text-[#888] text-[0.85rem] font-medium no-underline transition-[0.3s_ease] inline-flex items-center gap-[0.3rem] border-b border-transparent pb-[2px] hover:text-white hover:border-b-white hover:gap-[0.6rem]"
            >
              Learn More →
            </a>
          </div>
        ))}
      </div>
    </section>
  );
}