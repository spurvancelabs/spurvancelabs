'use client';

import { useEffect, useRef, useState } from 'react';
import JobApplicationModal from './JobApplicationModal';

interface Job {
  id: string;
  title: string;
  department: string;
  type: string;
  location: string;
  salary: string | null;
  skills: string[];
  description: string;
  icon: string | null;
}

const departments = ['All', 'Engineering', 'Design', 'Infrastructure', 'Data Science', 'Mobile', 'Quality'];

interface Props {
  searchQuery: string;
}

export default function JobsListings({ searchQuery }: Props) {
  const [activeDepartment, setActiveDepartment] = useState('All');
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedJob, setSelectedJob] = useState<Job | null>(null);
  const [showModal, setShowModal] = useState(false);
  const itemsRef = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    fetch('/api/jobs')
      .then(r => r.json())
      .then(data => {
        setJobs(data.jobs || []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const searched = searchQuery.trim().toLowerCase();
  const filteredJobs = (activeDepartment === 'All' 
    ? jobs 
    : jobs.filter(job => job.department === activeDepartment)
  ).filter(job =>
    !searched ||
    job.title.toLowerCase().includes(searched) ||
    job.skills.some(s => s.toLowerCase().includes(searched)) ||
    job.location.toLowerCase().includes(searched) ||
    job.description.toLowerCase().includes(searched)
  );

  useEffect(() => {
    if (!filteredJobs.length) return;

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
  }, [filteredJobs]);

  return (
    <section className="py-20 px-8">
      <div className="max-w-[1200px] mx-auto">
        <div className="text-center mb-16">
     
          <h2 className="text-white text-[1.8rem] md:text-[2.4rem] font-normal tracking-[-0.02em] mb-2">
            Available <span className="text-[#888] font-light">Jobs</span>
          </h2>
          <p className="text-[#666] text-[1.05rem] font-light max-w-[500px] mx-auto">
            Find the perfect software developer job that matches your skills and passion
          </p>
        </div>

        <div className="flex flex-wrap justify-center gap-3 mb-12">
          {departments.map((dept) => (
            <button
              key={dept}
              onClick={() => setActiveDepartment(dept)}
              className={`px-5 py-2 rounded-full text-[0.85rem] font-medium transition-[0.3s_ease] cursor-pointer ${
                activeDepartment === dept
                  ? 'bg-blue-500 text-white'
                  : 'bg-[#1a1a1a] text-[#888] hover:bg-[#2a2a2a] hover:text-white'
              }`}
            >
              {dept}
            </button>
          ))}
        </div>

        {loading ? (
          <div className="flex justify-center items-center py-20">
            <div className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
          </div>
        ) : filteredJobs.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredJobs.map((job, index) => (
              <div
                key={job.id}
                className="bg-[#0a0a0a] border border-[#1a1a1a] rounded-xl p-6 transition-[0.3s_ease] opacity-0 translate-y-[30px] [&.visible]:opacity-100 [&.visible]:translate-y-0 hover:border-[#2a2a2a] hover:bg-[#111] hover:-translate-y-1.5 flex flex-col h-full"
                ref={(el) => { itemsRef.current[index] = el; }}
              >
                <div className="flex justify-between items-start mb-4">
                  <div className="w-14 h-14 rounded-xl bg-[#1a1a1a] border border-[#2a2a2a] flex items-center justify-center">
        <img src={job.icon ?? ''} alt={job.title} className="w-10 h-10 object-contain" />

                  </div>
                </div>

                <h3 className="text-white text-[1.3rem] font-semibold mb-2">
                  {job.title}
                </h3>

                <span className="text-blue-500 text-[0.75rem] uppercase tracking-[0.1em] font-medium mb-3">
                  {job.type} • {job.location}
                </span>

                <p className="text-[#666] text-[0.9rem] leading-[1.6] mb-4 flex-1">
                  {job.description}
                </p>

                <div className="flex flex-wrap gap-2 mb-4">
                  {job.skills.map((skill, i) => (
                    <span key={i} className="text-[0.7rem] text-[#888] bg-[#1a1a1a] px-3 py-[0.2rem] rounded-full border border-[#2a2a2a]">
                      {skill}
                    </span>
                  ))}
                </div>

                <div className="flex justify-between items-center pt-4 border-t border-[#1a1a1a]">
                  <span className="text-white font-semibold">{job.salary}</span>
                  <button
                    onClick={() => { setSelectedJob(job); setShowModal(true); }}
                    className="bg-blue-500 text-white px-5 py-2 rounded-full text-[0.85rem] font-medium cursor-pointer transition-[0.3s_ease] hover:bg-blue-600"
                  >
                    Apply
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-20">
            <p className="text-[#888] text-[1.1rem] font-light">
              No open positions in this category right now — check back soon, or submit a general application.
            </p>
          </div>
        )}
      </div>
      {showModal && (
        <JobApplicationModal
          job={selectedJob}
          onClose={() => { setShowModal(false); setSelectedJob(null); }}
        />
      )}
    </section>
  );
}