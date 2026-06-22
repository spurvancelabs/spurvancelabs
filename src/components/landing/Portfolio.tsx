'use client';

import { useState, useEffect, useRef } from 'react';
import './Portfolio.css';

const projects = [
  {
    id: 1,
    title: 'E-Commerce Platform',
    category: 'Web Development',
    image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&h=600&fit=crop&crop=center',
  },
  {
    id: 2,
    title: 'Food Delivery App',
    category: 'Mobile Apps',
    image: 'https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=800&h=600&fit=crop&crop=center',
  },
  {
    id: 3,
    title: 'Banking Dashboard',
    category: 'UI/UX Design',
    image: 'https://images.unsplash.com/photo-1561070791-2526d30994b5?w=800&h=600&fit=crop&crop=center',
  },
  {
    id: 4,
    title: 'Fashion Store',
    category: 'E-Commerce',
    image: 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=800&h=600&fit=crop&crop=center',
  },
  {
    id: 5,
    title: 'Healthcare Portal',
    category: 'Web Development',
    image: 'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?w=800&h=600&fit=crop&crop=center',
  },
  {
    id: 6,
    title: 'Fitness App',
    category: 'Mobile Apps',
    image: 'https://images.unsplash.com/photo-1526498460520-4c246339dccb?w=800&h=600&fit=crop&crop=center',
  },
];

export default function Portfolio() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [visibleSlides, setVisibleSlides] = useState(3.5);
  const trackRef = useRef<HTMLDivElement>(null);
  const autoPlayRef = useRef<NodeJS.Timeout | null>(null);

  const getVisibleSlides = () => {
    if (window.innerWidth > 1024) return 3.5;
    if (window.innerWidth > 768) return 2.5;
    if (window.innerWidth > 480) return 1.8;
    return 1.2;
  };

  const totalSlides = projects.length;
  const maxIndex = Math.ceil(totalSlides - visibleSlides);

  useEffect(() => {
    const handleResize = () => {
      setVisibleSlides(getVisibleSlides());
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    setVisibleSlides(getVisibleSlides());
  }, []);

  const goToSlide = (index: number) => {
    if (index < 0) index = 0;
    if (index > maxIndex) index = maxIndex;
    setCurrentIndex(index);
  };

  const nextSlide = () => {
    if (currentIndex < maxIndex) {
      goToSlide(currentIndex + 1);
    } else {
      goToSlide(0);
    }
  };

  const prevSlide = () => {
    if (currentIndex > 0) {
      goToSlide(currentIndex - 1);
    } else {
      goToSlide(maxIndex);
    }
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

  const resetAutoPlay = () => {
    stopAutoPlay();
    setTimeout(startAutoPlay, 3000);
  };

  useEffect(() => {
    startAutoPlay();
    return () => stopAutoPlay();
  }, [currentIndex]);

  const totalDots = Math.ceil(totalSlides / Math.floor(visibleSlides));

  return (
    <section className="portfolio-section">
      <div className="portfolio-header">
        <h2>Featured <span>projects</span></h2>
        <p>Handcrafted digital experiences that deliver results</p>
      </div>

      <div className="portfolio-carousel">
        <div 
          className="portfolio-track" 
          ref={trackRef}
          style={{ transform: `translateX(-${currentIndex * (100 / visibleSlides)}%)` }}
        >
          {projects.map((project) => (
            <div key={project.id} className="portfolio-slide" style={{ minWidth: `${100 / visibleSlides}%` }}>
              <div className="portfolio-card">
                <div className="portfolio-image">
                  <img src={project.image} alt={project.title} />
                  <div className="portfolio-overlay">
                    <div className="portfolio-overlay-content">
                      <span className="project-category">{project.category}</span>
                      <h3>{project.title}</h3>
                      <a href="#" className="portfolio-link">View Project <i className="fas fa-arrow-right"></i></a>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        <button className="carousel-arrow prev-arrow" onClick={() => { prevSlide(); resetAutoPlay(); }}>
          <i className="fas fa-chevron-left"></i>
        </button>
        <button className="carousel-arrow next-arrow" onClick={() => { nextSlide(); resetAutoPlay(); }}>
          <i className="fas fa-chevron-right"></i>
        </button>

        <div className="carousel-dots">
          {Array.from({ length: totalDots }).map((_, i) => (
            <span
              key={i}
              className={`carousel-dot ${Math.round(currentIndex / Math.floor(visibleSlides)) === i ? 'active' : ''}`}
              onClick={() => { goToSlide(i * Math.floor(visibleSlides)); resetAutoPlay(); }}
            />
          ))}
        </div>
      </div>
    </section>
  );
}