'use client';

import { useState, useEffect, useRef } from 'react';

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

  // Responsive slide height calculation
  const getSlideHeight = () => {
    if (typeof window === 'undefined') return 105;
    if (window.innerWidth < 480) return 160;
    if (window.innerWidth < 640) return 140;
    if (window.innerWidth < 768) return 120;
    return 105;
  };

  const [slideHeight, setSlideHeight] = useState(105);

  useEffect(() => {
    const handleResize = () => {
      setSlideHeight(getSlideHeight());
    };
    
    window.addEventListener('resize', handleResize);
    handleResize();
    
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <section className="w-full bg-gradient-to-b from-[rgba(0,0,108,0.161)] via-black to-black backdrop-blur-[10px] py-12 sm:py-16 md:py-20 lg:py-24 px-4 sm:px-6 md:px-8 lg:px-12 xl:px-16 overflow-hidden">
      <div className="text-center mb-8 sm:mb-10 md:mb-12 lg:mb-14">
        <h2 className="text-white text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold tracking-[-0.03em] mb-2 sm:mb-3">
          Success <span className="bg-gradient-to-br from-[#f0f0f0] to-[#777] bg-clip-text text-transparent">stories</span>
        </h2>
        <p className="text-[#666] text-sm sm:text-base md:text-lg font-light max-w-[500px] mx-auto px-4">
          Real results from real clients who trusted us with their vision
        </p>
      </div>

      <div className="max-w-[1200px] mx-auto grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-8 lg:gap-12 items-start">
        {/* Featured Card */}
        <div className="bg-[#0a0a0a] border border-[#1a1a1a] rounded-xl sm:rounded-2xl overflow-hidden transition-[0.4s_ease] hover:border-[#2a2a2a] hover:-translate-y-1 hover:shadow-[0_20px_40px_rgba(0,0,0,0.4)]">
          <div className="relative w-full h-[200px] xs:h-[220px] sm:h-[250px] md:h-[280px] lg:h-[300px] overflow-hidden">
            <img 
              src={featuredData.image.replace('300&h=200', '600&h=400')} 
              alt={featuredData.featuredTitle} 
              className="w-full h-full object-cover transition-[0.6s_ease] hover:scale-105"
            />
            <span className="absolute top-3 sm:top-4 left-3 sm:left-4 bg-black/80 backdrop-blur-[10px] text-[#888] text-[0.5rem] sm:text-[0.6rem] uppercase tracking-[0.1em] px-2.5 sm:px-4 py-1 sm:py-[0.3rem] rounded-[20px] border border-white/5">
              Featured
            </span>
          </div>
          <div className="p-4 sm:p-5 md:p-6">
            <h3 className="text-white text-base sm:text-lg md:text-xl lg:text-[1.2rem] font-semibold leading-[1.3] sm:leading-[1.4] mb-1.5 sm:mb-2">
              {featuredData.featuredTitle}
            </h3>
            <p className="text-[#666] text-xs sm:text-sm md:text-[0.9rem] leading-[1.5] sm:leading-[1.6] mb-3 sm:mb-4">
              {featuredData.featuredDesc}
            </p>
            <a href="#" className="inline-flex items-center gap-2 sm:gap-[0.6rem] text-[#888] text-xs sm:text-sm md:text-[0.85rem] font-medium no-underline transition-[0.3s_ease] border-b border-transparent pb-[2px] hover:text-white hover:border-b-[#444] hover:gap-3">
              Read Full Story <i className="fas fa-arrow-right text-[0.6rem] sm:text-[0.7rem] transition-[0.3s_ease] hover:translate-x-1"></i>
            </a>
          </div>
        </div>

        {/* Slider */}
        <div className="relative overflow-hidden py-2 sm:py-2.5">
          <div className="overflow-hidden rounded-xl">
            <div 
              className="flex flex-col transition-transform duration-[0.6s] ease-[cubic-bezier(0.25,0.46,0.45,0.94)]"
              style={{ transform: `translateY(-${currentIndex * slideHeight}px)` }}
            >
              {caseStudies.map((study, index) => (
                <div
                  key={study.id}
                  className={`flex items-center gap-3 sm:gap-4 md:gap-5 bg-[#0a0a0a] border border-[#1a1a1a] rounded-xl p-2.5 sm:p-3 cursor-pointer transition-[0.4s_ease] opacity-70 scale-[0.96] flex-shrink-0 mb-2 sm:mb-3 ${
                    currentIndex === index ? 'opacity-100 scale-100 border-[#2a2a2a] bg-[#111] shadow-[0_0_30px_rgba(255,255,255,0.03)]' : ''
                  } hover:border-[#2a2a2a] hover:bg-[#111] hover:translate-x-2`}
                  style={{ height: `${slideHeight}px` }}
                  ref={(el) => { slideRefs.current[index] = el; }}
                  onClick={() => { updateFeatured(index); stopAutoPlay(); setTimeout(startAutoPlay, 3000); }}
                >
                  <div className="relative w-[50px] h-[50px] min-w-[50px] xs:w-[60px] xs:h-[60px] xs:min-w-[60px] sm:w-[70px] sm:h-[70px] sm:min-w-[70px] rounded-[10px] overflow-hidden flex-shrink-0">
                    <img 
                      src={study.image} 
                      alt={study.title} 
                      className="w-full h-full object-cover" 
                      loading="lazy"
                    />
                    <span className="absolute bottom-1 right-1 bg-black/80 backdrop-blur-[10px] text-[#888] text-[0.3rem] xs:text-[0.35rem] sm:text-[0.4rem] uppercase tracking-[0.05em] px-1 sm:px-[0.4rem] py-0.5 sm:py-[0.1rem] rounded-lg border border-white/5">
                      {study.badge}
                    </span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="text-white text-[0.7rem] xs:text-[0.8rem] sm:text-[0.9rem] font-semibold mb-0.5 truncate">
                      {study.title}
                    </h4>
                    <p className="text-[#666] text-[0.6rem] xs:text-[0.65rem] sm:text-[0.75rem] m-0 truncate">
                      {study.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Progress Indicator */}
          <div className="flex justify-center mt-3 sm:mt-4 px-4 sm:px-5">
            <div className="h-[2px] bg-[#1a1a1a] rounded-[2px] w-[40px] sm:w-[50px] md:w-[60px] relative overflow-hidden">
              <div className="absolute left-0 top-0 h-full w-[20%] bg-gradient-to-r from-[#444] to-[#888] rounded-[2px] animate-[progressSlide_4s_linear_infinite]"></div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}