import React from 'react';
import "../../../global.css";
import Header from '@/components/landing/Header';
import Footer from '@/components/landing/Footer';

function PrivacyPage() {
  return (
    <main className="min-h-screen overflow-hidden">
      <Header />
      <section className="pt-36 pb-20 px-4 sm:px-8 max-w-3xl mx-auto">
        <h1 className="text-white text-3xl sm:text-4xl font-bold tracking-[-0.02em] mb-2">
          Privacy Policy
        </h1>
        <p className="text-[#666] text-sm mb-10">Last updated: August 1, 2026</p>

        <div className="flex flex-col gap-8 text-[#999] text-[0.95rem] leading-[1.8]">
          <div>
            <h2 className="text-white text-lg font-semibold mb-3">1. Information We Collect</h2>
            <p>
              We collect information you provide directly, such as your name, email address, and
              any details you submit through our contact, newsletter, job, or internship forms.
              We also collect usage data such as pages visited and browser information to improve
              our website and services.
            </p>
          </div>
          <div>
            <h2 className="text-white text-lg font-semibold mb-3">2. How We Use Your Information</h2>
            <p>
              We use the information we collect to respond to your inquiries, process job and
              internship applications, send you newsletters you have subscribed to, improve our
              website, and provide the services you request. We never sell your personal data.
            </p>
          </div>
          <div>
            <h2 className="text-white text-lg font-semibold mb-3">3. Cookies</h2>
            <p>
              We use cookies and similar technologies to understand how our site is used and to
              improve your experience. You can disable cookies in your browser settings at any time.
              See our Cookie Policy for more details.
            </p>
          </div>
          <div>
            <h2 className="text-white text-lg font-semibold mb-3">4. Data Security</h2>
            <p>
              We take reasonable technical and organizational measures to protect your personal
              information against unauthorized access, alteration, disclosure, or destruction.
            </p>
          </div>
          <div>
            <h2 className="text-white text-lg font-semibold mb-3">5. Your Rights</h2>
            <p>
              You may request access to, correction of, or deletion of your personal information at
              any time by contacting us at hello@spurvancelab.com.
            </p>
          </div>
          <div>
            <h2 className="text-white text-lg font-semibold mb-3">6. Contact Us</h2>
            <p>
              If you have any questions about this Privacy Policy, contact us at
              hello@spurvancelab.com.
            </p>
          </div>
        </div>
      </section>
      <Footer />
    </main>
  );
}

export default PrivacyPage;
