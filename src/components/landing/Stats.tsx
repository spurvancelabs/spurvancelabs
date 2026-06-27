'use client';

import { useEffect, useRef, useState } from 'react';

const statsData = [
  { count: 500, label: 'Projects Delivered', suffix: '+' },
  { count: 100, label: 'Team Members', suffix: '+' },
  { count: 1200, label: 'Happy Clients', suffix: '+' },
  { count: 98, label: '% Satisfaction', suffix: '%' },
];

export default function Stats() {
  const [counts, setCounts] = useState(statsData.map(() => 0));
  const [hasAnimated, setHasAnimated] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !hasAnimated) {
          setHasAnimated(true);
          statsData.forEach((stat, index) => {
            let current = 0;
            const increment = stat.count / 60;
            const timer = setInterval(() => {
              current += increment;
              if (current >= stat.count) {
                current = stat.count;
                clearInterval(timer);
              }
              setCounts((prev) => {
                const newCounts = [...prev];
                newCounts[index] = Math.round(current);
                return newCounts;
              });
            }, 30);
          });
        }
      },
      { threshold: 0.3 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, [hasAnimated]);

  return (
    <section className="py-10 px-4 sm:py-16 sm:px-8 pb-12 sm:pb-20 max-w-[1100px] mx-auto text-center" ref={sectionRef}>
      <div className="mb-8 sm:mb-12">
        <h2 className="text-white text-[1.8rem] sm:text-[2rem] md:text-[2.4rem] font-normal tracking-[-0.02em] mb-2">
          By the <span className="text-[#888] font-light">numbers</span>
        </h2>
        <p className="text-[#666] text-[0.9rem] sm:text-[1.05rem] font-light max-w-[500px] mx-auto">
          Delivering excellence through measurable results
        </p>
      </div>
      <div className="grid grid-cols-[repeat(auto-fit,minmax(150px,1fr))] sm:grid-cols-[repeat(auto-fit,minmax(180px,1fr))] gap-[1.2rem_1rem] sm:gap-[2rem_1.5rem] mt-4">
        {statsData.map((stat, index) => (
          <div 
            key={index} 
            className="flex flex-col items-center gap-1 py-8 px-4 rounded-xl border border-transparent transition-[0.25s_ease] cursor-default hover:border-[#2a2a2a] hover:bg-[#0a0a0a] hover:-translate-y-1"
          >
            <span className="text-[2rem] sm:text-[2.6rem] md:text-[3.2rem] font-bold bg-gradient-to-br from-[#f0f0f0] to-[#888] bg-clip-text text-transparent leading-[1.2] tracking-[-0.02em]">
              {counts[index]}{stat.suffix}
            </span>
            <span className="text-[0.8rem] sm:text-[0.9rem] text-[#666] tracking-[0.03em] font-normal uppercase hover:text-[#aaa]">
              {stat.label}
            </span>
          </div>
        ))}
      </div>
    </section>
  );
}