'use client';

import { useEffect, useRef } from 'react';
import './Testinomials.css';

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
    <section className="testimonial-section">
      <div className="testimonial-header">
        <span className="testimonial-badge">Testimonials</span>
        <h2>What our <span>clients say</span></h2>
        <p>Real feedback from real people who trusted us with their vision</p>
      </div>

      <div className="testimonial-grid">
        {testimonials.map((testimonial, index) => (
          <div
            key={testimonial.id}
            className={`testimonial-card ${testimonial.large ? 'large' : ''} ${testimonial.bottomFeatured ? 'bottom-featured' : ''}`}
            ref={(el) => { cardsRef.current[index] = el; }}
          >
            <div className="testimonial-card-inner">
              <div className="testimonial-card-header">
                <div className="testimonial-avatar-wrapper">
                  <div className="testimonial-avatar-ring"></div>
                  <img src={testimonial.avatar} alt={testimonial.name} />
                </div>
                <div className="testimonial-user-info">
                  <h4>{testimonial.name}</h4>
                  <span>{testimonial.role}</span>
                  <div className="testimonial-stars">
                    <i className="fas fa-star"></i>
                    <i className="fas fa-star"></i>
                    <i className="fas fa-star"></i>
                    <i className="fas fa-star"></i>
                    <i className="fas fa-star"></i>
                  </div>
                </div>
              </div>
              <div className="testimonial-card-body">
                <i className="fas fa-quote-left testimonial-quote-icon"></i>
                <p>{testimonial.quote}</p>
              </div>
              <div className="testimonial-card-footer">
                <span className="testimonial-tag">{testimonial.tag}</span>
                <span className="testimonial-result">{testimonial.result}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}