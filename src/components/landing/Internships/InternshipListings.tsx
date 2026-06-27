'use client';

import { useEffect, useRef, useState } from 'react';
import InternshipApplicationModal from './InternshipApplicationModal';

interface Internship {
  id: string;
  title: string;
  department: string;
  duration: string;
  location: string;
  stipend: string | null;
  skills: string[];
  description: string;
  icon: string | null;
}

export default function InternshipListings() {
  const [internships, setInternships] = useState<Internship[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedInternship, setSelectedInternship] = useState<Internship | null>(null);
  const [showModal, setShowModal] = useState(false);
  const itemsRef = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    fetch('/api/internships')
      .then(r => r.json())
      .then(data => {
        setInternships(data.internships || []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  useEffect(() => {
    if (!internships.length) return;

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
  }, [internships]);

  return (
    <section className="py-20 px-8 border">
      <div className="max-w-[1200px] mx-auto ">
        <div className="text-center mb-16">
          <span className="inline-block bg-black text-[#888] text-[0.75rem] uppercase tracking-[0.1em] px-5 py-[0.3rem] rounded-[20px] mb-3 border border-[#2a2a2a]">
            Available Positions
          </span>
          <h2 className="text-white text-[1.8rem] md:text-[2.4rem] font-normal tracking-[-0.02em] mb-2">
            Current <span className="text-[#888] font-light">Internships</span>
          </h2>
          <p className="text-[#666] text-[1.05rem] font-light max-w-[500px] mx-auto">
            Join our team and start building the future of technology
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {internships.map((internship, index) => (
            <div
              key={internship.id}
              className="bg-[#0a0a0a] border border-[#1a1a1a] rounded-xl p-6 transition-[0.3s_ease] opacity-0 translate-y-[30px] [&.visible]:opacity-100 [&.visible]:translate-y-0 hover:border-[#2a2a2a] hover:bg-[#111] hover:-translate-y-1.5 flex flex-col h-full"
              ref={(el) => { itemsRef.current[index] = el; }}
            >
              <div className="w-14 h-14 rounded-xl bg-[#1a1a1a] border border-[#2a2a2a] flex items-center justify-center mb-4">
        <img src={internship.icon ?? ''} alt={internship.title} className="w-10 h-10 object-contain" />

              </div>

              <h3 className="text-white text-[1.3rem] font-semibold mb-2">
                {internship.title}
              </h3>

              <span className="text-blue-500 text-[0.75rem] uppercase tracking-[0.1em] font-medium mb-3">
                {internship.department}
              </span>

              <p className="text-[#666] text-[0.9rem] leading-[1.6] mb-4 flex-1">
                {internship.description}
              </p>

              <div className="flex flex-wrap gap-2 mb-4">
                {internship.skills.map((skill, i) => (
                  <span key={i} className="text-[0.7rem] text-[#888] bg-[#1a1a1a] px-3 py-[0.2rem] rounded-full border border-[#2a2a2a]">
                    {skill}
                  </span>
                ))}
              </div>

              <div className="flex justify-between items-center text-[0.8rem] text-[#666] mb-5 pt-4 border-t border-[#1a1a1a]">
                <span><i className="fas fa-clock mr-1"></i> {internship.duration}</span>
                <span><i className="fas fa-map-marker-alt mr-1"></i> {internship.location}</span>
              </div>

              <div className="flex justify-between items-center mb-5">
                <span className="text-white font-semibold">{internship.stipend}</span>
                <button
                  onClick={() => { setSelectedInternship(internship); setShowModal(true); }}
                  className="bg-blue-500 text-white px-5 py-2 rounded-full text-[0.85rem] font-medium cursor-pointer transition-[0.3s_ease] hover:bg-blue-600 hover:-translate-y-0.5"
                >
                  Apply Now
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
      {showModal && (
        <InternshipApplicationModal
          internship={selectedInternship}
          onClose={() => { setShowModal(false); setSelectedInternship(null); }}
        />
      )}
    </section>
  );
}