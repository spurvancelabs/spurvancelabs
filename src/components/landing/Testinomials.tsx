'use client';

import { useEffect, useRef } from 'react';

const testimonials = [
  {
    id: 1,
    name: 'John Anderson',
    role: 'CEO, Fashion Retail',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=center',
    quote: "They didn't just build a product, they built a partnership. Their team went above and beyond to understand our needs and deliver exceptional results that transformed our business.",
    tag: 'E-Commerce',
    result: '+300% Revenue',
    large: true,
  },
  {
    id: 2,
    name: 'Sarah Chen',
    role: 'CTO, Food Delivery',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop&crop=center',
    quote: "The app they built has transformed our business. We've seen a 300% increase in orders and our customers love the experience.",
    tag: 'Mobile',
    result: '500K+ Downloads',
    large: false,
  },
  {
    id: 3,
    name: 'Mike Johnson',
    role: 'Director, MedTech',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=center',
    quote: "Working with this team has been a game-changer. They delivered a HIPAA-compliant solution that exceeded all our expectations.",
    tag: 'Healthcare',
    result: '10K+ Patients',
    large: false,
  },
  {
    id: 4,
    name: 'Emily Davis',
    role: 'VP, FinTech',
    avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop&crop=center',
    quote: "Their expertise in fintech is unmatched. They helped us modernize our banking platform and we've seen incredible results.",
    tag: 'FinTech',
    result: '1M+ Users',
    large: false,
  },
  {
    id: 5,
    name: 'David Wilson',
    role: 'CEO, SaaS',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop&crop=center',
    quote: "From concept to launch, they were with us every step of the way. Our SaaS platform now serves over 10,000 enterprise users.",
    tag: 'SaaS',
    result: '10K+ Users',
    large: false,
  },
  {
    id: 6,
    name: 'Lisa Park',
    role: 'Founder, EdTech',
    avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100&h=100&fit=crop&crop=center',
    quote: "They created an interactive learning platform that has increased student engagement by 92%. Truly transformative work.",
    tag: 'EdTech',
    result: '50K+ Students',
    large: false,
  },
  {
    id: 7,
    name: 'Robert Kim',
    role: 'CEO, Real Estate',
    avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=100&h=100&fit=crop&crop=center',
    quote: "The platform they built for us has completely transformed how we do business. Our sales have doubled and our customers love the experience. Couldn't be happier!",
    tag: 'Real Estate',
    result: '200% Sales Growth',
    large: false,
    bottomFeatured: true,
  },
];

