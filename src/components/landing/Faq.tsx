'use client';

import { useState, useEffect, useRef } from 'react';

const faqData = [
  {
    id: 1,
    number: '01',
    question: 'What services do you offer?',
    answer: 'We offer a comprehensive range of digital services including web development, mobile app development, UI/UX design, cloud solutions, AI & machine learning, cybersecurity, and data analytics. Our team specializes in creating custom solutions tailored to your specific business needs.',
  },
  {
    id: 2,
    number: '02',
    question: 'How long does a typical project take?',
    answer: 'Project timelines vary depending on complexity and scope. A simple website can take 4-6 weeks, while a complex web application or mobile app may take 3-6 months. We work with you to establish clear milestones and timelines during the planning phase.',
  },
  {
    id: 3,
    number: '03',
    question: 'What is your development process?',
    answer: 'Our development process follows six key phases: Discovery & Research, Planning & Strategy, Design & Prototyping, Development & Coding, Testing & QA, and Deployment & Launch. We use agile methodology to ensure transparency and flexibility throughout the project.',
  },
  {
    id: 4,
    number: '04',
    question: 'Do you provide ongoing support?',
    answer: 'Yes, we offer comprehensive ongoing support and maintenance packages. This includes bug fixes, security updates, performance optimization, and feature enhancements. Our support team is available 24/7 to ensure your systems run smoothly.',
  },
  {
    id: 5,
    number: '05',
    question: 'How much does it cost?',
    answer: 'Costs vary based on project requirements, complexity, and scope. We provide transparent pricing with detailed quotes after understanding your needs. We offer flexible payment plans and can work within your budget to deliver the best possible solution.',
  },
  {
    id: 6,
    number: '06',
    question: 'Can you work with our existing team?',
    answer: 'Absolutely! We collaborate seamlessly with in-house teams. Whether you need full project delivery, team augmentation, or specific expertise, we integrate with your existing workflows and tools to ensure smooth collaboration.',
  },
];

