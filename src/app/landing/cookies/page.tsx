import React from 'react';
import "../../../global.css";
import Header from '@/components/landing/Header';
import Footer from '@/components/landing/Footer';

function CookiesPage() {
  return (
    <main className="min-h-screen overflow-hidden">
      <Header />
      <section className="pt-36 pb-20 px-4 sm:px-8 max-w-3xl mx-auto">
        <h1 className="text-white text-3xl sm:text-4xl font-bold tracking-[-0.02em] mb-2">
          Cookie Policy
        </h1>
        <p className="text-[#666] text-sm mb-10">Last updated: August 1, 2026</p>

        <div className="flex flex-col gap-8 text-[#999] text-[0.95rem] leading-[1.8]">
          <div>
            <h2 className="text-white text-lg font-semibold mb-3">1. What Are Cookies</h2>
            <p>
              Cookies are small text files stored on your device when you visit a website. They help
              the site remember your preferences and understand how the site is used.
            </p>
          </div>
          <div>
            <h2 className="text-white text-lg font-semibold mb-3">2. How We Use Cookies</h2>
            <p>
              We use essential cookies to keep the website functioning, preference cookies to remember
              your settings, and analytics cookies to understand visitor behaviour so we can improve
              our site.
            </p>
          </div>
          <div>
            <h2 className="text-white text-lg font-semibold mb-3">3. Managing Cookies</h2>
            <p>
              You can control and/or delete cookies through your browser settings. Disabling some
              cookies may affect how the website functions for you.
            </p>
          </div>
          <div>
            <h2 className="text-white text-lg font-semibold mb-3">4. Contact Us</h2>
            <p>
              For any questions about our use of cookies, contact us at hello@spurvancelab.com.
            </p>
          </div>
        </div>
      </section>
      <Footer />
    </main>
  );
}

export default CookiesPage;