export default function Testimonials() {
  const cardsRef = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const card = entry.target;
            const index = cardsRef.current.indexOf(card as HTMLDivElement);
            setTimeout(() => {
              card.classList.add('visible');
            }, index * 120);
            observer.unobserve(card);
          }
        });
      },
      { threshold: 0.1, rootMargin: '0px 0px -50px 0px' }
    );

    cardsRef.current.forEach((card) => {
      if (card) observer.observe(card);
    });

    return () => observer.disconnect();
  }, []);

  return (
    <section className="py-12 px-4 sm:py-20 sm:px-8 pb-16 sm:pb-24 border-t border-[#1a1a1a] overflow-hidden">
      <div className="text-center mb-10 sm:mb-14">
        <span className="inline-block text-[#888] text-[0.7rem] uppercase tracking-[0.2em] bg-[#1a1a1a] px-6 py-[0.4rem] rounded-[30px] mb-3 border border-[#2a2a2a] relative">
          Testimonials
          <span className="absolute -top-px -left-px -right-px -bottom-px rounded-[30px] bg-gradient-to-br from-transparent via-[#444] to-transparent z-[-1] opacity-30"></span>
        </span>
        <h2 className="text-white text-[2rem] sm:text-[2.4rem] md:text-[3rem] font-bold tracking-[-0.03em] mb-3">
          What our <span className="bg-gradient-to-br from-[#f0f0f0] to-[#777] bg-clip-text text-transparent">clients say</span>
        </h2>
        <p className="text-[#666] text-[0.9rem] sm:text-[1.1rem] font-light max-w-[500px] mx-auto">
          Real feedback from real people who trusted us with their vision
        </p>
      </div>

      <div className="max-w-[1200px] mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {testimonials.map((testimonial, index) => (
          <div
            key={testimonial.id}
            className={`bg-[#0a0a0a] border border-[#1a1a1a] rounded-2xl p-4 sm:p-[1.8rem] transition-[0.4s_cubic-bezier(0.25,0.46,0.45,0.94)] opacity-0 translate-y-[30px] scale-[0.95] [&.visible]:opacity-100 [&.visible]:translate-y-0 [&.visible]:scale-100 hover:border-[#2a2a2a] hover:-translate-y-1.5 hover:shadow-[0_20px_50px_rgba(0,0,0,0.5)] hover:bg-[#111] ${
              testimonial.large || testimonial.bottomFeatured ? 'md:col-span-2' : ''
            }`}
            ref={(el) => { cardsRef.current[index] = el; }}
          >
            <div className="flex flex-col gap-4 h-full">
              <div className="flex items-center gap-4">
                <div className="relative w-14 h-14 min-w-[14px] rounded-full overflow-hidden sm:w-14 sm:h-14 sm:min-w-[14px] md:w-[56px] md:h-[56px] md:min-w-[56px]">
                  <div className="absolute inset-[-3px] rounded-full bg-gradient-to-br from-[#1a1a1a] via-[#2a2a2a] to-[#1a1a1a] z-0 animate-[rotateRing_8s_linear_infinite]"></div>
                  <img 
                    src={testimonial.avatar} 
                    alt={testimonial.name} 
                    className="relative z-[1] w-full h-full object-cover rounded-full border-2 border-[#0a0a0a]"
                  />
                </div>
                <div className="testimonial-user-info">
                  <h4 className="text-white text-[0.9rem] sm:text-[1rem] font-semibold mb-[0.2rem]">{testimonial.name}</h4>
                  <span className="text-[#666] text-[0.7rem] sm:text-[0.75rem]">{testimonial.role}</span>
                  <div className="mt-[0.2rem]">
                    <i className="fas fa-star text-[#fbbf24] text-[0.7rem] mr-[1px]"></i>
                    <i className="fas fa-star text-[#fbbf24] text-[0.7rem] mr-[1px]"></i>
                    <i className="fas fa-star text-[#fbbf24] text-[0.7rem] mr-[1px]"></i>
                    <i className="fas fa-star text-[#fbbf24] text-[0.7rem] mr-[1px]"></i>
                    <i className="fas fa-star text-[#fbbf24] text-[0.7rem] mr-[1px]"></i>
                  </div>
                </div>
              </div>
              <div className="relative flex-1">
                <i className="fas fa-quote-left absolute top-[-5px] left-[-5px] text-[#1a1a1a] text-[1.2rem] opacity-50"></i>
                <p className={`text-[#c0c0c0] text-[0.85rem] sm:text-[0.9rem] leading-[1.7] pl-6 font-light m-0 ${
                  testimonial.large ? 'lg:text-[1.05rem]' : ''
                } ${testimonial.bottomFeatured ? 'md:text-[1rem]' : ''}`}>
                  {testimonial.quote}
                </p>
              </div>
              <div className="flex items-center gap-3 mt-2 flex-wrap">
                <span className="text-[#666] text-[0.6rem] uppercase tracking-[0.1em] bg-[#1a1a1a] px-3 py-[0.2rem] rounded-[20px] border border-[#1a1a1a]">
                  {testimonial.tag}
                </span>
                <span className="text-[#888] text-[0.65rem] font-medium bg-[rgba(255,255,255,0.03)] px-3 py-[0.2rem] rounded-[20px] border border-[rgba(255,255,255,0.05)] hover:text-[#aaa] hover:border-[#2a2a2a]">
                  {testimonial.result}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}