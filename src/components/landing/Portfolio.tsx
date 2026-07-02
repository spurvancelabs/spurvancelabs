'use client';

import Link from 'next/link';
import { useState, useEffect, useRef, useCallback } from 'react';

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
  const [noTransition, setNoTransition] = useState(false);
  const [step, setStep] = useState(0);
  const trackRef = useRef<HTMLDivElement>(null);
  const autoPlayRef = useRef<NodeJS.Timeout | null>(null);

  const getVisibleSlides = () => {
    if (window.innerWidth > 1024) return 3.5;
    if (window.innerWidth > 768) return 2.5;
    if (window.innerWidth > 480) return 1.8;
    return 1.2;
  };

  const totalSlides = projects.length;
  const cloneCount = Math.ceil(visibleSlides);
  const extendedProjects = [...projects, ...projects.slice(0, cloneCount)];

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

  const updateStep = useCallback(() => {
    if (trackRef.current && trackRef.current.children[0]) {
      const child = trackRef.current.children[0] as HTMLElement;
      const gap = 24;
      setStep(child.offsetWidth + gap);
    }
  }, []);

  useEffect(() => {
    updateStep();
    window.addEventListener('resize', updateStep);
    return () => window.removeEventListener('resize', updateStep);
  }, [visibleSlides, updateStep]);

  const nextSlide = useCallback(() => {
    setCurrentIndex(prev => {
      const next = prev + 1;
      if (next >= totalSlides) {
        setTimeout(() => {
          setNoTransition(true);
          setCurrentIndex(0);
        }, 800);
        return next;
      }
      return next;
    });
  }, [totalSlides]);

  const prevSlide = useCallback(() => {
    setCurrentIndex(prev => {
      if (prev <= 0) {
        setNoTransition(true);
        setTimeout(() => {
          setNoTransition(false);
          setCurrentIndex(totalSlides - 1);
        }, 50);
        return totalSlides;
      }
      return prev - 1;
    });
  }, [totalSlides]);

  const startAutoPlay = useCallback(() => {
    if (autoPlayRef.current) clearInterval(autoPlayRef.current);
    autoPlayRef.current = setInterval(nextSlide, 4000);
  }, [nextSlide]);

  const stopAutoPlay = useCallback(() => {
    if (autoPlayRef.current) {
      clearInterval(autoPlayRef.current);
      autoPlayRef.current = null;
    }
  }, []);

  const resetAutoPlay = useCallback(() => {
    stopAutoPlay();
    setTimeout(startAutoPlay, 3000);
  }, [startAutoPlay, stopAutoPlay]);

  useEffect(() => {
    startAutoPlay();
    return () => stopAutoPlay();
  }, [currentIndex, startAutoPlay, stopAutoPlay]);

  useEffect(() => {
    if (noTransition) {
      requestAnimationFrame(() => {
        setNoTransition(false);
      });
    }
  }, [noTransition]);

  return (
    <section className="py-12 px-4 sm:py-20 sm:px-8 pb-16 sm:pb-24 overflow-hidden">
      <div className="text-center mb-12">
        <h2 className="text-white text-[2rem] sm:text-[2.6rem] md:text-[3.2rem] font-bold tracking-[-0.03em] mb-2">
          Featured <span className="bg-gradient-to-br from-[#f0f0f0] to-[#777] bg-clip-text text-transparent">projects</span>
        </h2>
        <p className="text-[#666] text-[0.9rem] sm:text-[1.1rem] font-light max-w-[500px] mx-auto tracking-[0.02em]">
          Handcrafted digital experiences that deliver results
        </p>
      </div>

      <div className="relative max-w-[1200px] mx-auto overflow-hidden px-10 md:px-[40px]">
        <div 
          className={`flex gap-6 ${noTransition ? '' : 'transition-transform duration-[0.8s] ease-[cubic-bezier(0.25,0.46,0.45,0.94)]'}`}
          ref={trackRef}
          style={{ transform: step ? `translateX(-${currentIndex * step}px)` : 'none' }}
        >
          {extendedProjects.map((project, index) => (
            <div key={`${project.id}-${index}`} className="shrink-0 px-[5px]" style={{ minWidth: `${100 / visibleSlides}%` }}>
              <div className="group bg-[#0a0a0a] border border-[#1a1a1a] rounded-2xl overflow-hidden transition-[0.5s_cubic-bezier(0.25,0.46,0.45,0.94)] relative h-[450px] md:h-[400px] sm:h-[350px] max-sm:h-[300px] hover:border-[#2a2a2a] hover:shadow-[0_30px_60px_rgba(0,0,0,0.6)] hover:-translate-y-2">
                <div className="absolute -top-px -left-px -right-px -bottom-px rounded-2xl bg-gradient-to-br from-transparent via-transparent to-[rgba(255,255,255,0.03)] z-0 pointer-events-none"></div>
                <div className="relative w-full h-full overflow-hidden bg-[#1a1a1a]">
                  <img 
                    src={project.image} 
                    alt={project.title} 
                    className="w-full h-full object-cover transition-[0.7s_cubic-bezier(0.25,0.46,0.45,0.94)] group-hover:scale-[1.08]"
                  />
                  <div className="absolute top-0 left-0 right-0 bottom-0 bg-gradient-to-t from-black/85 via-black/40 to-transparent flex items-end justify-center opacity-0 transition-[0.5s_cubic-bezier(0.25,0.46,0.45,0.94)] p-8 group-hover:opacity-100">
                    <div className="text-center translate-y-[30px] transition-[0.5s_cubic-bezier(0.25,0.46,0.45,0.94)] w-full group-hover:translate-y-0">
                      <span className="inline-block text-[#888] text-[0.6rem] uppercase tracking-[0.15em] bg-black/80 px-4 py-[0.25rem] rounded-[20px] border border-white/5 backdrop-blur-[10px] mb-[0.6rem]">
                        {project.category}
                      </span>
                      <h3 className="text-white text-[1.1rem] sm:text-[1.4rem] font-semibold mb-3 tracking-[-0.02em] max-sm:text-[1rem]">
                        {project.title}
                      </h3>
                      <Link
                        href="/products" 
                        className="inline-flex items-center gap-[0.4rem] sm:gap-[0.6rem] text-white text-[0.75rem] sm:text-[0.85rem] font-medium no-underline px-4 sm:px-6 py-1.5 sm:py-2 border border-white/15 rounded-[30px] transition-[0.4s_ease] tracking-[0.02em] bg-white/5 backdrop-blur-[10px] hover:bg-white/10 hover:border-white/30 hover:gap-4"
                      >
                        View Project <i className="fas fa-arrow-right text-[0.7rem] transition-[0.3s_ease] group-hover:translate-x-1"></i>
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        <button 
          className="absolute top-1/2 -translate-y-1/2 w-[50px] h-[50px] max-sm:w-[35px] max-sm:h-[35px] rounded-full bg-white/5 border border-white/10 text-white cursor-pointer text-[1.2rem] max-sm:text-[0.8rem] flex items-center justify-center transition-[0.4s_ease] z-10 backdrop-blur-[10px] left-0 hover:bg-white/10 hover:border-white/20 hover:scale-110" 
          onClick={() => { prevSlide(); resetAutoPlay(); }}
        >
          <i className="fas fa-chevron-left"></i>
        </button>
        <button 
          className="absolute top-1/2 -translate-y-1/2 w-[50px] h-[50px] max-sm:w-[35px] max-sm:h-[35px] rounded-full bg-white/5 border border-white/10 text-white cursor-pointer text-[1.2rem] max-sm:text-[0.8rem] flex items-center justify-center transition-[0.4s_ease] z-10 backdrop-blur-[10px] right-0 hover:bg-white/10 hover:border-white/20 hover:scale-110" 
          onClick={() => { nextSlide(); resetAutoPlay(); }}
        >
          <i className="fas fa-chevron-right"></i>
        </button>
      </div>
    </section>
  );
}