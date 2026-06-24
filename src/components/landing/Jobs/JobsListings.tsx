'use client';

import { useEffect, useRef, useState } from 'react';

const jobOpenings = [
  {
    id: 1,
    title: 'Senior Frontend Engineer',
    department: 'Engineering',
    type: 'Full-time',
    location: 'Remote / Hybrid',
    salary: '$120k - $160k',
    skills: ['React', 'TypeScript', 'Next.js', 'GraphQL'],
    description: 'Lead frontend development for enterprise applications. Mentor junior developers and drive technical decisions.',
    icon: 'fa-laptop-code',
    urgent: true,
  },
  {
    id: 2,
    title: 'Backend Engineer',
    department: 'Engineering',
    type: 'Full-time',
    location: 'On-site',
    salary: '$110k - $150k',
    skills: ['Node.js', 'Python', 'AWS', 'Microservices'],
    description: 'Build scalable backend systems and APIs. Work with modern cloud technologies and distributed systems.',
    icon: 'fa-server',
  },
  {
    id: 3,
    title: 'Full Stack Developer',
    department: 'Engineering',
    type: 'Full-time',
    location: 'Remote',
    salary: '$100k - $140k',
    skills: ['React', 'Node.js', 'MongoDB', 'Docker'],
    description: 'Work across the entire stack to deliver end-to-end solutions. Collaborate with cross-functional teams.',
    icon: 'fa-code',
    urgent: true,
  },
  {
    id: 4,
    title: 'Product Designer',
    department: 'Design',
    type: 'Full-time',
    location: 'Hybrid',
    salary: '$90k - $130k',
    skills: ['Figma', 'UI/UX', 'Prototyping', 'User Research'],
    description: 'Design beautiful and intuitive user experiences for web and mobile applications.',
    icon: 'fa-palette',
  },
  {
    id: 5,
    title: 'DevOps Engineer',
    department: 'Infrastructure',
    type: 'Full-time',
    location: 'Remote / On-site',
    salary: '$115k - $155k',
    skills: ['Kubernetes', 'AWS', 'CI/CD', 'Terraform'],
    description: 'Manage infrastructure, automate deployments, and ensure system reliability at scale.',
    icon: 'fa-cloud',
  },
  {
    id: 6,
    title: 'AI/ML Engineer',
    department: 'Data Science',
    type: 'Full-time',
    location: 'On-site',
    salary: '$130k - $180k',
    skills: ['Python', 'TensorFlow', 'PyTorch', 'MLOps'],
    description: 'Build and deploy machine learning models. Research and implement AI solutions for clients.',
    icon: 'fa-brain',
  },
  {
    id: 7,
    title: 'QA Automation Engineer',
    department: 'Quality',
    type: 'Full-time',
    location: 'Remote',
    salary: '$95k - $125k',
    skills: ['Selenium', 'Jest', 'Cypress', 'Test Automation'],
    description: 'Design and implement automated testing solutions to ensure product quality.',
    icon: 'fa-bug',
  },
  {
    id: 8,
    title: 'Technical Lead',
    department: 'Engineering',
    type: 'Full-time',
    location: 'Hybrid',
    salary: '$150k - $200k',
    skills: ['Architecture', 'Leadership', 'Full Stack', 'Mentoring'],
    description: 'Lead technical projects and guide teams through architecture and development decisions.',
    icon: 'fa-users-cog',
    urgent: true,
  },
  {
    id: 9,
    title: 'Mobile Developer',
    department: 'Mobile',
    type: 'Full-time',
    location: 'Remote',
    salary: '$105k - $145k',
    skills: ['React Native', 'Flutter', 'iOS', 'Android'],
    description: 'Build cross-platform mobile applications with native performance and user experience.',
    icon: 'fa-mobile-alt',
  },
];

const departments = ['All', 'Engineering', 'Design', 'Infrastructure', 'Data Science', 'Mobile', 'Quality'];

export default function JobsListings() {
  const [activeDepartment, setActiveDepartment] = useState('All');
  const itemsRef = useRef<(HTMLDivElement | null)[]>([]);

  const filteredJobs = activeDepartment === 'All' 
    ? jobOpenings 
    : jobOpenings.filter(job => job.department === activeDepartment);

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
            Open Positions
          </span>
          <h2 className="text-white text-[2.4rem] font-normal tracking-[-0.02em] mb-2">
            Available <span className="text-[#888] font-light">Jobs</span>
          </h2>
          <p className="text-[#666] text-[1.05rem] font-light max-w-[500px] mx-auto">
            Find the perfect role that matches your skills and passion
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

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredJobs.map((job, index) => (
            <div
              key={job.id}
              className="bg-[#0a0a0a] border border-[#1a1a1a] rounded-xl p-6 transition-[0.3s_ease] opacity-0 translate-y-[30px] [&.visible]:opacity-100 [&.visible]:translate-y-0 hover:border-[#2a2a2a] hover:bg-[#111] hover:-translate-y-1.5 flex flex-col h-full"
              ref={(el) => { itemsRef.current[index] = el; }}
            >
              <div className="flex justify-between items-start mb-4">
                <div className="w-14 h-14 rounded-xl bg-[#1a1a1a] border border-[#2a2a2a] flex items-center justify-center">
                  <i className={`fas ${job.icon} text-2xl text-blue-500`}></i>
                </div>
                {job.urgent && (
                  <span className="text-[0.65rem] text-orange-400 uppercase tracking-[0.1em] font-semibold bg-orange-400/10 px-2 py-1 rounded-full">
                    Urgent
                  </span>
                )}
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
                <button className="bg-blue-500 text-white px-5 py-2 rounded-full text-[0.85rem] font-medium cursor-pointer transition-[0.3s_ease] hover:bg-blue-600">
                  Apply
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}