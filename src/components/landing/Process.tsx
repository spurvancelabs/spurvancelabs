'use client';

import { useEffect, useRef } from 'react';
import './Process.css';

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
    <section className="process-section">
      <div className="process-header">
        <h2>Our <span>development process</span></h2>
        <p>A streamlined approach to turn your ideas into reality</p>
      </div>

      <div className="process-timeline">
        {processSteps.map((step, index) => (
          <div
            key={index}
            className="process-step"
            data-delay={index * 150}
            ref={(el) => { stepsRef.current[index] = el; }}
          >
            <div className="step-number">{step.number}</div>
            <div className="step-content">
              <div className="step-image">
                <img src={step.image} alt={step.title} />
                <div className="step-image-overlay">
                  <i className={`fas ${step.icon}`}></i>
                </div>
              </div>
              <div className="step-text">
                <h3>{step.title}</h3>
                <p>{step.description}</p>
                <ul className="step-details">
                  {step.details.map((detail, i) => (
                    <li key={i}>
                      <i className="fas fa-check"></i> {detail}
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