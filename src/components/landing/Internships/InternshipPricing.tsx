'use client';

import Link from 'next/link';
import { useState, useEffect, useRef } from 'react';

const internshipPrograms = [
  {
    id: 1,
    title: 'Frontend Development',
    duration: '3 months',
    description: 'Build responsive web applications with React, TypeScript, and modern frameworks.',
    skills: ['React', 'TypeScript', 'Next.js', 'Tailwind CSS'],
    icon: 'fa-laptop-code',
    color: 'from-blue-500 to-purple-600',
  },
  {
    id: 2,
    title: 'Backend Engineering',
    duration: '4 months',
    description: 'Develop scalable server-side applications and APIs.',
    skills: ['Node.js', 'Python', 'MongoDB', 'REST APIs'],
    icon: 'fa-server',
    color: 'from-emerald-500 to-teal-600',
  },
  {
    id: 3,
    title: 'Mobile Development',
    duration: '3 months',
    description: 'Create cross-platform mobile apps for iOS and Android.',
    skills: ['React Native', 'Flutter', 'iOS', 'Android'],
    icon: 'fa-mobile-alt',
    color: 'from-orange-500 to-red-600',
  },
  {
    id: 4,
    title: 'UI/UX Design',
    duration: '2 months',
    description: 'Design intuitive user experiences and interfaces.',
    skills: ['Figma', 'Adobe XD', 'Prototyping', 'User Research'],
    icon: 'fa-palette',
    color: 'from-pink-500 to-rose-600',
  },
  {
    id: 5,
    title: 'Data Science',
    duration: '6 months',
    description: 'Work with machine learning models and data analysis.',
    skills: ['Python', 'TensorFlow', 'SQL', 'Data Viz'],
    icon: 'fa-brain',
    color: 'from-indigo-500 to-blue-600',
  },
  {
    id: 6,
    title: 'Cloud Infrastructure',
    duration: '3 months',
    description: 'Manage cloud systems and DevOps practices.',
    skills: ['AWS', 'Docker', 'Kubernetes', 'CI/CD'],
    icon: 'fa-cloud',
    color: 'from-cyan-500 to-sky-600',
  },
];

