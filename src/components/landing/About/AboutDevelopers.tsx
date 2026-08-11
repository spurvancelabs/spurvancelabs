'use client';

import { useEffect, useRef, useState } from 'react';

interface Developer {
  name: string;
  role: string;
  image: string;
  whatBuilt: string;
  socials: {
    linkedin?: string;
    facebook?: string;
    github?: string;
  };
}

const developers: Developer[] = [
  {
    name: 'Muzammil Riaz',
    role: 'Full Stack Developer',
    image: '/images/developers/me.png',
    whatBuilt:
      'I am the developer behind the entire Spurvancelab website — responsible for its complete design and development, from UI/UX and responsive front-end engineering to deployment. My focus is on clean, maintainable code, performance, and a seamless, professional user experience that reflects the quality of the work we deliver.',
    socials: {
      linkedin: 'https://www.linkedin.com/in/muzammilriazofficial',
      facebook: 'https://www.facebook.com/muzammilriazofficial01',
      github: 'https://github.com/muzammilriazofficial',
    },
  },
];

const socialLinks: { key: keyof Developer['socials']; icon: string; label: string }[] = [
  { key: 'linkedin', icon: 'fab fa-linkedin-in', label: 'LinkedIn' },
  { key: 'facebook', icon: 'fab fa-facebook-f', label: 'Facebook' },
  { key: 'github', icon: 'fab fa-github', label: 'GitHub' },
];

const socialHover: Record<string, string> = {
  linkedin: 'hover:bg-[#0A66C2] hover:border-[#0A66C2] hover:text-white',
  facebook: 'hover:bg-[#1877F2] hover:border-[#1877F2] hover:text-white',
  github: 'hover:bg-[#4078C0] hover:border-[#4078C0] hover:text-white',
};

export default function AboutDevelopers() {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const wrapperRefs = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        wrapperRefs.current.every(
          (el) => el && !el.contains(e.target as Node)
        )
      ) {
        setActiveIndex(null);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const toggle = (index: number) => {
    setActiveIndex((current) => (current === index ? null : index));
  };

  return (
    <section className="py-20 px-8">
      <style>{`
        @keyframes popupIn {
          from { opacity: 0; transform: translateY(10px) scale(0.97); }
          to { opacity: 1; transform: translateY(0) scale(1); }
        }
      `}</style>
      <div className="max-w-[1200px] mx-auto">
        <div className="text-center mb-16">
          <span className="inline-block bg-black text-[#888] text-[0.75rem] uppercase tracking-[0.1em] px-5 py-[0.3rem] rounded-[20px] mb-3 border border-[#2a2a2a]">
            Our Developers
          </span>
          <h2 className="text-white text-[1.8rem] md:text-[2.4rem] font-normal tracking-[-0.02em] mb-2">
            Meet The <span className="text-[#888] font-light">Developers</span>
          </h2>
          <p className="text-[#666] text-[1.05rem] font-light max-w-[500px] mx-auto">
            The people who build the products you use every day
          </p>
        </div>

        <div className="flex flex-wrap items-start justify-center gap-10 sm:gap-14">
          {developers.map((developer, index) => (
            <div
              key={index}
              ref={(el) => { wrapperRefs.current[index] = el; }}
              className="relative"
              onMouseEnter={() => setActiveIndex(index)}
              onMouseLeave={() => setActiveIndex(null)}
              onClick={() => toggle(index)}
            >
              <div className="group flex flex-col items-center">
                <div className="relative w-28 h-28 sm:w-32 sm:h-32">
                  <div className="w-full h-full rounded-full overflow-hidden border-2 border-[#2a2a2a] transition-all duration-300 group-hover:border-blue-500/60 cursor-pointer">
                    <img
                      src={developer.image}
                      alt={developer.name}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                    />
                  </div>
                </div>
                <h3 className="mt-5 text-white text-lg font-medium">
                  {developer.name}
                </h3>
                <p className="mt-1 text-[#888] text-[0.85rem]">
                  {developer.role}
                </p>
              </div>

              {activeIndex === index && (
                <div className="absolute bottom-full left-1/2 -translate-x-1/2 z-50 flex flex-col items-center pb-5">
                  <div className="w-[340px] bg-[#0d0d12] border border-[#26262e] rounded-2xl shadow-[0_20px_50px_-12px_rgba(0,0,0,0.8)] animate-[popupIn_0.2s_ease]">
                    <div className="p-6">
                      <div className="flex items-center gap-4 pb-5 border-b border-[#1f1f27]">
                        <div className="w-16 h-16 flex-shrink-0 rounded-full overflow-hidden border-2 border-blue-500/40">
                          <img src={developer.image} alt={developer.name} className="w-full h-full object-cover" />
                        </div>
                        <div className="min-w-0">
                          <h3 className="text-white text-lg font-semibold leading-tight">
                            {developer.name}
                          </h3>
                          <p className="text-blue-400 text-[0.85rem] font-medium mt-0.5">
                            {developer.role}
                          </p>
                          <p className="text-[#666] text-[0.75rem] mt-1">
                            Developer @ Spurvancelab
                          </p>
                        </div>
                      </div>

                      <div className="pt-5">
                        <p className="text-[#b8b8c0] text-[0.9rem] leading-[1.75] mb-5">
                          {developer.whatBuilt}
                        </p>

                        <div className="flex items-center justify-between gap-3">
                          <span className="text-[#666] text-[0.7rem] uppercase tracking-[0.12em] font-medium">
                            Connect
                          </span>
                          <div className="flex items-center gap-2.5">
                            {socialLinks.map((social) => {
                              const href = developer.socials[social.key];
                              if (!href) return null;
                              return (
                                <a
                                  key={social.key}
                                  href={href}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  aria-label={social.label}
                                  title={social.label}
                                  className={`w-10 h-10 rounded-full bg-[#141419] border border-[#26262e] flex items-center justify-center text-[#8a8a94] transition-all duration-300 hover:scale-110 ${socialHover[social.key] || ''}`}
                                >
                                  <i className={`${social.icon} text-sm`}></i>
                                </a>
                              );
                            })}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="w-4 h-4 bg-[#0d0d12] border-b border-r border-[#26262e] rotate-45 -mt-3" />
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
