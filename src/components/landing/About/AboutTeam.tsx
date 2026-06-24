'use client';

import { useEffect, useRef } from 'react';

const teamMembers = [
  {
    name: 'Alex Johnson',
    role: 'CEO & Founder',
    image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&h=300&fit=crop&crop=center',
    skills: ['Leadership', 'Strategy', 'Innovation'],
  },
  {
    name: 'Sarah Chen',
    role: 'CTO',
    image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=300&h=300&fit=crop&crop=center',
    skills: ['Technology', 'AI', 'Architecture'],
  },
  {
    name: 'Michael Rodriguez',
    role: 'Head of Design',
    image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=300&h=300&fit=crop&crop=center',
    skills: ['UI/UX', 'Product', 'Research'],
  },
  {
    name: 'Emily Davis',
    role: 'Lead Developer',
    image: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=300&h=300&fit=crop&crop=center',
    skills: ['Full Stack', 'Mentoring', 'DevOps'],
  },
];

export default function AboutTeam() {
  const itemsRef = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const index = itemsRef.current.indexOf(entry.target as HTMLDivElement);
            setTimeout(() => {
              entry.target.classList.add('visible');
            }, index * 100);
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.1, rootMargin: '0px 0px -50px 0px' }
    );

    itemsRef.current.forEach((item) => {
      if (item) observer.observe(item);
    });

    return () => observer.disconnect();
  }, []);

  return (
    <section className="py-20 px-8">
      <div className="max-w-[1200px] mx-auto">
        <div className="text-center mb-16">
          <span className="inline-block bg-black text-[#888] text-[0.75rem] uppercase tracking-[0.1em] px-5 py-[0.3rem] rounded-[20px] mb-3 border border-[#2a2a2a]">
            Meet Our Team
          </span>
          <h2 className="text-white text-[2.4rem] font-normal tracking-[-0.02em] mb-2">
            Leadership <span className="text-[#888] font-light">Team</span>
          </h2>
          <p className="text-[#666] text-[1.05rem] font-light max-w-[500px] mx-auto">
            The visionaries behind Spurvancelab who drive our innovation
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {teamMembers.map((member, index) => (
            <div
              key={index}
              className="group opacity-0 translate-y-[30px] [&.visible]:opacity-100 [&.visible]:translate-y-0 transition-[0.3s_ease]"
              ref={(el) => { itemsRef.current[index] = el; }}
            >
              <div className="relative mb-5">
                <div className="w-full aspect-square rounded-2xl overflow-hidden border-2 border-[#1a1a1a] transition-all duration-300 ">
                  <img
                    src={member.image}
                    alt={member.name}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                </div>
              
              </div>
              
              <h3 className="text-white text-[1.3rem] font-semibold mb-1">
                {member.name}
              </h3>
              <p className="text-gray-500 text-[0.85rem] font-medium mb-3">
                {member.role}
              </p>
              
              <div className="flex flex-wrap gap-2 justify-center">
                {member.skills.map((skill, i) => (
                  <span key={i} className="text-[0.7rem] text-[#666] bg-[#1a1a1a] px-2 py-1 rounded-full">
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}