'use client';

import { useEffect, useRef } from 'react';
import './Cta.css';

export default function Cta() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // Fade in animation
    container.style.opacity = '0';
    container.style.transform = 'translateY(30px)';
    container.style.transition = 'opacity 0.8s ease, transform 0.8s ease';

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            container.style.opacity = '1';
            container.style.transform = 'translateY(0)';
            observer.unobserve(container);
          }
        });
      },
      { threshold: 0.1, rootMargin: '0px 0px -50px 0px' }
    );

    observer.observe(container);

    return () => observer.disconnect();
  }, []);

  return (
    <section className="cta-section">
      <div className="cta-container" ref={containerRef}>
        <div className="cta-orb cta-orb-1"></div>
        <div className="cta-orb cta-orb-2"></div>
        <div className="cta-orb cta-orb-3"></div>
        
        <div className="cta-content">
          <h2>Ready to build something <span>amazing</span>?</h2>
          <p>Let's collaborate and turn your vision into reality. We're here to help you succeed.</p>
          
          <div className="cta-buttons">
            <a href="#" className="cta-btn-primary">
              Start Your Project
              <i className="fas fa-arrow-right"></i>
            </a>
            <a href="#" className="cta-btn-secondary">
              <i className="fas fa-phone"></i>
              Book a Call
            </a>
          </div>
          
          <div className="cta-stats">
            <div className="cta-stat">
              <span className="cta-stat-number">500+</span>
              <span className="cta-stat-label">Projects Delivered</span>
            </div>
            <div className="cta-stat-divider"></div>
            <div className="cta-stat">
              <span className="cta-stat-number">98%</span>
              <span className="cta-stat-label">Client Satisfaction</span>
            </div>
            <div className="cta-stat-divider"></div>
            <div className="cta-stat">
              <span className="cta-stat-number">24/7</span>
              <span className="cta-stat-label">Support Available</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}