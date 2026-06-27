'use client';

import { useEffect, useRef, useState } from 'react';

const products = [
  {
    id: 1,
    name: 'TaskFlow Pro',
    category: 'Productivity',
    description: 'Advanced project management and team collaboration platform with AI-powered insights and automation.',
    image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=600&h=400&fit=crop&crop=center',
    features: ['Task Management', 'Team Collaboration', 'Time Tracking', 'Analytics'],
  },
  {
    id: 2,
    name: 'CloudSync Enterprise',
    category: 'Infrastructure',
    description: 'Secure cloud storage and synchronization solution for businesses with military-grade encryption.',
    image: 'https://images.unsplash.com/photo-1548613260-8bbf6fe5c8e1?w=600&h=400&fit=crop&crop=center',
    features: ['Secure Storage', 'Auto-sync', 'File Sharing', 'Backup'],
  },
  {
    id: 3,
    name: 'DesignSystem Studio',
    category: 'Design',
    description: 'Comprehensive design toolkit with component libraries, templates, and collaboration features.',
    image: 'https://images.unsplash.com/photo-1561070791-2526d30994b5?w=600&h=400&fit=crop&crop=center',
    features: ['Component Library', 'Figma Integration', 'Templates', 'Prototyping'],
  },
  {
    id: 4,
    name: 'Analytics Pro',
    category: 'Business',
    description: 'Real-time business intelligence and data visualization platform for data-driven decisions.',
    image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=600&h=400&fit=crop&crop=center',
    features: ['Real-time Data', 'Custom Dashboards', 'Export Reports', 'Team Sharing'],
  },
  {
    id: 5,
    name: 'ChatBot Builder',
    category: 'AI',
    description: 'No-code platform for creating intelligent chatbots for customer service and automation.',
    image: 'https://images.unsplash.com/photo-1587582224793-0820d7a3d031?w=600&h=400&fit=crop&crop=center',
    features: ['No-code Builder', 'AI Responses', 'Multi-channel', 'Analytics'],
  },
  {
    id: 6,
    name: 'Security Shield',
    category: 'Cybersecurity',
    description: 'Comprehensive security monitoring and threat detection platform for modern applications.',
    image: 'https://images.unsplash.com/photo-1563013534281-512a7a0b1e32?w=600&h=400&fit=crop&crop=center',
    features: ['Threat Detection', 'Vulnerability Scan', 'Real-time Alerts', 'Compliance'],
  },
];

const categories = ['All', 'Productivity', 'Infrastructure', 'Design', 'Business', 'AI', 'Cybersecurity'];

export default function ProductListings() {
  const [activeCategory, setActiveCategory] = useState('All');
  const itemsRef = useRef<(HTMLDivElement | null)[]>([]);

  const filteredProducts = activeCategory === 'All'
    ? products
    : products.filter(product => product.category === activeCategory);

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
            Product Catalog
          </span>
          <h2 className="text-white text-[1.8rem] md:text-[2.4rem] font-normal tracking-[-0.02em] mb-2">
            Our <span className="text-[#888] font-light">Solutions</span>
          </h2>
          <p className="text-[#666] text-[1.05rem] font-light max-w-[500px] mx-auto">
            Powerful tools designed to solve your business challenges
          </p>
        </div>

        <div className="flex flex-wrap justify-center gap-3 mb-12">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setActiveCategory(category)}
              className={`px-5 py-2 rounded-full text-[0.85rem] font-medium transition-[0.3s_ease] cursor-pointer ${
                activeCategory === category
                  ? 'bg-blue-500 text-white'
                  : 'bg-[#1a1a1a] text-[#888] hover:bg-[#2a2a2a] hover:text-white'
              }`}
            >
              {category}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredProducts.map((product, index) => (
            <div
              key={product.id}
              className="bg-[#0a0a0a] border border-[#1a1a1a] rounded-xl overflow-hidden transition-[0.3s_ease] opacity-0 translate-y-[30px] [&.visible]:opacity-100 [&.visible]:translate-y-0 hover:border-[#2a2a2a] hover:-translate-y-2 flex flex-col h-full"
              ref={(el) => { itemsRef.current[index] = el; }}
            >
              <div className="relative h-48 overflow-hidden">
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-full h-full object-cover transition-transform duration-500 hover:scale-110"
                />
              
              </div>

              <div className="p-6 flex flex-col flex-1">
                <span className="text-gray-500 text-[0.7rem] uppercase tracking-[0.1em] font-medium mb-2">
                  {product.category}
                </span>

                <h3 className="text-white text-[1.4rem] font-semibold mb-3">
                  {product.name}
                </h3>

                <p className="text-[#666] text-[0.9rem] leading-[1.6] mb-4 flex-1">
                  {product.description}
                </p>

                <div className="flex flex-wrap gap-2 mb-4">
                  {product.features.slice(0, 3).map((feature, i) => (
                    <span key={i} className="text-[0.75rem] text-[#888] bg-[#1a1a1a] px-3 py-[0.2rem] rounded-full border border-[#2a2a2a]">
                      {feature}
                    </span>
                  ))}
                </div>

                <div className="flex justify-between items-center pt-4 border-t border-[#1a1a1a]">
                  <button className=" text-white px-5 py-2 rounded-full text-[0.85rem] font-medium cursor-pointer transition-[0.3s_ease] hover:bg-blue-600 hover:-translate-y-0.5">
                    Learn More
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}