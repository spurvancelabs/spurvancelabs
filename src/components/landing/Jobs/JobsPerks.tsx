import React from 'react';

const perks = [
  {
    icon: 'https://img.icons8.com/3d-fluency/94/like--v4.png',
    title: 'Health & Wellness',
    items: ['Medical Insurance', 'Dental Coverage', 'Mental Health Support', 'Gym Membership'],
  },
  {
    icon: 'https://img.icons8.com/3d-fluency/94/airplane-take-off.png',
    title: 'Work-Life Balance',
    items: ['Flexible Hours', 'Unlimited PTO', 'Remote Work', 'Paid Time Off'],
  },
  {
    icon: 'https://img.icons8.com/3d-fluency/94/positive-dynamic--v1.png',
    title: 'Growth & Learning',
    items: ['Training Budget', 'Conference Tickets', 'Online Courses', 'Career Development'],
  },
  {
    icon: 'https://img.icons8.com/3d-fluency/94/cafe.png',
    title: 'Office Perks',
    items: ['Free Meals', 'Snacks & Drinks', 'Office Events', 'Gaming Lounge'],
  },
  {
    icon: 'https://img.icons8.com/3d-fluency/94/split-money.png',
    title: 'Compensation',
    items: ['Competitive Salary', 'Stock Options', 'Bonus Structure', '401k Matching'],
  },
  {
    icon: 'https://img.icons8.com/3d-fluency/94/conference-call--v2.png',
    title: 'Team Culture',
    items: ['Team Retreats', 'Hackathons', 'Open Source', 'Tech Talks'],
  },
];

export default function JobsPerks() {
  return (
    <section className="py-20 px-8 pb-24">
      <div className="max-w-[1200px] mx-auto">
        <div className="text-center mb-16">
       
          <h2 className="text-white text-[2.4rem] font-normal tracking-[-0.02em] mb-2">
            Why Work <span className="text-[#888] font-light">With Us</span>
          </h2>
          <p className="text-[#666] text-[1.05rem] font-light max-w-[500px] mx-auto">
            We offer more than just a job - we offer a lifestyle focused on your success
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {perks.map((perk, index) => (
            <div key={index} className="bg-[#0a0a0a] border border-[#1a1a1a] rounded-xl p-8 transition-[0.3s_ease] hover:border-[#2a2a2a] hover:bg-[#111] hover:-translate-y-1.5">
              <div className="w-16 h-16 rounded-xl bg-[#1a1a1a] border border-[#2a2a2a] flex items-center justify-center mb-5">
                <img src={perk.icon} alt={perk.title} className="w-10 h-10 object-contain" />
              </div>
              <h3 className="text-white text-[1.3rem] font-semibold mb-4">
                {perk.title}
              </h3>
              <ul className="list-none p-0 m-0 flex flex-col gap-2">
                {perk.items.map((item, i) => (
                  <li key={i} className="text-[#666] text-[0.9rem] flex items-center gap-2">
                    <i className="fas fa-check text-blue-500 text-[0.8rem]"></i> {item}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}