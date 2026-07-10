import React from 'react';
import Image from 'next/image';

interface Props {
  searchQuery: string;
  setSearchQuery: (value: string) => void;
  onSearch: () => void;
}

function JobsHero({ searchQuery, setSearchQuery, onSearch }: Props) {
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') onSearch();
  };

  return (
    <div className="relative flex items-center justify-center overflow-hidden pt-36 pb-20 md:pt-44 md:pb-24">
      <div className="relative z-10 max-w-6xl mx-auto px-8 text-center">
        <h1 className="text-white text-5xl md:text-6xl font-bold tracking-[-0.02em] mb-6">
          Find Your <span className="text-blue-500">Dream Job</span>
        </h1>
        <p className="text-[#666] text-lg max-w-3xl mx-auto mb-12">
         Explore remote software engineer jobs in development, design, and 
        technology. We're looking for passionate individuals to join our growing team.
        </p>
        
        <div className="relative max-w-2xl mx-auto">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Search by role, skill, or location..."
            className="w-full px-6 py-4 pl-14 bg-[#1a1a1a] border border-[#4d4c4c] rounded-full text-white text-[1rem] focus:outline-none focus:border-[#2a2a2a] placeholder:text-[#676767]"
          />
          <button
            onClick={onSearch}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-[#7a7a7a] text-lg hover:text-blue-500 transition-colors cursor-pointer"
          >
            <i className="fas fa-search"></i>
          </button>
        </div>
      </div>
      
      <div className="absolute -top-20 -left-40 pointer-events-none opacity-30">
        <Image src="/leftservicelight.svg" width={492} height={500} alt="bg" />
      </div>
      <div className="absolute -bottom-20 -right-40 pointer-events-none opacity-30">
        <Image src="/rightservicelight.svg" width={492} height={500} alt="bg" />
      </div>
    </div>
  );
}

export default JobsHero;