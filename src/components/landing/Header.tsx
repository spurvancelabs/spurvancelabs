'use client';

import Image from 'next/image';
import './Header.css';

export default function Header() {
  return (
    <header className="header">
      <div className="header-container">
        <div className="logo">
          <Image 
            src="/spurvance-logo-removebg-preview.png" 
            alt="Spurvancelab" 
            width={40} 
            height={40} 
            className="logo-image"
          />
          <h1>Spurvancelab</h1>
        </div>
        <nav>
          <ul className="nav-list">
            <li>Home</li>
            <li>Services</li>
            <li>About</li>
            <li>Contact</li>
            <li>Login</li>
          </ul>
        </nav>
      </div>
    </header>
  );
}