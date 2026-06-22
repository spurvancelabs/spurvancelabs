'use client';

import { useEffect, useRef } from 'react';
import './WhyChooseUs.css';

export default function WhyChooseUs() {
  const featuresRef = useRef<(HTMLDivElement | null)[]>([]);
  const cardsRef = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    const allElements = [...featuresRef.current, ...cardsRef.current];
    
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
      { threshold: 0.15, rootMargin: '0px 0px -50px 0px' }
    );

    allElements.forEach((el) => {
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, []);

  return (
    <section className="why-choose-section">
      <div className="why-choose-container">
        <div className="why-choose-left">
          <span className="why-choose-badge">Why Choose Us</span>
          <h2>We're <span>different</span> because we <span>care</span></h2>
          <p>We combine technical expertise with a deep understanding of your business goals to deliver exceptional results.</p>
          
          <div className="why-choose-features">
            <div className="feature-item" data-delay="0" ref={(el) => { featuresRef.current[0] = el; }}>
              <div className="feature-number">01</div>
              <div className="feature-content">
                <h4>10+ Years Experience</h4>
                <p>Proven track record of delivering successful projects</p>
              </div>
            </div>
            <div className="feature-item" data-delay="100" ref={(el) => { featuresRef.current[1] = el; }}>
              <div className="feature-number">02</div>
              <div className="feature-content">
                <h4>500+ Projects Completed</h4>
                <p>From startups to Fortune 500 companies</p>
              </div>
            </div>
            <div className="feature-item" data-delay="200" ref={(el) => { featuresRef.current[2] = el; }}>
              <div className="feature-number">03</div>
              <div className="feature-content">
                <h4>98% Client Retention</h4>
                <p>We build lasting relationships with our clients</p>
              </div>
            </div>
          </div>
        </div>

        <div className="why-choose-right">
            <div className="why-choose-card" data-delay="0" ref={(el) => { cardsRef.current[0] = el; }}>
              <div className="card-icon">
                <i className="fas fa-bolt"></i>
              </div>
              <div className="card-content">
                <h3>Fast &amp; Reliable</h3>
                <p>Lightning-fast development with robust, scalable solutions</p>
              </div>
            </div>

          <div className="why-choose-card" data-delay="150" ref={(el) => { cardsRef.current[1] = el; }}>
            <div className="card-icon">
              <i className="fas fa-star"></i>
            </div>
            <div className="card-content">
              <h3>Quality First</h3>
              <p>Rigorous testing and quality assurance in every project</p>
            </div>
          </div>

          <div className="why-choose-card" data-delay="300" ref={(el) => { cardsRef.current[2] = el; }}>
            <div className="card-icon">
              <i className="fas fa-heart"></i>
            </div>
            <div className="card-content">
              <h3>Passionate Team</h3>
              <p>Dedicated professionals who love what they do</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}