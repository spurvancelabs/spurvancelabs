'use client';

export default function TechStack() {
  return (
    <section className="flex flex-col items-center justify-center bg-transparent px-4 sm:px-5 pb-10 sm:pb-[60px] pt-8 sm:pt-10 rounded-[40px] relative overflow-hidden">
      <div className="relative flex flex-col items-center">
        {/* SVG with flowing gradients */}
        <svg 
          className="block mb-[-36px] relative z-[2] w-[800px] max-w-full" 
          viewBox="0 0 800 530" 
          fill="none" 
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            <linearGradient id="chipGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#27272a" />
              <stop offset="45%" stopColor="#111118" />
              <stop offset="100%" stopColor="#050508" />
            </linearGradient>
            <filter id="chipGlow" x="-35%" y="-35%" width="170%" height="170%">
              <feGaussianBlur stdDeviation="8" result="glow"/>
              <feColorMatrix in="glow" type="matrix" values="0 0 0 0 0.66  0 0 0 0 0.33  0 0 0 0 0.97  0 0 0 0.35 0"/>
              <feMerge>
                <feMergeNode/>
                <feMergeNode in="SourceGraphic"/>
              </feMerge>
            </filter>
            <radialGradient id="ambientGlow" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#a855f7" stopOpacity="0.08" />
              <stop offset="60%" stopColor="#00dfd8" stopOpacity="0.03" />
              <stop offset="100%" stopColor="#000000" stopOpacity="0" />
            </radialGradient>
            <linearGradient id="textGrad" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#ffffff" />
              <stop offset="100%" stopColor="#d4d4d8" />
            </linearGradient>
            <linearGradient id="cyberMix1" gradientUnits="userSpaceOnUse" x1="0" y1="530" x2="0" y2="0">
              <stop offset="0%" stopColor="#00dfd8" stopOpacity="0" />
              <stop offset="30%" stopColor="#00dfd8" stopOpacity="1" />
              <stop offset="75%" stopColor="#a855f7" stopOpacity="1" />
              <stop offset="100%" stopColor="#ffffff" stopOpacity="1" />
            </linearGradient>
            <linearGradient id="cyberMix2" gradientUnits="userSpaceOnUse" x1="0" y1="530" x2="0" y2="0">
              <stop offset="0%" stopColor="#ff4d4d" stopOpacity="0" />
              <stop offset="35%" stopColor="#ff4d4d" stopOpacity="1" />
              <stop offset="70%" stopColor="#f59e0b" stopOpacity="1" />
              <stop offset="100%" stopColor="#ffffff" stopOpacity="1" />
            </linearGradient>
            <linearGradient id="cyberMix3" gradientUnits="userSpaceOnUse" x1="0" y1="530" x2="0" y2="0">
              <stop offset="0%" stopColor="#c084fc" stopOpacity="0" />
              <stop offset="40%" stopColor="#a855f7" stopOpacity="1" />
              <stop offset="80%" stopColor="#fbbf24" stopOpacity="1" />
              <stop offset="100%" stopColor="#00dfd8" stopOpacity="1" />
            </linearGradient>
            <filter id="hyperNeonGlow" x="-50%" y="-50%" width="200%" height="200%">
              <feGaussianBlur stdDeviation="6" result="ambientBlur"/>
              <feGaussianBlur stdDeviation="2" result="sharpBlur"/>
              <feMerge>
                <feMergeNode in="ambientBlur"/>
                <feMergeNode in="sharpBlur"/>
                <feMergeNode in="SourceGraphic"/>
              </feMerge>
            </filter>
          </defs>
          
          <circle cx="400" cy="250" r="220" fill="url(#ambientGlow)" />
          
          {/* Static circuit lines */}
          <path className="stroke-[#16161a] stroke-2 [stroke-linecap:round] [stroke-linejoin:round] fill-none" pathLength="1000" d="M 145,530 L 30,530 L 30,238 L 300,238" />
          <path className="stroke-[#16161a] stroke-2 [stroke-linecap:round] [stroke-linejoin:round] fill-none" pathLength="1000" d="M 15,530 L 15,248 L 300,248" />
          <path className="stroke-[#16161a] stroke-2 [stroke-linecap:round] [stroke-linejoin:round] fill-none" pathLength="1000" d="M 50,530 L 50,258 L 300,258" />
          <path className="stroke-[#16161a] stroke-2 [stroke-linecap:round] [stroke-linejoin:round] fill-none" pathLength="1000" d="M 655,530 L 770,530 L 770,238 L 500,238" />
          <path className="stroke-[#16161a] stroke-2 [stroke-linecap:round] [stroke-linejoin:round] fill-none" pathLength="1000" d="M 785,530 L 785,248 L 500,248" />
          <path className="stroke-[#16161a] stroke-2 [stroke-linecap:round] [stroke-linejoin:round] fill-none" pathLength="1000" d="M 750,530 L 750,258 L 500,258" />
          <path className="stroke-[#16161a] stroke-2 [stroke-linecap:round] [stroke-linejoin:round] fill-none" pathLength="1000" d="M 128,494 L 128,30 L 382,30 L 382,200" />
          <path className="stroke-[#16161a] stroke-2 [stroke-linecap:round] [stroke-linejoin:round] fill-none" pathLength="1000" d="M 400,494 L 400,490 L 430,490 L 430,10 L 400,10 L 400,200" />
          <path className="stroke-[#16161a] stroke-2 [stroke-linecap:round] [stroke-linejoin:round] fill-none" pathLength="1000" d="M 672,494 L 672,30 L 414,30 L 414,200" />
          <path className="stroke-[#16161a] stroke-2 [stroke-linecap:round] [stroke-linejoin:round] fill-none" pathLength="1000" d="M 128,494 L 128,450 L 379,450 L 379,300" />
          <path className="stroke-[#16161a] stroke-2 [stroke-linecap:round] [stroke-linejoin:round] fill-none" pathLength="1000" d="M 400,494 L 400,300" />
          <path className="stroke-[#16161a] stroke-2 [stroke-linecap:round] [stroke-linejoin:round] fill-none" pathLength="1000" d="M 672,494 L 672,450 L 411,450 L 411,300" />
          
          {/* Flowing gradient lines with animation classes */}
          <path 
            pathLength="1000" 
            className="tech-flowing-gradient-line tech-flow-left-top" 
            filter="url(#hyperNeonGlow)" 
            d="M 145,530 L 30,530 L 30,238 L 300,238" 
          />
          <path 
            pathLength="1000" 
            className="tech-flowing-gradient-line tech-flow-left-mid" 
            filter="url(#hyperNeonGlow)" 
            d="M 15,530 L 15,248 L 300,248" 
          />
          <path 
            pathLength="1000" 
            className="tech-flowing-gradient-line tech-flow-left-bot" 
            filter="url(#hyperNeonGlow)" 
            d="M 50,530 L 50,258 L 300,258" 
          />
          <path 
            pathLength="1000" 
            className="tech-flowing-gradient-line tech-flow-right-top" 
            filter="url(#hyperNeonGlow)" 
            d="M 655,530 L 770,530 L 770,238 L 500,238" 
          />
          <path 
            pathLength="1000" 
            className="tech-flowing-gradient-line tech-flow-right-mid" 
            filter="url(#hyperNeonGlow)" 
            d="M 785,530 L 785,248 L 500,248" 
          />
          <path 
            pathLength="1000" 
            className="tech-flowing-gradient-line tech-flow-right-bot" 
            filter="url(#hyperNeonGlow)" 
            d="M 750,530 L 750,258 L 500,258" 
          />
          <path 
            pathLength="1000" 
            className="tech-flowing-gradient-line tech-flow-top-left" 
            filter="url(#hyperNeonGlow)" 
            d="M 128,494 L 128,30 L 382,30 L 382,200" 
          />
          <path 
            pathLength="1000" 
            className="tech-flowing-gradient-line tech-flow-top-mid" 
            filter="url(#hyperNeonGlow)" 
            d="M 400,494 L 400,490 L 430,490 L 430,10 L 400,10 L 400,200" 
          />
          <path 
            pathLength="1000" 
            className="tech-flowing-gradient-line tech-flow-top-right" 
            filter="url(#hyperNeonGlow)" 
            d="M 672,494 L 672,30 L 414,30 L 414,200" 
          />
          <path 
            pathLength="1000" 
            className="tech-flowing-gradient-line tech-flow-card-left" 
            filter="url(#hyperNeonGlow)" 
            d="M 128,494 L 128,450 L 379,450 L 379,300" 
          />
          <path 
            pathLength="1000" 
            className="tech-flowing-gradient-line tech-flow-card-center" 
            filter="url(#hyperNeonGlow)" 
            d="M 400,494 L 400,300" 
          />
          <path 
            pathLength="1000" 
            className="tech-flowing-gradient-line tech-flow-card-right" 
            filter="url(#hyperNeonGlow)" 
            d="M 672,494 L 672,450 L 411,450 L 411,300" 
          />
          
          {/* Chip rectangle */}
          <rect x="300" y="200" width="200" height="100" rx="6" fill="url(#chipGrad)" stroke="rgba(168, 85, 247, 0.55)" strokeWidth="1.5" filter="url(#chipGlow)" />
          
          {/* Text */}
          <text x="400" y="254" dominantBaseline="middle" textAnchor="middle" fill="url(#textGrad)" fontFamily="system-ui, sans-serif" fontWeight="700" fontSize="25" letterSpacing="-0.02em">Spurvancelab</text>
        </svg>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full relative z-[5]">
          <div className="bg-[rgba(9,9,11,0.6)] border border-[rgba(39,39,42,0.6)] rounded-[18px] p-5 sm:p-[28px_24px] flex flex-col gap-3 sm:gap-4 backdrop-blur-[24px] [-webkit-backdrop-filter:blur(24px)] transition-all duration-[0.4s] ease-[cubic-bezier(0.16,1,0.3,1)] relative shadow-[0_4px_30px_rgba(0,0,0,0.4)] hover:-translate-y-1.5 hover:border-[rgba(168,85,247,0.4)] hover:bg-[rgba(14,14,18,0.85)] hover:shadow-[0_30px_60px_rgba(0,0,0,0.9),_0_0_40px_rgba(168,85,247,0.05)]">
            <div className="text-[1.3rem] sm:text-[1.6rem] w-10 h-10 sm:w-12 sm:h-12 flex items-center justify-center rounded-[14px] bg-[#0b0b0e] border border-[rgba(39,39,42,0.7)] shadow-[inset_0_1px_0_rgba(255,255,255,0.03)]">
              ⚛️
            </div>
            <div>
              <h3 className="m-0 mb-2 text-[1.2rem] font-semibold text-[#f4f4f5] tracking-[-0.02em]">
                React
              </h3>
              <p className="m-0 text-[0.9rem] text-[#a1a1aa] leading-[1.6] font-normal">
We build fast, interactive user interfaces using React — the same library 
trusted by companies at massive scale, giving your product a stable, well-supported 
foundation.              </p>
            </div>
          </div>

          <div className="bg-[rgba(9,9,11,0.6)] border border-[rgba(39,39,42,0.6)] rounded-[18px] p-5 sm:p-[28px_24px] flex flex-col gap-3 sm:gap-4 backdrop-blur-[24px] [-webkit-backdrop-filter:blur(24px)] transition-all duration-[0.4s] ease-[cubic-bezier(0.16,1,0.3,1)] relative shadow-[0_4px_30px_rgba(0,0,0,0.4)] hover:-translate-y-1.5 hover:border-[rgba(168,85,247,0.4)] hover:bg-[rgba(14,14,18,0.85)] hover:shadow-[0_30px_60px_rgba(0,0,0,0.9),_0_0_40px_rgba(168,85,247,0.05)]">
            <div className="text-[1.3rem] sm:text-[1.6rem] w-10 h-10 sm:w-12 sm:h-12 flex items-center justify-center rounded-[14px] bg-[#0b0b0e] border border-[rgba(39,39,42,0.7)] shadow-[inset_0_1px_0_rgba(255,255,255,0.03)]">
              📦
            </div>
            <div>
              <h3 className="m-0 mb-2 text-[1.2rem] font-semibold text-[#f4f4f5] tracking-[-0.02em]">
                Turbopack
              </h3>
              <p className="m-0 text-[0.9rem] text-[#a1a1aa] leading-[1.6] font-normal">
Our builds run on Turbopack, a next-generation bundler that keeps 
development and deployment fast even as your codebase grows.              </p>
            </div>
          </div>

          <div className="bg-[rgba(9,9,11,0.6)] border border-[rgba(39,39,42,0.6)] rounded-[18px] p-5 sm:p-[28px_24px] flex flex-col gap-3 sm:gap-4 backdrop-blur-[24px] [-webkit-backdrop-filter:blur(24px)] transition-all duration-[0.4s] ease-[cubic-bezier(0.16,1,0.3,1)] relative shadow-[0_4px_30px_rgba(0,0,0,0.4)] hover:-translate-y-1.5 hover:border-[rgba(168,85,247,0.4)] hover:bg-[rgba(14,14,18,0.85)] hover:shadow-[0_30px_60px_rgba(0,0,0,0.9),_0_0_40px_rgba(168,85,247,0.05)]">
            <div className="text-[1.3rem] sm:text-[1.6rem] w-10 h-10 sm:w-12 sm:h-12 flex items-center justify-center rounded-[14px] bg-[#0b0b0e] border border-[rgba(39,39,42,0.7)] shadow-[inset_0_1px_0_rgba(255,255,255,0.03)]">
              ⚡
            </div>
            <div>
              <h3 className="m-0 mb-2 text-[1.2rem] font-semibold text-[#f4f4f5] tracking-[-0.02em]">
                Speedy Web Compiler
              </h3>
              <p className="m-0 text-[0.9rem] text-[#a1a1aa] leading-[1.6] font-normal">
We compile with SWC, a Rust-based toolchain that speeds up builds 
significantly compared to older JavaScript tooling — meaning faster iteration for 
your project.              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}