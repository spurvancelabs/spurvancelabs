'use client';

import Image from 'next/image';

export default function Header() {
  return (
    <header className="backdrop-blur-[20px] fixed top-0 left-0 right-0 z-[100] px-8 h-[70px] flex items-center max-sm:px-4 max-sm:h-[60px]">
      <div className="flex justify-between items-center w-full max-w-[1300px] mx-auto">
        <div className="flex items-center gap-2.5 text-[1.1rem] font-semibold tracking-[-0.5px]">
          <Image 
            src="/spurvance-logo-removebg-preview.png" 
            alt="Spurvancelab" 
            width={40} 
            height={40} 
            className="h-10 w-auto max-sm:h-[30px]"
          />
          <h1 className="text-[1.2rem] font-bold bg-gradient-to-r from-[#f0f0f0] to-[#aaa] bg-clip-text text-transparent max-sm:text-[1rem]">
            Spurvancelab
          </h1>
        </div>
        <nav>
          <ul className="list-none flex gap-2">
            <li className="inline-block px-4 py-2 cursor-pointer text-[0.9rem] font-medium text-[#ccc] rounded-[40px] transition-all duration-200 hover:text-white hover:bg-[#1a1a1a] max-sm:px-2.5 max-sm:py-1 max-sm:text-[0.75rem]">
              Home
            </li>
            <li className="inline-block px-4 py-2 cursor-pointer text-[0.9rem] font-medium text-[#ccc] rounded-[40px] transition-all duration-200 hover:text-white hover:bg-[#1a1a1a] max-sm:px-2.5 max-sm:py-1 max-sm:text-[0.75rem]">
              Services
            </li>
            <li className="inline-block px-4 py-2 cursor-pointer text-[0.9rem] font-medium text-[#ccc] rounded-[40px] transition-all duration-200 hover:text-white hover:bg-[#1a1a1a] max-sm:px-2.5 max-sm:py-1 max-sm:text-[0.75rem]">
              About
            </li>
            <li className="inline-block px-4 py-2 cursor-pointer text-[0.9rem] font-medium text-[#ccc] rounded-[40px] transition-all duration-200 hover:text-white hover:bg-[#1a1a1a] max-sm:px-2.5 max-sm:py-1 max-sm:text-[0.75rem]">
              Contact
            </li>
            <li className="inline-block px-4 py-2 cursor-pointer text-[0.9rem] font-medium text-[#ccc] rounded-[40px] transition-all duration-200 hover:text-white hover:bg-[#1a1a1a] max-sm:px-2.5 max-sm:py-1 max-sm:text-[0.75rem]">
              Login
            </li>
          </ul>
        </nav>
      </div>
    </header>
  );
}