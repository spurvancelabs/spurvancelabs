'use client';

import Link from 'next/link';
import { useEffect, useRef } from 'react';

const services = [
  {
    icon: 'https://img.icons8.com/3d-fluency/94/programming.png',
    title: 'Web Development',
    description: 'Custom websites, web applications, and responsive designs built with modern technologies. As a custom web application development company, we help startups and remote teams launch fast, scalable products',
  },
  {
    icon: 'https://img.icons8.com/3d-fluency/94/smartphone.png',
    title: 'Mobile Apps',
    description: 'Native and cross-platform mobile applications for iOS and Android with seamless UXAs a cross-platform mobile app development company, we help startups and remote teams bring ideas to the App Store and Play Store faster.',
  },
  {
    icon: 'https://img.icons8.com/3d-fluency/94/cloud.png',
    title: 'Cloud Solutions',
    description: 'Scalable cloud infrastructure, migration services, and DevOps implementation. Our cloud migration and DevOps services give startups and remote teams the infrastructure to scale without slowing down',
  },
  {
    icon: 'https://img.icons8.com/3d-fluency/94/robot.png',
    title: 'AI & Machine Learning',
    description: 'Intelligent automation, predictive analytics, and custom ML models for your data. Our custom AI software development for startups turns raw data into real product features.',
  },
  {
    icon: 'https://img.icons8.com/3d-fluency/94/shield.png',
    title: 'Cybersecurity',
    description: 'Comprehensive security audits, penetration testing, and compliance solutions. Our secure software development and code audit services keep startups and remote teams protected as they scale',
  },
  {
    icon: 'https://img.icons8.com/3d-fluency/94/analytics.png',
    title: 'Data Analytics',
    description: 'Business intelligence, data visualization, and actionable insights from your data. Our business intelligence and data analytics consulting turns scattered information into clear, actionable decisions for growing teams',
  },
];

export default function Services() {
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
          What We Do
        </span>
        <h2 className="text-white text-[1.8rem] sm:text-[2rem] md:text-[2.4rem] font-normal tracking-[-0.02em] mb-2">
          Our <span className="text-[#888] font-light">services</span>
        </h2>
        <p className="text-[#666] text-[0.9rem] sm:text-[1.05rem] font-light max-w-[500px] mx-auto">
          Comprehensive solutions tailored to your business needs
        </p>
      </div>
      <div className="grid grid-cols-[repeat(auto-fit,minmax(280px,1fr))] sm:grid-cols-[repeat(auto-fit,minmax(300px,1fr))] gap-[1.5rem_1rem] sm:gap-[2rem_1.5rem] mt-4">
        {services.map((service, index) => (
          <div
            key={index}
            className="flex flex-col items-center text-center p-6 sm:p-10 sm:px-6 rounded-xl border border-transparent transition-[0.3s_ease] cursor-default bg-transparent relative overflow-hidden opacity-0 translate-y-[30px] [&.visible]:opacity-100 [&.visible]:translate-y-0 hover:border-[#2a2a2a] hover:bg-[#0a0a0a] hover:-translate-y-1.5"
            ref={(el) => { itemsRef.current[index] = el; }}
          >
            <div className="w-[60px] h-[60px] sm:w-[70px] sm:h-[70px] flex items-center justify-center rounded-full bg-[#1a1a1a] mb-5 transition-[0.3s_ease] border border-[#2a2a2a] hover:bg-[#2a2a2a] hover:border-[#444] hover:scale-105">
              <img src={service.icon} alt={service.title} className="w-[40px] h-[40px] sm:w-[52px] sm:h-[52px] object-contain" />
            </div>
            <h3 className="text-white text-[1.1rem] sm:text-[1.2rem] font-semibold mb-[0.6rem] tracking-[-0.01em]">
              {service.title}
            </h3>
            <p className="text-[#666] text-[0.85rem] sm:text-[0.9rem] leading-[1.6] mb-5 max-w-[280px]">
              {service.description}
            </p>
            <Link
              href="/landing/services" 
              className="inline-flex items-center justify-center gap-2 px-5 py-2 bg-[#1a1a1a] text-white text-[0.85rem] font-medium no-underline rounded-full transition-[0.3s_ease] border border-[#2a2a2a] hover:bg-[#2a2a2a] hover:border-[#444] hover:-translate-y-0.5 hover:shadow-[0_8px_20px_rgba(0,0,0,0.3)]"
            >
              Learn More
              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M14 5l7 7m0 0l-7 7m7-7H3" />
              </svg>
            </Link>
          </div>
        ))}
      </div>
    </section>
  );
}