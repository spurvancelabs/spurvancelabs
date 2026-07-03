'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

const navItems = [
  { href: '/landing', label: 'Home' },
  { href: '/landing/services', label: 'Services' },
  { href: '/landing/about', label: 'About' },
  { href: '/landing/internships', label: 'Internships' },
  { href: '/landing/jobs', label: 'Jobs' },
  { href: '/landing/products', label: 'Products' },
  { href: '/landing/contact', label: 'Contact' },
];

export default function Header() {
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);

  const isActive = (href: string) => {
    if (href === '/landing') return pathname === '/landing' || pathname === '/';
    return pathname.startsWith(href);
  };

  return (
    <header className="backdrop-blur-[20px] fixed top-0 left-0 right-0 z-[100] px-4 md:px-8 h-[70px] flex items-center max-md:h-[60px]">
      <div className="flex justify-between items-center w-full max-w-[1300px] mx-auto">
        <div className="flex items-center gap-2.5 text-[1.1rem] font-semibold tracking-[-0.5px]">
          <Image 
            src="/spurvance-logo-removebg-preview.png" 
            alt="Spurvancelab" 
            width={40} 
            height={40} 
            className="h-10 w-auto max-md:h-[30px]"
          />
          <h1 className="text-[1.2rem] font-bold bg-gradient-to-r from-[#f0f0f0] to-[#aaa] bg-clip-text text-transparent max-md:text-[1rem]">
            Spurvancelab
          </h1>
        </div>

        {/* Hamburger */}
        <button 
          className="hidden max-md:flex items-center justify-center w-8 h-8 text-white cursor-pointer"
          onClick={() => setMenuOpen(!menuOpen)}
        >
          <i className={`fas ${menuOpen ? 'fa-times' : 'fa-bars'} text-[1.2rem]`}></i>
        </button>

        {/* Desktop Nav */}
        <nav className="max-md:hidden">
          <ul className="list-none flex gap-1 lg:gap-2">
            {navItems.map((item) => (
              <Link key={item.href} href={item.href}>
                <li className={`inline-block px-3 lg:px-4 py-2 cursor-pointer text-[0.8rem] lg:text-[0.9rem] font-medium rounded-[40px] transition-all duration-200 ${
                  isActive(item.href)
                    ? 'text-white bg-[#1a1a1a]'
                    : 'text-[#ccc] hover:text-white hover:bg-[#1a1a1a]'
                }`}>
                  {item.label}
                </li>
              </Link>
            ))}
            <Link href="/contact">
              <li className="bg-white inline-block px-3 lg:px-4 py-2 cursor-pointer text-[0.8rem] lg:text-[0.9rem] font-medium text-black rounded-[40px] transition-all duration-200 hover:bg-[#a4a4a4]">
                Contact Us
              </li>
            </Link>
          </ul>
        </nav>

        {/* Mobile/Tablet Nav */}
        <div className={`fixed md:hidden top-[60px] left-0 right-0 bg-black/95 backdrop-blur-[20px] border-b border-[#1a1a1a] px-4 py-4 transition-all duration-300 ease-in-out ${
          menuOpen ? 'opacity-100 visible' : 'opacity-0 invisible'
        }`}>
          <ul className="flex flex-col gap-1">
            {navItems.map((item) => (
              <Link key={item.href} href={item.href} onClick={() => setMenuOpen(false)}>
                <li className={`px-4 py-3 cursor-pointer text-[0.9rem] font-medium rounded-[12px] transition-all duration-200 ${
                  isActive(item.href)
                    ? 'text-white bg-[#1a1a1a]'
                    : 'text-[#ccc] hover:text-white hover:bg-[#1a1a1a]'
                }`}>
                  {item.label}
                </li>
              </Link>
            ))}
            <Link href="/contact" onClick={() => setMenuOpen(false)}>
              <li className="bg-white text-black px-4 py-3 cursor-pointer text-[0.9rem] font-medium rounded-[12px] transition-all duration-200 hover:bg-[#a4a4a4]">
                Contact Us
              </li>
            </Link>
          </ul>
        </div>
      </div>
    </header>
  );
}