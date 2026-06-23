'use client';

const trustedCompanies = [
  { icon: 'fa-linkedin-in', name: 'LinkedIn' },
  { icon: 'fa-google', name: 'Google' },
  { icon: 'fa-twitter', name: 'Twitter' },
  { icon: 'fa-github', name: 'GitHub' },
  { icon: 'fa-apple', name: 'Apple' },
  { icon: 'fa-microsoft', name: 'Microsoft' },
];

export default function TrustedBy() {
  return (
    <section className="px-8 py-12 pb-16 max-w-[1100px] mx-auto text-center">
      <div className="mb-[0.2rem]">
        <h2 className="text-white text-[2.4rem] font-normal tracking-[-0.02em]">
          Trusted by <span className="text-[#888] font-light">industry leaders</span>
        </h2>
      </div>
      <div className="grid grid-cols-[repeat(auto-fit,minmax(130px,1fr))] gap-[1.8rem_1.2rem] mt-[2.2rem] items-center">
        {trustedCompanies.map((company) => (
          <div 
            key={company.name} 
            className="flex flex-col items-center gap-2 text-[#666] py-4 px-2 rounded-xl transition-[0.25s_ease] cursor-default border border-transparent cursor-pointer hover:border-[#2a2a2a] hover:bg-[#0a0a0a]"
          >
            <i className={`fab ${company.icon} text-[2.4rem] text-[#555] transition-colors duration-[0.25s] hover:text-[#a0a0b0]`}></i>
            <span className="text-[0.85rem] text-[#666] tracking-[0.02em] font-normal hover:text-[#ccc]">
              {company.name}
            </span>
          </div>
        ))}
      </div>
    </section>
  );
}