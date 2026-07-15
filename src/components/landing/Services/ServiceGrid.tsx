'use client';

import { useEffect, useRef } from 'react';

const serviceItems = [
  {
    icon: 'https://img.icons8.com/3d-fluency/94/programming.png',
    title: 'Web Development',
    description: 'We design and build websites and web apps that are fast, scalable, and SEO-friendly. From marketing sites to complex data-driven platforms, every project is built on modern frameworks with clean code.',
  },
  {
    icon: 'https://img.icons8.com/3d-fluency/94/smartphone.png',
    title: 'Mobile Apps',
    description: 'We build native and hybrid mobile apps for iOS and Android that feel fast, intuitive, and reliable. From design to App Store submission, we handle everything end-to-end.',
  },
  {
    icon: 'https://img.icons8.com/3d-fluency/94/cloud.png',
    title: 'Cloud Solutions',
    description: 'We help startups migrate to AWS, Azure, or Google Cloud and set up CI/CD pipelines, so releases are faster, more reliable, and your infrastructure scales with demand.',
  },{
    icon: 'https://img.icons8.com/3d-fluency/94/robot.png',
    title: 'AI & Machine Learning',
    description: 'We build custom AI solutions — from predictive analytics and ML models to LLM-powered features. Every model is designed to integrate directly into your existing product.',
  },
  {
    icon: 'https://img.icons8.com/3d-fluency/94/shield.png',
    title: 'Cybersecurity',
    description: `We conduct vulnerability assessments, penetration testing, and secure code reviews. Security is built into how we architect and write code from the start — not bolted on at the end.`,
  },
  {
    icon: 'https://img.icons8.com/3d-fluency/94/analytics.png',
    title: 'Data Analytics',
    description: 'We turn scattered data into dashboards and reports your team can act on. Custom data pipelines, visualization tools, and real-time business intelligence.',
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
    <section className="py-10 px-4 sm:py-16 sm:px-8 pb-12 sm:pb-20 max-w-[1200px] mx-auto text-center">
      <div className="mb-10 sm:mb-14">
        <span className="inline-block bg-black text-[#888] text-[0.75rem] uppercase tracking-[0.1em] px-5 py-[0.3rem] rounded-[20px] mb-3 border border-[#2a2a2a]">
          Our Services
        </span>
        <h2 className="text-white text-[1.8rem] sm:text-[2rem] md:text-[2.4rem] font-normal tracking-[-0.02em] mb-2">
          What We <span className="text-[#888] font-light">Offer</span>
        </h2>
        <p className="text-[#666] text-[0.9rem] sm:text-[1.05rem] font-light max-w-[500px] mx-auto ">
          Comprehensive solutions tailored to your business needs
        </p>
      </div>
      <div className="grid grid-cols-[repeat(auto-fit,minmax(280px,1fr))]  sm:grid-cols-[repeat(auto-fit,minmax(300px,1fr))] gap-[1.5rem_1rem] sm:gap-[2rem_1.5rem] mt-4">
        {serviceItems.map((service, index) => (
          <div
            key={index}
            className="flex flex-col justify-center items-center text-center p-6 sm:p-10 sm:px-6 rounded-xl border border-transparent transition-[0.3s_ease] cursor-default bg-transparent relative overflow-hidden opacity-0 translate-y-[30px] [&.visible]:opacity-100 [&.visible]:translate-y-0 hover:border-[#2a2a2a] hover:bg-[#0a0a0a] hover:-translate-y-1.5"
            ref={(el) => { itemsRef.current[index] = el; }}
          >
            <div className="w-[60px] h-[60px] sm:w-[70px] sm:h-[70px] flex items-center justify-center rounded-full bg-[#1a1a1a] mb-5 transition-[0.3s_ease] border border-[#2a2a2a] hover:bg-[#2a2a2a] hover:border-[#444] hover:scale-105">
              <img src={service.icon} alt={service.title} className="w-[40px] h-[40px] sm:w-[52px] sm:h-[52px] object-contain" />
            </div>
            <h3 className="text-white text-left text-[1.1rem] sm:text-[1.2rem] font-semibold mb-[0.6rem] tracking-[-0.01em]">
              {service.title}
            </h3>
            <p className="text-[#666] text-[0.85rem] sm:text-[0.9rem] leading-[1.6] mb-5 max-w-[280px]">
              {service.description}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}
