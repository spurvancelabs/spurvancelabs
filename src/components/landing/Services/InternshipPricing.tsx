'use client';

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
    stipend: '$2,000/month',
    description: 'Work with machine learning models and data analysis.',
    skills: ['Python', 'TensorFlow', 'SQL', 'Data Viz'],
    icon: 'fa-brain',
    color: 'from-indigo-500 to-blue-600',
  },
  {
    id: 6,
    title: 'Cloud Infrastructure',
    duration: '3 months',
    stipend: '$1,700/month',
    description: 'Manage cloud systems and DevOps practices.',
    skills: ['AWS', 'Docker', 'Kubernetes', 'CI/CD'],
    icon: 'fa-cloud',
    color: 'from-cyan-500 to-sky-600',
  },
];

export default function InternshipPricing() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const autoPlayRef = useRef<NodeJS.Timeout | null>(null);

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
    
    if (diff === 0) {
      return {
        transform: 'translateX(0) scale(1)',
        opacity: 1,
        filter: 'blur(0px)',
        zIndex: 20,
      };
    } else if (diff === 1 || diff === internshipPrograms.length - 1) {
      const translateX = diff === 1 ? '60%' : '-60%';
      return {
        transform: `translateX(${translateX}) scale(0.8)`,
        opacity: 0.6,
        filter: 'blur(4px)',
        zIndex: 10,
      };
    } else {
      return {
        transform: diff === 2 ? 'translateX(120%) scale(0.6)' : 'translateX(-120%) scale(0.6)',
        opacity: 0.3,
        filter: 'blur(8px)',
        zIndex: 5,
      };
    }
  };

  return (
    <div className="py-20 px-4 relative min-h-screen flex items-center ">
      <div className="absolute  inset-0 flex items-center justify-center pointer-events-none">
        <h1 className="text-[12rem] font-bold text-white/5 select-none tracking-wider">
          INTERSHIPS
        </h1>
      </div>

      <div className="relative z-10 w-full max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <span className="inline-block text-[#888] text-[0.75rem] uppercase tracking-[0.1em] bg-[#1a1a1a] px-5 py-[0.3rem] rounded-[20px] mb-3 border border-[#2a2a2a]">
            Program Details
          </span>
          <h2 className="text-white text-[2.4rem] font-normal tracking-[-0.02em] mb-2">
            Internship <span className="text-[#888] font-light">Programs</span>
          </h2>
          <p className="text-[#666] text-[1.05rem] font-light max-w-[500px] mx-auto">
            Choose from our specialized tracks and kickstart your career
          </p>
        </div>

        <div className="relative h-96 flex items-center justify-center">
          <div className="relative w-full h-full">
            {internshipPrograms.map((program, index) => {
              const style = getItemStyle(index);
              const isActive = index === currentIndex;
              
              return (
                <div
                  key={program.id}
                  className="absolute top-0 left-100 w-full max-w-md mx-auto bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-8 transition-all duration-700 ease-out flex flex-col h-full"
                  style={{
                    ...style,
                    width: isActive ? '320px' : '240px',
                    height: isActive ? '400px' : '300px',
                  }}
                >
                  <div className={`w-20 h-20 rounded-2xl bg-gradient-to-br ${program.color} flex items-center justify-center mx-auto mb-5`}>
                    <i className={`fas ${program.icon} text-3xl text-white`}></i>
                  </div>

                  <h3 className={`text-white text-center font-bold transition-all duration-500 ${
                    isActive ? 'text-[1.8rem]' : 'text-[1.3rem]'
                  }`}>
                    {program.title}
                  </h3>

                  <span className={`text-center text-[0.75rem] uppercase tracking-[0.1em] font-medium mt-2 mb-4 ${
                    isActive ? 'text-blue-500' : 'text-white/40'
                  }`}>
                    {program.duration}
                  </span>

                  <p className={`text-center transition-all duration-500 ${
                    isActive ? 'text-white/80 text-[0.95rem] mb-6' : 'text-white/60 text-[0.8rem] mb-4'
                  }`}>
                    {program.description}
                  </p>

                  <div className="flex flex-wrap gap-2 justify-center mb-6">
                    {program.skills.slice(0, isActive ? 4 : 2).map((skill, i) => (
                      <span key={i} className={`text-[0.7rem] px-3 py-1 rounded-full border ${
                        isActive 
                          ? 'text-blue-500 bg-blue-500/10 border-blue-500/20' 
                          : 'text-white/60 bg-white/5 border-white/10'
                      }`}>
                        {skill}
                      </span>
                    ))}
                  </div>

                  <div className="mt-auto text-center">
                    <span className={`font-bold block mb-4 ${
                      isActive ? 'text-white text-[1.3rem]' : 'text-white/80 text-[1rem]'
                    }`}>
                      {program.stipend}
                    </span>
                    <button className={`w-full py-3 rounded-xl font-medium transition-all duration-300 ${
                      isActive
                        ? 'bg-blue-500 text-white hover:bg-blue-600 cursor-pointer'
                        : 'bg-white/10 text-white/60 cursor-not-allowed'
                    }`}>
                      {isActive ? 'Apply Now' : 'View Details'}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

          <button
            onClick={() => { prevSlide(); }}
            className="absolute left-10 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-white/5 border border-white/10 text-white flex items-center justify-center hover:bg-white/10 hover:border-white/20 transition-all duration-300 z-30"
          >
            <i className="fas fa-chevron-left text-lg"></i>
          </button>

          <button
            onClick={() => { nextSlide(); }}
            className="absolute right-30 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-white/5 border border-white/10 text-white flex items-center justify-center hover:bg-white/10 hover:border-white/20 transition-all duration-300 z-30"
          >
            <i className="fas fa-chevron-right text-lg"></i>
          </button>

          <div className="flex justify-center gap-3 mt-8">
            {internshipPrograms.map((_, index) => (
              <span
                key={index}
                className={`w-2 h-2 rounded-full transition-all duration-300 cursor-pointer ${
                  index === currentIndex 
                    ? 'bg-blue-500 scale-150' 
                    : 'bg-white/20 hover:bg-white/40'
                }`}
                onClick={() => setCurrentIndex(index)}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}