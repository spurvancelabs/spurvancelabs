'use client';

import { useEffect, useRef } from 'react';

const features = [
  {
    icon: 'https://img.icons8.com/3d-fluency/94/electricity.png',
    title: 'Lightning Performance',
    description: 'Optimized for speed with sub-second response times and global CDN delivery.',
  },
  {
    icon: 'https://img.icons8.com/3d-fluent/100/shield-37.png',
    title: 'Enterprise Security',
    description: 'Bank-level encryption, SOC 2 compliance, and regular security audits.',
  },
  {
    icon: 'https://img.icons8.com/3d-fluency/94/company.png',
    title: 'Scalable Architecture',
    description: 'Built to grow with your business from startup to enterprise scale.',
  },
  {
    icon: 'https://img.icons8.com/3d-fluency/94/gear--v1.png',
    title: 'Easy Integration',
    description: 'API-first design with SDKs for all major platforms and languages.',
  },
  {
    icon: 'https://img.icons8.com/3d-fluency/94/chatbot.png',
    title: '24/7 Support',
    description: 'Dedicated support team available around the clock for all plans.',
  },
  {
    icon: 'https://img.icons8.com/3d-fluency/94/rocket.png',
    title: 'Regular Updates',
    description: 'Continuous improvements and new features delivered monthly.',
  },
];

export default function ProductFeatures() {
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
    <section className="py-20 px-8 pb-24 bg-black">
      <div className="max-w-[1200px] mx-auto">
        <div className="text-center mb-16">
          <span className="inline-block bg-black text-[#888] text-[0.75rem] uppercase tracking-[0.1em] px-5 py-[0.3rem] rounded-[20px] mb-3 border border-[#2a2a2a]">
            Product Features
          </span>
          <h2 className="text-white text-[2.4rem] font-normal tracking-[-0.02em] mb-2">
            Why Our <span className="text-[#888] font-light">Products</span>
          </h2>
          <p className="text-[#666] text-[1.05rem] font-light max-w-[500px] mx-auto">
            Built with modern technology and designed for real-world impact
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div
              key={index}
              className="bg-[#0a0a0a] border border-[#1a1a1a] rounded-xl p-8 transition-[0.3s_ease] opacity-0 translate-y-[30px] [&.visible]:opacity-100 [&.visible]:translate-y-0 hover:border-[#2a2a2a] hover:bg-[#111] hover:-translate-y-1.5 flex flex-col items-center text-center"
              ref={(el) => { itemsRef.current[index] = el; }}
            >
              <div className="w-20 h-20 rounded-full bg-gradient-to-br from-black-500 to-gray-500 flex items-center justify-center mb-5">
                     <img src={feature.icon} alt={feature.title} className="w-10 h-10 object-contain" />

              </div>
              <h3 className="text-white text-[1.3rem] font-semibold mb-3">
                {feature.title}
              </h3>
              <p className="text-[#666] text-[0.9rem] leading-[1.6]">
                {feature.description}
              </p>
            </div>
          ))}
        </div>

        <div className="mt-20 text-center">
          <div className="bg-[#0a0a0a] border border-[#1a1a1a] rounded-2xl p-12 max-w-4xl mx-auto">
            <h3 className="text-white text-[2rem] font-bold mb-6">
              Ready to Get Started?
            </h3>
            <p className="text-[#666] text-[1.1rem] mb-8 max-w-2xl mx-auto">
              Start your free trial today and experience the difference our products can make for your business.
            </p>
            <div className="flex gap-5 justify-center flex-wrap">
              <button className="inline-flex items-center gap-3 px-10 py-4 bg-blue-500 text-white rounded-full font-medium cursor-pointer transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_20px_40px_rgba(59,130,246,0.3)]">
                <span>Start Free Trial</span>
                <i className="fas fa-arrow-right"></i>
              </button>
              <button className="inline-flex items-center gap-3 px-10 py-4 bg-[#1a1a1a] text-white rounded-full font-medium cursor-pointer transition-all duration-300 hover:-translate-y-1 hover:bg-[#2a2a2a]">
                <span>Schedule Demo</span>
                <i className="fas fa-calendar"></i>
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}