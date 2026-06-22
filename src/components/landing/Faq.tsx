'use client';

import { useState, useEffect, useRef } from 'react';
import './Faq.css';

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
    <section className="faq-section">
      <div className="faq-header">
        <h2>Frequently Asked <span>questions</span></h2>
        <p>Everything you need to know about working with us</p>
      </div>

      <div className="faq-container">
        <div className="faq-grid">
          <div className="faq-column">
            {leftColumn.map((faq, index) => (
              <div
                key={faq.id}
                className={`faq-item ${activeId === faq.id ? 'active' : ''}`}
                ref={(el) => { itemsRef.current[index] = el; }}
              >
                <div className="faq-question" onClick={() => toggleFaq(faq.id)}>
                  <span className="faq-number">{faq.number}</span>
                  <h3>{faq.question}</h3>
                  <span className="faq-toggle">
                    <span className="faq-toggle-icon"></span>
                  </span>
                </div>
                <div className="faq-answer">
                  <p>{faq.answer}</p>
                </div>
              </div>
            ))}
          </div>
          <div className="faq-column">
            {rightColumn.map((faq, index) => (
              <div
                key={faq.id}
                className={`faq-item ${activeId === faq.id ? 'active' : ''}`}
                ref={(el) => { itemsRef.current[index + midPoint] = el; }}
              >
                <div className="faq-question" onClick={() => toggleFaq(faq.id)}>
                  <span className="faq-number">{faq.number}</span>
                  <h3>{faq.question}</h3>
                  <span className="faq-toggle">
                    <span className="faq-toggle-icon"></span>
                  </span>
                </div>
                <div className="faq-answer">
                  <p>{faq.answer}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}