export default function InternshipPricing() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isMobile, setIsMobile] = useState(false);
  const autoPlayRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 640);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev + 1) % internshipPrograms.length);
  };

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev - 1 + internshipPrograms.length) % internshipPrograms.length);
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

  const getItemStyle = (index: number) => {
    const diff = (index - currentIndex + internshipPrograms.length) % internshipPrograms.length;
    const s = isMobile ? { near: '45%', far: '90%', nearScale: 0.7, farScale: 0.5 } : { near: '60%', far: '120%', nearScale: 0.8, farScale: 0.6 };
    
    if (diff === 0) {
      return {
        transform: 'translateX(0) scale(1)',
        opacity: 1,
        filter: 'blur(0px)',
        zIndex: 20,
      };
    } else if (diff === 1 || diff === internshipPrograms.length - 1) {
      const translateX = diff === 1 ? s.near : `-${s.near}`;
      return {
        transform: `translateX(${translateX}) scale(${s.nearScale})`,
        opacity: 0.6,
        filter: 'blur(4px)',
        zIndex: 10,
      };
    } else {
      return {
        transform: diff === 2 ? `translateX(${s.far}) scale(${s.farScale})` : `translateX(-${s.far}) scale(${s.farScale})`,
        opacity: 0.3,
        filter: 'blur(8px)',
        zIndex: 5,
      };
    }
  };

  return (
    <div className="py-20 px-4 relative min-h-screen flex items-center overflow-hidden">
   

      <div className="relative z-10 w-full max-w-6xl mx-auto">
        <div className="text-center mb-12 max-sm:mb-8">
          <span className="inline-block text-[#888] text-[0.75rem] max-sm:text-[0.65rem] uppercase tracking-[0.1em] bg-[#1a1a1a] px-5 max-sm:px-4 py-[0.3rem] rounded-[20px] mb-3 border border-[#2a2a2a]">
            Program Details
          </span>
          <h2 className="text-white text-[1.8rem] max-sm:text-[1.5rem] md:text-[2.4rem] font-normal tracking-[-0.02em] mb-2">
            Internship <span className="text-[#888] font-light">Programs</span>
          </h2>
          <p className="text-[#666] text-[1.05rem] max-sm:text-[0.9rem] font-light max-w-[500px] mx-auto max-sm:px-4">
            Choose from our specialized tracks and kickstart your career
          </p>
        </div>

        <div className="relative h-96 max-sm:h-90 flex items-center justify-center">
          <div className="relative w-full h-full">
            {internshipPrograms.map((program, index) => {
              const style = getItemStyle(index);
              const isActive = index === currentIndex;
              
              return (
                <div
                  key={program.id}
                  className="absolute top-0 left-100 max-sm:left-8 bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-8 max-sm:p-5 transition-all duration-700 ease-out flex flex-col overflow-hidden"
                  style={{
                    ...style,
                    width: isActive ? (isMobile ? '280px' : '320px') : (isMobile ? '200px' : '240px'),
                    height: isActive ? (isMobile ? '420px' : '460px') : (isMobile ? '260px' : '300px'),
                  }}
                >
                  <div className={`w-20 h-20 max-sm:w-16 max-sm:h-16 rounded-2xl bg-gradient-to-br ${program.color} flex items-center justify-center mx-auto mb-5 max-sm:mb-4`}>
                    <i className={`fas ${program.icon} text-3xl max-sm:text-2xl text-white`}></i>
                  </div>

                  <h3 className={`text-white text-center font-bold transition-all duration-500 ${
                    isActive ? 'text-[1.8rem] max-sm:text-[1.4rem]' : 'text-[1.3rem] max-sm:text-[1.1rem]'
                  }`}>
                    {program.title}
                  </h3>

                  <span className={`text-center text-[0.75rem] max-sm:text-[0.65rem] uppercase tracking-[0.1em] font-medium mt-2 mb-4 max-sm:mb-3 ${
                    isActive ? 'text-blue-500' : 'text-white/40'
                  }`}>
                    {program.duration}
                  </span>

                  <p className={`text-center transition-all duration-500 ${
                    isActive ? 'text-white/80 text-[0.95rem] max-sm:text-[0.85rem] mb-6 max-sm:mb-4' : 'text-white/60 text-[0.8rem] max-sm:text-[0.7rem] mb-4 max-sm:mb-3'
                  }`}>
                    {program.description}
                  </p>

                  <div className="flex flex-wrap gap-2 max-sm:gap-1 justify-center mb-6 max-sm:mb-4">
                    {program.skills.slice(0, isActive ? 4 : 2).map((skill, i) => (
                      <span key={i} className={`text-[0.7rem] max-sm:text-[0.6rem] px-3 max-sm:px-2 py-1 rounded-full border ${
                        isActive 
                          ? 'text-blue-500 bg-blue-500/10 border-blue-500/20' 
                          : 'text-white/60 bg-white/5 border-white/10'
                      }`}>
                        {skill}
                      </span>
                    ))}
                  </div>

                       {isActive && (
                      <Link href="#internship-listings" className="w-full text-center py-2 max-sm:py-2 rounded-xl font-medium transition-all duration-300 max-sm:text-sm bg-blue-500 text-white hover:bg-blue-600 cursor-pointer">
                        Apply Now
                      </Link>
                    )}
                  </div>
              );
            })}
          </div>

          <button
            onClick={() => { prevSlide(); }}
            className="absolute left-6 max-sm:left-2 top-1/2 -translate-y-1/2 w-12 h-12 max-sm:w-9 max-sm:h-9 rounded-full bg-white/5 border border-white/10 text-white flex items-center justify-center hover:bg-white/10 hover:border-white/20 transition-all duration-300 z-30"
          >
            <i className="fas fa-chevron-left text-lg max-sm:text-sm"></i>
          </button>

          <button
            onClick={() => { nextSlide(); }}
            className="absolute right-6 max-sm:right-0 top-1/2 -translate-y-1/2 w-12 h-12 max-sm:w-9 max-sm:h-9 rounded-full bg-white/5 border border-white/10 text-white flex items-center justify-center hover:bg-white/10 hover:border-white/20 transition-all duration-300 z-30"
          >
            <i className="fas fa-chevron-right text-lg max-sm:text-sm"></i>
          </button>

        </div>
      </div>
    </div>
  );
}