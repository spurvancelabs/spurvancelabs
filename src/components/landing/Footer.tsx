'use client';

import { useState } from 'react';
import Image from 'next/image';

export default function Footer() {
  const [email, setEmail] = useState('');
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [error, setError] = useState('');

  const handleNewsletterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError('Please enter a valid email');
      setTimeout(() => setError(''), 3000);
      return;
    }
    
    // Simulate subscription
    setIsSubscribed(true);
    setEmail('');
    setTimeout(() => setIsSubscribed(false), 5000);
  };

  return (
    <footer className="bg-black border-t border-[#1a1a1a] pt-16 px-8 overflow-hidden">
      <div className="max-w-[1200px] mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-[2fr_1fr_1fr_1.5fr] gap-12 pb-12 border-b border-[#1a1a1a]">
        {/* Brand Column */}
        <div className="flex flex-col gap-5">
          <div className="flex flex-col gap-4">
            <div className="flex items-center gap-3">
              <Image
                src="/spurvance-logo-removebg-preview.png"
                alt="Spurvancelab"
                width={40}
                height={40}
                className="h-10 w-auto max-sm:h-8"
              />
              <span className="text-white text-[1.3rem] font-bold bg-gradient-to-r from-[#f0f0f0] to-[#aaa] bg-clip-text text-transparent max-sm:text-[1.1rem]">
                Spurvancelab
              </span>
            </div>
            <p className="text-[#666] text-[0.95rem] leading-[1.8] max-w-[350px] max-sm:text-[0.85rem]">
              We craft digital experiences that transform businesses and drive growth through innovative technology solutions.
            </p>
          </div>
          <div className="flex gap-3 mt-2">
            <a href="#" aria-label="LinkedIn" className="w-10 h-10 max-sm:w-9 max-sm:h-9 rounded-full bg-[#1a1a1a] border border-[#1a1a1a] flex items-center justify-center text-[#666] no-underline transition-[0.3s_ease] hover:bg-[#2a2a2a] hover:border-[#2a2a2a] hover:text-white hover:-translate-y-1 hover:shadow-[0_10px_30px_rgba(0,0,0,0.3)]">
              <i className="fab fa-linkedin-in"></i>
            </a>
            <a href="#" aria-label="Twitter" className="w-10 h-10 max-sm:w-9 max-sm:h-9 rounded-full bg-[#1a1a1a] border border-[#1a1a1a] flex items-center justify-center text-[#666] no-underline transition-[0.3s_ease] hover:bg-[#2a2a2a] hover:border-[#2a2a2a] hover:text-white hover:-translate-y-1 hover:shadow-[0_10px_30px_rgba(0,0,0,0.3)]">
              <i className="fab fa-twitter"></i>
            </a>
            <a href="#" aria-label="GitHub" className="w-10 h-10 max-sm:w-9 max-sm:h-9 rounded-full bg-[#1a1a1a] border border-[#1a1a1a] flex items-center justify-center text-[#666] no-underline transition-[0.3s_ease] hover:bg-[#2a2a2a] hover:border-[#2a2a2a] hover:text-white hover:-translate-y-1 hover:shadow-[0_10px_30px_rgba(0,0,0,0.3)]">
              <i className="fab fa-github"></i>
            </a>
            <a href="#" aria-label="YouTube" className="w-10 h-10 max-sm:w-9 max-sm:h-9 rounded-full bg-[#1a1a1a] border border-[#1a1a1a] flex items-center justify-center text-[#666] no-underline transition-[0.3s_ease] hover:bg-[#2a2a2a] hover:border-[#2a2a2a] hover:text-white hover:-translate-y-1 hover:shadow-[0_10px_30px_rgba(0,0,0,0.3)]">
              <i className="fab fa-youtube"></i>
            </a>
            <a href="#" aria-label="Instagram" className="w-10 h-10 max-sm:w-9 max-sm:h-9 rounded-full bg-[#1a1a1a] border border-[#1a1a1a] flex items-center justify-center text-[#666] no-underline transition-[0.3s_ease] hover:bg-[#2a2a2a] hover:border-[#2a2a2a] hover:text-white hover:-translate-y-1 hover:shadow-[0_10px_30px_rgba(0,0,0,0.3)]">
              <i className="fab fa-instagram"></i>
            </a>
          </div>
        </div>

        {/* Services Column */}
        <div className="flex flex-col gap-4">
          <h4 className="text-white text-[1.1rem] font-semibold mb-[0.2rem] tracking-[-0.01em] max-sm:text-[1rem]">Services</h4>
          <ul className="list-none p-0 m-0 flex flex-col gap-[0.6rem]">
            <li><a href="#" className="text-[#666] no-underline text-[0.9rem] transition-[0.3s_ease] relative inline-block hover:text-white after:content-[''] after:absolute after:bottom-[-2px] after:left-0 after:w-0 after:h-px after:bg-[#888] after:transition-[0.3s_ease] hover:after:w-full max-sm:text-[0.85rem]">Web Development</a></li>
            <li><a href="#" className="text-[#666] no-underline text-[0.9rem] transition-[0.3s_ease] relative inline-block hover:text-white after:content-[''] after:absolute after:bottom-[-2px] after:left-0 after:w-0 after:h-px after:bg-[#888] after:transition-[0.3s_ease] hover:after:w-full max-sm:text-[0.85rem]">Mobile Apps</a></li>
            <li><a href="#" className="text-[#666] no-underline text-[0.9rem] transition-[0.3s_ease] relative inline-block hover:text-white after:content-[''] after:absolute after:bottom-[-2px] after:left-0 after:w-0 after:h-px after:bg-[#888] after:transition-[0.3s_ease] hover:after:w-full max-sm:text-[0.85rem]">UI/UX Design</a></li>
            <li><a href="#" className="text-[#666] no-underline text-[0.9rem] transition-[0.3s_ease] relative inline-block hover:text-white after:content-[''] after:absolute after:bottom-[-2px] after:left-0 after:w-0 after:h-px after:bg-[#888] after:transition-[0.3s_ease] hover:after:w-full max-sm:text-[0.85rem]">Cloud Solutions</a></li>
            <li><a href="#" className="text-[#666] no-underline text-[0.9rem] transition-[0.3s_ease] relative inline-block hover:text-white after:content-[''] after:absolute after:bottom-[-2px] after:left-0 after:w-0 after:h-px after:bg-[#888] after:transition-[0.3s_ease] hover:after:w-full max-sm:text-[0.85rem]">AI &amp; Machine Learning</a></li>
            <li><a href="#" className="text-[#666] no-underline text-[0.9rem] transition-[0.3s_ease] relative inline-block hover:text-white after:content-[''] after:absolute after:bottom-[-2px] after:left-0 after:w-0 after:h-px after:bg-[#888] after:transition-[0.3s_ease] hover:after:w-full max-sm:text-[0.85rem]">Cybersecurity</a></li>
          </ul>
        </div>

        {/* Company Column */}
        <div className="flex flex-col gap-4">
          <h4 className="text-white text-[1.1rem] font-semibold mb-[0.2rem] tracking-[-0.01em] max-sm:text-[1rem]">Company</h4>
          <ul className="list-none p-0 m-0 flex flex-col gap-[0.6rem]">
            <li><a href="#" className="text-[#666] no-underline text-[0.9rem] transition-[0.3s_ease] relative inline-block hover:text-white after:content-[''] after:absolute after:bottom-[-2px] after:left-0 after:w-0 after:h-px after:bg-[#888] after:transition-[0.3s_ease] hover:after:w-full max-sm:text-[0.85rem]">About Us</a></li>
            <li><a href="#" className="text-[#666] no-underline text-[0.9rem] transition-[0.3s_ease] relative inline-block hover:text-white after:content-[''] after:absolute after:bottom-[-2px] after:left-0 after:w-0 after:h-px after:bg-[#888] after:transition-[0.3s_ease] hover:after:w-full max-sm:text-[0.85rem]">Careers</a></li>
            <li><a href="#" className="text-[#666] no-underline text-[0.9rem] transition-[0.3s_ease] relative inline-block hover:text-white after:content-[''] after:absolute after:bottom-[-2px] after:left-0 after:w-0 after:h-px after:bg-[#888] after:transition-[0.3s_ease] hover:after:w-full max-sm:text-[0.85rem]">Portfolio</a></li>
            <li><a href="#" className="text-[#666] no-underline text-[0.9rem] transition-[0.3s_ease] relative inline-block hover:text-white after:content-[''] after:absolute after:bottom-[-2px] after:left-0 after:w-0 after:h-px after:bg-[#888] after:transition-[0.3s_ease] hover:after:w-full max-sm:text-[0.85rem]">Blog</a></li>
            <li><a href="#" className="text-[#666] no-underline text-[0.9rem] transition-[0.3s_ease] relative inline-block hover:text-white after:content-[''] after:absolute after:bottom-[-2px] after:left-0 after:w-0 after:h-px after:bg-[#888] after:transition-[0.3s_ease] hover:after:w-full max-sm:text-[0.85rem]">Testimonials</a></li>
            <li><a href="#" className="text-[#666] no-underline text-[0.9rem] transition-[0.3s_ease] relative inline-block hover:text-white after:content-[''] after:absolute after:bottom-[-2px] after:left-0 after:w-0 after:h-px after:bg-[#888] after:transition-[0.3s_ease] hover:after:w-full max-sm:text-[0.85rem]">Contact</a></li>
          </ul>
        </div>

        {/* Newsletter Column */}
        <div className="flex flex-col gap-4">
          <h4 className="text-white text-[1.1rem] font-semibold mb-[0.2rem] tracking-[-0.01em] max-sm:text-[1rem]">Newsletter</h4>
          <p className="text-[#666] text-[0.9rem] leading-[1.6] m-0">Subscribe to get the latest updates and insights from our team.</p>
          <form className="flex flex-col gap-2" onSubmit={handleNewsletterSubmit}>
            <div className="relative flex items-center">
              <input
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                style={{ borderColor: error ? '#ef4444' : '' }}
                required
                className="w-full px-5 py-[0.8rem] pr-[50px] bg-[#0a0a0a] border border-[#1a1a1a] rounded-[10px] text-white text-[0.9rem] transition-[0.3s_ease] font-inherit focus:outline-none focus:border-[#2a2a2a] focus:bg-[#111] focus:shadow-[0_0_30px_rgba(255,255,255,0.02)] placeholder:text-[#444] max-sm:text-[0.85rem] max-sm:py-[0.7rem] max-sm:pr-[45px]"
              />
              <button type="submit" aria-label="Subscribe" className="absolute right-1 w-10 h-10 max-sm:w-9 max-sm:h-9 rounded-lg bg-[#1a1a1a] border-none text-[#666] cursor-pointer transition-[0.3s_ease] flex items-center justify-center hover:bg-[#2a2a2a] hover:text-white">
                <i className="fas fa-arrow-right"></i>
              </button>
            </div>
            {error && <span className="text-[#ef4444] text-[0.8rem]">{error}</span>}
            <span className={`text-[#22c55e] text-[0.8rem] ${isSubscribed ? 'block' : 'hidden'}`}>
              ✓ Subscribed successfully!
            </span>
          </form>
        </div>
      </div>

      {/* Footer Bottom */}
      <div className="py-6 px-8 bg-[#0a0a0a] -mx-8 mt-0">
        <div className="max-w-[1200px] mx-auto flex justify-between items-center flex-wrap gap-4 flex-col sm:flex-row text-center sm:text-left">
          <p className="text-[#444] text-[0.85rem] m-0">&copy; 2026 Spurvancelab. All rights reserved.</p>
          <div className="flex items-center gap-3 flex-wrap justify-center">
            <a href="#" className="text-[#444] no-underline text-[0.85rem] transition-[0.3s_ease] hover:text-[#888]">Privacy Policy</a>
            <span className="text-[#1a1a1a]">|</span>
            <a href="#" className="text-[#444] no-underline text-[0.85rem] transition-[0.3s_ease] hover:text-[#888]">Terms of Service</a>
            <span className="text-[#1a1a1a]">|</span>
            <a href="#" className="text-[#444] no-underline text-[0.85rem] transition-[0.3s_ease] hover:text-[#888]">Cookie Policy</a>
          </div>
        </div>
      </div>
    </footer>
  );
}