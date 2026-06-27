'use client';

import { useEffect, useRef } from 'react';

const internships = [
  {
    id: 1,
    title: 'Frontend Developer Intern',
    department: 'Engineering',
    duration: '3-6 months',
    location: 'Remote / Hybrid',
    stipend: '$1,500/month',
    skills: ['React', 'TypeScript', 'Tailwind CSS', 'Next.js'],
    description: 'Build responsive, high-performance web applications with modern frameworks. Work closely with senior developers to create exceptional user experiences.',
    icon: 'https://img.icons8.com/3d-fluency/94/web.png',
  },
  {
    id: 2,
    title: 'Backend Developer Intern',
    department: 'Engineering',
    duration: '3-6 months',
    location: 'Remote / On-site',
    stipend: '$1,800/month',
    skills: ['Node.js', 'Python', 'MongoDB', 'REST APIs'],
    description: 'Design and implement scalable server-side architectures, APIs, and database solutions for enterprise applications.',
    icon: 'https://img.icons8.com/3d-fluency/94/server.png',
  },
  {
    id: 3,
    title: 'Mobile App Intern',
    department: 'Mobile',
    duration: '4-6 months',
    location: 'Hybrid',
    stipend: '$1,600/month',
    skills: ['React Native', 'Flutter', 'iOS', 'Android'],
    description: 'Develop cross-platform mobile applications with a focus on performance, user experience, and clean code architecture.',
    icon: 'https://img.icons8.com/3d-fluency/94/smartphone.png',
  },
  {
    id: 4,
    title: 'UI/UX Design Intern',
    department: 'Design',
    duration: '3-4 months',
    location: 'Remote',
    stipend: '$1,200/month',
    skills: ['Figma', 'Adobe XD', 'User Research', 'Prototyping'],
    description: 'Create intuitive user interfaces and experiences for web and mobile applications with mentorship from senior designers.',
    icon: 'https://img.icons8.com/3d-fluency/94/paint-palette.png',
  },
  {
    id: 5,
    title: 'AI/ML Intern',
    department: 'Data Science',
    duration: '6-8 months',
    location: 'On-site',
    stipend: '$2,000/month',
    skills: ['Python', 'TensorFlow', 'PyTorch', 'Data Analysis'],
    description: 'Work on cutting-edge AI projects, from model development to deployment, with guidance from our ML team.',
    icon: 'https://img.icons8.com/3d-fluent/100/robot-6.png',
  },
  {
    id: 6,
    title: 'DevOps Intern',
    department: 'Infrastructure',
    duration: '3-6 months',
    location: 'Remote',
    stipend: '$1,700/month',
    skills: ['AWS', 'Docker', 'Kubernetes', 'CI/CD'],
    description: 'Manage cloud infrastructure, automate deployments, and ensure system reliability and scalability.',
    icon: 'https://img.icons8.com/3d-fluency/94/cloud.png',
  },
];

export default function InternshipListings() {
  const itemsRef = useRef<(HTMLDivElement | null)[]>([]);

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
        <img src={internship.icon} alt={internship.title} className="w-10 h-10 object-contain" />

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
                <button className="bg-blue-500 text-white px-5 py-2 rounded-full text-[0.85rem] font-medium cursor-pointer transition-[0.3s_ease] hover:bg-blue-600 hover:-translate-y-0.5">
                  Apply Now
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}