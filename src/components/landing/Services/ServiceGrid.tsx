'use client';

import { useEffect, useRef } from 'react';

const serviceItems = [
  {
    icon: 'https://img.icons8.com/3d-fluency/94/programming.png',
    title: 'Web Development',
    description: 'As a custom web application development company, we design and build websites and web applications that are fast, scalable, and built togrow with your business. From marketing sites to complex, data-drivenplatforms, every project is built on modern frameworks with clean,maintainable code. We focus on performance, responsive design, andSEO-friendly architecture from the very first line of code — so your site works as hard as your team does.',
  },
  {
    icon: 'https://img.icons8.com/3d-fluency/94/smartphone.png',
    title: 'Mobile Apps',
    description: 'Were a cross-platform mobile app development company building native and hybrid apps for iOS and Android that feel fast, intuitive, and reliable. Whether you need a single codebase across both platforms or a fully native experience, our team handles design, development, testing, and App Store or Play Store submission end-to-end. We build with scalability in mind, so your app can grow from your first thousand usersto your first million.',
  },
  {
    icon: 'https://img.icons8.com/3d-fluency/94/cloud.png',
    title: 'Cloud Solutions',
    description: 'Our cloud migration and DevOps services help startups and remote teams move to AWS, Azure, or Google Cloud without disrupting the product they ve already built. We handle infrastructure architecture, CI/CD pipeline setup, and automated deployment, so releases become faster and more reliable instead of a manual, risky process. The result is infrastructure that scales with demand and costs you less to maintain.',
  },{
    icon: 'https://img.icons8.com/3d-fluency/94/robot.png',
    title: 'AI & Machine Learning',
    description: 'We provide custom AI software development for startups looking to automate workflows, personalize user experiences, or extract real insight from their data. From predictive analytics to custom-trained machine learning models to LLM-powered product features, we build AI capabilities that solve real business problems, not just proof-of-concept demos. Every model we build is designed to integrate directly into your existing product.',
  },
  {
    icon: 'https://img.icons8.com/3d-fluency/94/shield.png',
    title: 'Cybersecurity',
    description: `Our secure software development and code audit services help protect your product and your users from day one. We conduct vulnerability assessments, penetration testing, and secure code reviews, and can build toward compliance frameworks like SOC 2, HIPAA, or GDPR depending on your industry. Security isn't an after thought we bolt on at the end — it's built into how we architect and write code from the start`
  },
  {
    icon: 'https://img.icons8.com/3d-fluency/94/analytics.png',
    title: 'Data Analytics',
    description: 'Through business intelligence and data analytics consulting, we help you turn scattered, disconnected data into dashboards and reports your teamcan actually act on. We build custom data pipelines, visualization tools,and reporting systems tailored to the metrics that matter most to yourbusiness. The goal is simple: real-time visibility into your businessperformance, without needing a data science team of your own.',
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
