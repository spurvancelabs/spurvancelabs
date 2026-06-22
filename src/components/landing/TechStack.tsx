'use client';

import './TechStack.css';

export default function TechStack() {
  return (
    <section className="tech-section">
      <div className="tech-animation-container">
        <svg className="tech-unified-circuit-svg" viewBox="0 0 800 530" fill="none" width="800px" xmlns="http://www.w3.org/2000/svg">
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
          <path id="L_top" className="tech-circuit-line" pathLength="1000" d="M 145,530 L 30,530 L 30,238 L 300,238" />
          <path id="L_mid" className="tech-circuit-line" pathLength="1000" d="M 15,530 L 15,248 L 300,248" />
          <path id="L_bot" className="tech-circuit-line" pathLength="1000" d="M 50,530 L 50,258 L 300,258" />
          <path id="R_top" className="tech-circuit-line" pathLength="1000" d="M 655,530 L 770,530 L 770,238 L 500,238" />
          <path id="R_mid" className="tech-circuit-line" pathLength="1000" d="M 785,530 L 785,248 L 500,248" />
          <path id="R_bot" className="tech-circuit-line" pathLength="1000" d="M 750,530 L 750,258 L 500,258" />
          <path id="T_left" className="tech-circuit-line" pathLength="1000" d="M 128,494 L 128,30 L 382,30 L 382,200" />
          <path id="T_mid" className="tech-circuit-line" pathLength="1000" d="M 400,494 L 400,490 L 430,490 L 430,10 L 400,10 L 400,200" />
          <path id="T_right" className="tech-circuit-line" pathLength="1000" d="M 672,494 L 672,30 L 414,30 L 414,200" />
          <path id="Card_Left" className="tech-circuit-line" pathLength="1000" d="M 128,494 L 128,450 L 379,450 L 379,300" />
          <path id="Card_Center" className="tech-circuit-line" pathLength="1000" d="M 400,494 L 400,300" />
          <path id="Card_Right" className="tech-circuit-line" pathLength="1000" d="M 672,494 L 672,450 L 411,450 L 411,300" />
          
          <path pathLength="1000" className="tech-flowing-gradient-line tech-flow-left-top" filter="url(#hyperNeonGlow)" d="M 145,530 L 30,530 L 30,238 L 300,238" />
          <path pathLength="1000" className="tech-flowing-gradient-line tech-flow-left-mid" filter="url(#hyperNeonGlow)" d="M 15,530 L 15,248 L 300,248" />
          <path pathLength="1000" className="tech-flowing-gradient-line tech-flow-left-bot" filter="url(#hyperNeonGlow)" d="M 50,530 L 50,258 L 300,258" />
          <path pathLength="1000" className="tech-flowing-gradient-line tech-flow-right-top" filter="url(#hyperNeonGlow)" d="M 655,530 L 770,530 L 770,238 L 500,238" />
          <path pathLength="1000" className="tech-flowing-gradient-line tech-flow-right-mid" filter="url(#hyperNeonGlow)" d="M 785,530 L 785,248 L 500,248" />
          <path pathLength="1000" className="tech-flowing-gradient-line tech-flow-right-bot" filter="url(#hyperNeonGlow)" d="M 750,530 L 750,258 L 500,258" />
          <path pathLength="1000" className="tech-flowing-gradient-line tech-flow-top-left" filter="url(#hyperNeonGlow)" d="M 128,494 L 128,30 L 382,30 L 382,200" />
          <path pathLength="1000" className="tech-flowing-gradient-line tech-flow-top-mid" filter="url(#hyperNeonGlow)" d="M 400,494 L 400,490 L 430,490 L 430,10 L 400,10 L 400,200" />
          <path pathLength="1000" className="tech-flowing-gradient-line tech-flow-top-right" filter="url(#hyperNeonGlow)" d="M 672,494 L 672,30 L 414,30 L 414,200" />
          <path pathLength="1000" className="tech-flowing-gradient-line tech-flow-card-left" filter="url(#hyperNeonGlow)" d="M 128,494 L 128,450 L 379,450 L 379,300" />
          <path pathLength="1000" className="tech-flowing-gradient-line tech-flow-card-center" filter="url(#hyperNeonGlow)" d="M 400,494 L 400,300" />
          <path pathLength="1000" className="tech-flowing-gradient-line tech-flow-card-right" filter="url(#hyperNeonGlow)" d="M 672,494 L 672,450 L 411,450 L 411,300" />
          
          <rect x="300" y="200" width="200" height="100" rx="6" fill="url(#chipGrad)" stroke="rgba(168, 85, 247, 0.55)" strokeWidth="1.5" filter="url(#chipGlow)" />
          <text x="400" y="254" dominantBaseline="middle" textAnchor="middle" fill="url(#textGrad)" fontFamily="system-ui, sans-serif" fontWeight="700" fontSize="25" letterSpacing="-0.02em">Spurvancelab</text>
        </svg>
        
        <div className="tech-cards-grid">
          <div className="tech-card">
            <div className="tech-card-icon">⚛️</div>
            <div className="tech-card-content">
              <h3>React</h3>
              <p>The library for web and native user interfaces. Next.js is built on the latest React features.</p>
            </div>
          </div>
          <div className="tech-card">
            <div className="tech-card-icon">📦</div>
            <div className="tech-card-content">
              <h3>Turbopack</h3>
              <p>An incremental bundler optimized for JavaScript and TypeScript, written in Rust.</p>
            </div>
          </div>
          <div className="tech-card">
            <div className="tech-card-icon">⚡</div>
            <div className="tech-card-content">
              <h3>Speedy Web Compiler</h3>
              <p>An extensible Rust-based platform for the next generation of fast developer tools.</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}