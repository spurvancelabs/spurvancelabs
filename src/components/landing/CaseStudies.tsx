'use client';

import { useState, useEffect, useRef } from 'react';
import './CaseStudies.css';

const caseStudies = [
  {
    id: 1,
    title: 'E-Commerce Platform',
    description: '300% revenue growth',
    image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=300&h=200&fit=crop&crop=center',
    badge: 'Featured',
    featuredTitle: 'Transformed a Traditional Retailer into an E-Commerce Giant',
    featuredDesc: 'A legacy fashion brand needed to modernize their operations and reach digital-first customers.',
  },
  {
    id: 2,
    title: 'Food Delivery App',
    description: '500K+ downloads',
    image: 'https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=300&h=200&fit=crop&crop=center',
    badge: 'Popular',
    featuredTitle: 'Revolutionized Food Delivery with AI-Powered Recommendations',
    featuredDesc: 'A food delivery startup needed a scalable app with smart recommendations.',
  },
  {
    id: 3,
    title: 'Healthcare Platform',
    description: '10K+ patients',
    image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=300&h=200&fit=crop&crop=center',
    badge: 'Innovation',
    featuredTitle: 'Modernized Healthcare with HIPAA-Compliant Solutions',
    featuredDesc: 'A healthcare provider needed a secure, compliant patient management system.',
  },
  {
    id: 4,
    title: 'FinTech Platform',
    description: '1M+ users',
    image: 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=300&h=200&fit=crop&crop=center',
    badge: 'Award Winner',
    featuredTitle: 'Built a Banking Platform Used by Over 1 Million Users',
    featuredDesc: 'A fintech startup needed a modern, secure banking platform with real-time features.',
  },
  {
    id: 5,
    title: 'SaaS Platform',
    description: '10K+ enterprise users',
    image: 'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?w=300&h=200&fit=crop&crop=center',
    badge: 'Rapid Growth',
    featuredTitle: 'Scaled a SaaS Platform from Zero to 10K Enterprise Users',
    featuredDesc: 'A B2B SaaS company needed to scale their platform for enterprise clients.',
  },
  {
    id: 6,
    title: 'EdTech Platform',
    description: '50K+ students',
    image: 'https://images.unsplash.com/photo-1526498460520-4c246339dccb?w=300&h=200&fit=crop&crop=center',
    badge: 'Impact',
    featuredTitle: 'Transformed Education with Interactive Learning Tools',
    featuredDesc: 'An EdTech company needed to increase student engagement through gamification.',
  },
  {
    id: 7,
    title: 'AI Platform',
    description: '2M+ predictions/day',
    image: 'https://images.unsplash.com/photo-1558655146-9f40138edfeb?w=300&h=200&fit=crop&crop=center',
    badge: 'AI Innovation',
    featuredTitle: 'Built an AI Platform Processing 2M+ Predictions Daily',
    featuredDesc: 'An AI startup needed a scalable infrastructure for real-time predictions.',
  },
  {
    id: 8,
    title: 'Real Estate Platform',
    description: '200% sales growth',
    image: 'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?w=300&h=200&fit=crop&crop=center',
    badge: 'Game Changer',
    featuredTitle: 'Doubled Sales for a Real Estate Platform with Smart Tools',
    featuredDesc: 'A real estate company needed a digital platform to streamline property listings.',
  },
];

export default function CaseStudies() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [featuredData, setFeaturedData] = useState(caseStudies[0]);
  const slideRefs = useRef<(HTMLDivElement | null)[]>([]);
  const autoPlayRef = useRef<NodeJS.Timeout | null>(null);

  const updateFeatured = (index: number) => {
    setCurrentIndex(index);
    setFeaturedData(caseStudies[index]);
  };

  const nextSlide = () => {
    const nextIndex = (currentIndex + 1) % caseStudies.length;
    updateFeatured(nextIndex);
  };

  const startAutoPlay = () => {
    if (autoPlayRef.current) clearInterval(autoPlayRef.current);
    autoPlayRef.current = setInterval(nextSlide, 4000);
  };

  const stopAutoPlay = () => {
    if (autoPlayRef.current) {
      clearInterval(autoPlayRef.current);
      autoPlayRef.current = null;
    }
  };

  useEffect(() => {
    startAutoPlay();
    return () => stopAutoPlay();
  }, [currentIndex]);

  // Scroll animation for slides
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const index = slideRefs.current.indexOf(entry.target as HTMLDivElement);
            setTimeout(() => {
              entry.target.classList.add('visible');
            }, index * 100);
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.1, rootMargin: '0px 0px -50px 0px' }
    );

    slideRefs.current.forEach((slide) => {
      if (slide) observer.observe(slide);
    });

    return () => observer.disconnect();
  }, []);

  return (
    <section className="case-section">
      <div className="case-header">
        <h2>Success <span>stories</span></h2>
        <p>Real results from real clients who trusted us with their vision</p>
      </div>

      <div className="case-container">
        <div className="case-featured">
          <div className="case-featured-image">
            <img src={featuredData.image.replace('300&h=200', '600&h=400')} alt={featuredData.featuredTitle} />
            <span className="case-featured-badge">Featured</span>
          </div>
          <div className="case-featured-content">
            <h3>{featuredData.featuredTitle}</h3>
            <p>{featuredData.featuredDesc}</p>
            <a href="#" className="case-featured-link">Read Full Story <i className="fas fa-arrow-right"></i></a>
          </div>
        </div>

        <div className="case-slider">
          <div className="case-slider-wrapper">
            <div className="case-slider-track" style={{ transform: `translateY(-${currentIndex * 105}px)` }}>
              {caseStudies.map((study, index) => (
                <div
                  key={study.id}
                  className={`case-slide ${currentIndex === index ? 'active' : ''}`}
                  ref={(el) => { slideRefs.current[index] = el; }}
                  onClick={() => { updateFeatured(index); stopAutoPlay(); setTimeout(startAutoPlay, 3000); }}
                >
                  <div className="case-slide-image">
                    <img src={study.image} alt={study.title} />
                    <span className="case-slide-badge">{study.badge}</span>
                  </div>
                  <div className="case-slide-content">
                    <h4>{study.title}</h4>
                    <p>{study.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="case-slider-indicators">
            <div className="slider-progress"></div>
          </div>
        </div>
      </div>
    </section>
  );
}