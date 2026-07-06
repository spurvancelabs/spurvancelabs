'use client';

import { useState, useEffect, useRef } from 'react';

const faqData = [
  {
    id: 1,
    number: '01',
    question: 'What services do you offer?',
    answer: 'We offer end-to-end custom software development services for startups, including web development, mobile app development, cloud solutions, AI software development, cybersecurity, and data analytics — all under one team.',
  },
  {
    id: 2,
    number: '02',
    question: 'How long does a typical project take?',
    answer: 'Timelines depend on scope. A focused MVP typically takes 8–12 weeks; larger projects with multiple integrations can run 4–6 months. Our custom software development process for startups includes a detailed timeline after discovery.',
  },
  {
    id: 3,
    number: '03',
    question: 'What is your development process?',
    answer: 'We follow a proven software development process for startups — discovery and research, planning and strategy, design and development, and deployment and launch — with regular check-ins along the way',
  },
  {
    id: 4,
    number: '04',
    question: 'Do you provide ongoing support?',
    answer: 'Yes. Every engagement includes our post-launch software support services, with ongoing maintenance and monitoring plans available for long-term partnerships.',
  },
  {
    id: 5,
    number: '05',
    question: 'How much does it cost?',
    answer: 'Custom software development cost for startups depends on scope, complexity, and timeline. We provide a detailed quote after understanding your specific requirements during discovery.',
  },
  {
    id: 6,
    number: '06',
    question: 'Can you work with our existing team?',
    answer: 'Yes. We regularly work as an outsourced software development team for startups, either augmenting capacity or owning specific modules such as mobile app development or cloud infrastructure.',
  },
];

export default function Faq() {
  const [activeId, setActiveId] = useState<number | null>(1);
  const [visibleIds, setVisibleIds] = useState<Set<number>>(new Set());
  const itemsRef = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    const timers: ReturnType<typeof setTimeout>[] = [];
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const id = Number(entry.target.getAttribute('data-faq-id'));
            const index = Number(entry.target.getAttribute('data-faq-index'));
            const timer = setTimeout(() => {
              setVisibleIds((prev) => {
                if (prev.has(id)) return prev;
                const next = new Set(prev);
                next.add(id);
                return next;
              });
            }, index * 80);
            timers.push(timer);
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.1, rootMargin: '0px 0px -50px 0px' }
    );

    itemsRef.current.forEach((item) => {
      if (item) observer.observe(item);
    });

    return () => {
      observer.disconnect();
      timers.forEach(clearTimeout);
    };
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
                data-faq-id={faq.id}
                data-faq-index={index}
                className={`bg-[#0a0a0a] border border-[#1a1a1a] rounded-xl overflow-hidden transition-[0.4s_cubic-bezier(0.25,0.46,0.45,0.94)] opacity-0 translate-y-5 hover:border-[#1a1a1a] ${
                  visibleIds.has(faq.id) ? 'opacity-100 translate-y-0' : ''
                } ${
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
                data-faq-id={faq.id}
                data-faq-index={index + midPoint}
                className={`bg-[#0a0a0a] border border-[#1a1a1a] rounded-xl overflow-hidden transition-[0.4s_cubic-bezier(0.25,0.46,0.45,0.94)] opacity-0 translate-y-5 hover:border-[#1a1a1a] ${
                  visibleIds.has(faq.id) ? 'opacity-100 translate-y-0' : ''
                } ${
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