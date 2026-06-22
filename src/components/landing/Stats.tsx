'use client';

import { useEffect, useRef, useState } from 'react';
import './Stats.css';

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
    <section className="stats-section" ref={sectionRef}>
      <div className="stats-header">
        <h2>By the <span>numbers</span></h2>
        <p>Delivering excellence through measurable results</p>
      </div>
      <div className="stats-grid">
        {statsData.map((stat, index) => (
          <div key={index} className="stats-item">
            <span className="stats-number">
              {counts[index]}{stat.suffix}
            </span>
            <span className="stats-label">{stat.label}</span>
          </div>
        ))}
      </div>
    </section>
  );
}