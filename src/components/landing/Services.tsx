'use client';

import { useEffect, useRef } from 'react';
import './Services.css';

const services = [
  {
    icon: 'fa-code',
    title: 'Web Development',
    description: 'Custom websites, web applications, and responsive designs built with modern technologies.',
  },
  {
    icon: 'fa-mobile-alt',
    title: 'Mobile Apps',
    description: 'Native and cross-platform mobile applications for iOS and Android with seamless UX.',
  },
  {
    icon: 'fa-cloud',
    title: 'Cloud Solutions',
    description: 'Scalable cloud infrastructure, migration services, and DevOps implementation.',
  },
  {
    icon: 'fa-brain',
    title: 'AI & Machine Learning',
    description: 'Intelligent automation, predictive analytics, and custom ML models for your data.',
  },
  {
    icon: 'fa-shield-alt',
    title: 'Cybersecurity',
    description: 'Comprehensive security audits, penetration testing, and compliance solutions.',
  },
  {
    icon: 'fa-chart-line',
    title: 'Data Analytics',
    description: 'Business intelligence, data visualization, and actionable insights from your data.',
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
    <section className="services-section">
      <div className="services-header">
        <span className="services-badge">What We Do</span>
        <h2>Our <span>services</span></h2>
        <p>Comprehensive solutions tailored to your business needs</p>
      </div>
      <div className="services-grid">
        {services.map((service, index) => (
          <div
            key={index}
            className="services-item"
            ref={(el) => { itemsRef.current[index] = el; }}
          >
            <div className="services-icon">
              <i className={`fas ${service.icon}`}></i>
            </div>
            <h3>{service.title}</h3>
            <p>{service.description}</p>
            <a href="#" className="services-link">Learn More →</a>
          </div>
        ))}
      </div>
    </section>
  );
}