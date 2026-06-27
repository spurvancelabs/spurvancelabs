import Image from 'next/image';
import React from 'react';

const values = [
  {
    icon: 'https://img.icons8.com/emoji/48/light-bulb-emoji.png',
    title: 'Innovation',
    description: 'We push boundaries and embrace new technologies to create cutting-edge solutions.',
  },
  {
    icon: 'https://img.icons8.com/3d-fluency/94/conference.png',
    title: 'Collaboration',
    description: 'We believe in the power of teamwork and open communication to achieve great results.',
  },
  {
    icon: 'https://img.icons8.com/3d-fluency/94/lock-1.png',
    title: 'Integrity',
    description: 'We maintain the highest ethical standards in all our work and interactions.',
  },
  {
    icon: 'https://img.icons8.com/3d-fluency/94/like--v4.png',
    title: 'Passion',
    description: 'We are passionate about technology and dedicated to delivering exceptional work.',
  },
  {
    icon: 'https://img.icons8.com/3d-fluency/94/positive-dynamic--v2.png',
    title: 'Growth',
    description: 'We continuously learn, improve, and help our clients grow their businesses.',
  },
  {
    icon: 'https://img.icons8.com/3d-fluent/100/shield-37.png',
    title: 'Trust',
    description: 'We build lasting relationships based on transparency and trust with our clients.',
  },
];

export default function AboutValues() {
  return (
    <section className="py-20 px-8 pb-24">
      <div className="max-w-[1200px] mx-auto">
        <div className="text-center mb-16">
          <span className="inline-block bg-black text-[#888] text-[0.75rem] uppercase tracking-[0.1em] px-5 py-[0.3rem] rounded-[20px] mb-3 border border-[#2a2a2a]">
            Our Core Values
          </span>
          <h2 className="text-white text-[2.4rem] font-normal tracking-[-0.02em] mb-2">
            What We <span className="text-[#888] font-light">Stand For</span>
          </h2>
          <p className="text-[#666] text-[1.05rem] font-light max-w-[500px] mx-auto">
            Our values drive everything we do, from code to client relationships
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {values.map((value, index) => (
            <div key={index} className="bg-[#0a0a0a] border border-[#1a1a1a] rounded-xl p-8 transition-[0.3s_ease] hover:border-[#2a2a2a] hover:bg-[#111] hover:-translate-y-1.5 flex flex-col items-center text-center">
              <div className="w-16 h-16 rounded-full  to-purple-600 flex items-center justify-center mb-5 overflow-hidden">
                <img src={value.icon} alt={value.title} className="w-10 h-10 object-contain" />
              </div>
              <h3 className="text-white text-[1.3rem] font-semibold mb-3">
                {value.title}
              </h3>
              <p className="text-[#666] text-[0.9rem] leading-[1.6]">
                {value.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}