export default function Faq() {
  const [activeId, setActiveId] = useState<number | null>(1);
  const itemsRef = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const item = entry.target;
            const index = itemsRef.current.indexOf(item as HTMLDivElement);
            setTimeout(() => {
              item.classList.add('visible');
            }, index * 80);
            observer.unobserve(item);
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

  const toggleFaq = (id: number) => {
    setActiveId(activeId === id ? null : id);
  };

  // Split FAQ into two columns
  const midPoint = Math.ceil(faqData.length / 2);
  const leftColumn = faqData.slice(0, midPoint);
  const rightColumn = faqData.slice(midPoint);

  return (
    <section className="py-12 px-4 sm:py-20 sm:px-8 pb-16 sm:pb-24 overflow-hidden">
      <div className="text-center mb-14">
        <h2 className="text-white text-[2rem] sm:text-[2.4rem] md:text-[3rem] font-bold tracking-[-0.03em] mb-3">
          Frequently Asked <span className="bg-gradient-to-br from-[#f0f0f0] to-[#777] bg-clip-text text-transparent">questions</span>
        </h2>
        <p className="text-[#666] text-[0.9rem] sm:text-[1.1rem] font-light max-w-[500px] mx-auto">
          Everything you need to know about working with us
        </p>
      </div>

      <div className="max-w-[1100px] mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Left Column */}
          <div className="flex flex-col gap-4">
            {leftColumn.map((faq, index) => (
              <div
                key={faq.id}
                className={`bg-[#0a0a0a] border border-[#1a1a1a] rounded-xl overflow-hidden transition-[0.4s_cubic-bezier(0.25,0.46,0.45,0.94)] opacity-0 translate-y-5 [&.visible]:opacity-100 [&.visible]:translate-y-0 hover:border-[#1a1a1a] ${
                  activeId === faq.id ? 'border-[#2a2a2a] bg-[#111] hover:border-[#2a2a2a]' : ''
                }`}
                ref={(el) => { itemsRef.current[index] = el; }}
              >
                <div 
                  className="flex items-center gap-3 sm:gap-4 px-4 sm:px-6 py-[1rem] sm:py-[1.2rem] cursor-pointer transition-[0.3s_ease] select-none relative hover:bg-[rgba(255,255,255,0.02)]"
                  onClick={() => toggleFaq(faq.id)}
                >
                  <span className={`text-[0.65rem] sm:text-[0.7rem] font-bold tracking-[0.05em] min-w-[30px] transition-[0.3s_ease] ${
                    activeId === faq.id ? 'text-[#888]' : 'text-[#444]'
                  }`}>
                    {faq.number}
                  </span>
                  <h3 className={`text-[0.85rem] sm:text-[1rem] font-medium flex-1 transition-[0.3s_ease] m-0 ${
                    activeId === faq.id ? 'text-white' : 'text-white'
                  }`}>
                    {faq.question}
                  </h3>
                  <span className={`w-8 h-8 min-w-[32px] rounded-full bg-[#1a1a1a] border border-[#1a1a1a] flex items-center justify-center transition-[0.4s_ease] relative ${
                    activeId === faq.id ? 'bg-[#2a2a2a] border-[#2a2a2a]' : ''
                  } hover:border-[#2a2a2a]`}>
                    <span className="relative w-[14px] h-[14px] flex items-center justify-center">
                      <span className={`absolute bg-[#666] transition-[0.4s_cubic-bezier(0.25,0.46,0.45,0.94)] rounded w-[14px] h-[2px] ${
                        activeId === faq.id ? 'bg-white' : ''
                      }`}></span>
                      <span className={`absolute bg-[#666] transition-[0.4s_cubic-bezier(0.25,0.46,0.45,0.94)] rounded w-[2px] h-[14px] ${
                        activeId === faq.id ? 'bg-white scale-100' : 'scale-0'
                      }`}></span>
                    </span>
                  </span>
                </div>
                <div className={`max-h-0 overflow-hidden transition-[max-height_0.5s_cubic-bezier(0.25,0.46,0.45,0.94)] ${
                  activeId === faq.id ? 'max-h-[300px]' : ''
                }`}>
                  <p className="text-[#888] text-[0.85rem] sm:text-[0.9rem] leading-[1.8] px-4 sm:px-6 pb-4 sm:pb-6 m-0">
                    {faq.answer}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* Right Column */}
          <div className="flex flex-col gap-4">
            {rightColumn.map((faq, index) => (
              <div
                key={faq.id}
                className={`bg-[#0a0a0a] border border-[#1a1a1a] rounded-xl overflow-hidden transition-[0.4s_cubic-bezier(0.25,0.46,0.45,0.94)] opacity-0 translate-y-5 [&.visible]:opacity-100 [&.visible]:translate-y-0 hover:border-[#1a1a1a] ${
                  activeId === faq.id ? 'border-[#2a2a2a] bg-[#111] hover:border-[#2a2a2a]' : ''
                }`}
                ref={(el) => { itemsRef.current[index + midPoint] = el; }}
              >
                <div 
                  className="flex items-center gap-3 sm:gap-4 px-4 sm:px-6 py-[1rem] sm:py-[1.2rem] cursor-pointer transition-[0.3s_ease] select-none relative hover:bg-[rgba(255,255,255,0.02)]"
                  onClick={() => toggleFaq(faq.id)}
                >
                  <span className={`text-[0.65rem] sm:text-[0.7rem] font-bold tracking-[0.05em] min-w-[30px] transition-[0.3s_ease] ${
                    activeId === faq.id ? 'text-[#888]' : 'text-[#444]'
                  }`}>
                    {faq.number}
                  </span>
                  <h3 className={`text-[0.85rem] sm:text-[1rem] font-medium flex-1 transition-[0.3s_ease] m-0 ${
                    activeId === faq.id ? 'text-white' : 'text-white'
                  }`}>
                    {faq.question}
                  </h3>
                  <span className={`w-8 h-8 min-w-[32px] rounded-full bg-[#1a1a1a] border border-[#1a1a1a] flex items-center justify-center transition-[0.4s_ease] relative ${
                    activeId === faq.id ? 'bg-[#2a2a2a] border-[#2a2a2a]' : ''
                  } hover:border-[#2a2a2a]`}>
                    <span className="relative w-[14px] h-[14px] flex items-center justify-center">
                      <span className={`absolute bg-[#666] transition-[0.4s_cubic-bezier(0.25,0.46,0.45,0.94)] rounded w-[14px] h-[2px] ${
                        activeId === faq.id ? 'bg-white' : ''
                      }`}></span>
                      <span className={`absolute bg-[#666] transition-[0.4s_cubic-bezier(0.25,0.46,0.45,0.94)] rounded w-[2px] h-[14px] ${
                        activeId === faq.id ? 'bg-white scale-100' : 'scale-0'
                      }`}></span>
                    </span>
                  </span>
                </div>
                <div className={`max-h-0 overflow-hidden transition-[max-height_0.5s_cubic-bezier(0.25,0.46,0.45,0.94)] ${
                  activeId === faq.id ? 'max-h-[300px]' : ''
                }`}>
                  <p className="text-[#888] text-[0.85rem] sm:text-[0.9rem] leading-[1.8] px-4 sm:px-6 pb-4 sm:pb-6 m-0">
                    {faq.answer}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}