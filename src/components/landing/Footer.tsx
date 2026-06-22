'use client';

import { useState } from 'react';
import Image from 'next/image';
import './Footer.css';

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
    <footer className="footer-section">
      <div className="footer-container">
        <div className="footer-column">
          <div className="footer-brand">
            <div className="footer-logo">
              <Image
                src="/spurvance-logo-removebg-preview.png"
                alt="Spurvancelab"
                width={40}
                height={40}
              />
              <span>Spurvancelab</span>
            </div>
            <p>We craft digital experiences that transform businesses and drive growth through innovative technology solutions.</p>
          </div>
          <div className="footer-social">
            <a href="#" aria-label="LinkedIn"><i className="fab fa-linkedin-in"></i></a>
            <a href="#" aria-label="Twitter"><i className="fab fa-twitter"></i></a>
            <a href="#" aria-label="GitHub"><i className="fab fa-github"></i></a>
            <a href="#" aria-label="YouTube"><i className="fab fa-youtube"></i></a>
            <a href="#" aria-label="Instagram"><i className="fab fa-instagram"></i></a>
          </div>
        </div>

        <div className="footer-column">
          <h4>Services</h4>
          <ul className="footer-links">
            <li><a href="#">Web Development</a></li>
            <li><a href="#">Mobile Apps</a></li>
            <li><a href="#">UI/UX Design</a></li>
            <li><a href="#">Cloud Solutions</a></li>
            <li><a href="#">AI &amp; Machine Learning</a></li>
            <li><a href="#">Cybersecurity</a></li>
          </ul>
        </div>

        <div className="footer-column">
          <h4>Company</h4>
          <ul className="footer-links">
            <li><a href="#">About Us</a></li>
            <li><a href="#">Careers</a></li>
            <li><a href="#">Portfolio</a></li>
            <li><a href="#">Blog</a></li>
            <li><a href="#">Testimonials</a></li>
            <li><a href="#">Contact</a></li>
          </ul>
        </div>

        <div className="footer-column">
          <h4>Newsletter</h4>
          <p className="footer-newsletter-text">Subscribe to get the latest updates and insights from our team.</p>
          <form className="footer-newsletter" onSubmit={handleNewsletterSubmit}>
            <div className="footer-newsletter-wrapper">
              <input
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                style={{ borderColor: error ? '#ef4444' : '' }}
                required
              />
              <button type="submit" aria-label="Subscribe">
                <i className="fas fa-arrow-right"></i>
              </button>
            </div>
            {error && <span className="footer-newsletter-error">{error}</span>}
            <span className={`footer-newsletter-success ${isSubscribed ? 'show' : ''}`}>
              ✓ Subscribed successfully!
            </span>
          </form>
        </div>
      </div>

      <div className="footer-bottom">
        <div className="footer-bottom-container">
          <p>&copy; 2026 Spurvancelab. All rights reserved.</p>
          <div className="footer-bottom-links">
            <a href="#">Privacy Policy</a>
            <span className="footer-divider">|</span>
            <a href="#">Terms of Service</a>
            <span className="footer-divider">|</span>
            <a href="#">Cookie Policy</a>
          </div>
        </div>
      </div>
    </footer>
  );
}