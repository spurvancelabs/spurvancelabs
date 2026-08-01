import React from 'react';
import "../../../global.css";
import Header from '@/components/landing/Header';
import Footer from '@/components/landing/Footer';

function TermsPage() {
  return (
    <main className="min-h-screen overflow-hidden">
      <Header />
      <section className="pt-36 pb-20 px-4 sm:px-8 max-w-3xl mx-auto">
        <h1 className="text-white text-3xl sm:text-4xl font-bold tracking-[-0.02em] mb-2">
          Terms of Service
        </h1>
        <p className="text-[#666] text-sm mb-10">Last updated: August 1, 2026</p>

        <div className="flex flex-col gap-8 text-[#999] text-[0.95rem] leading-[1.8]">
          <div>
            <h2 className="text-white text-lg font-semibold mb-3">1. Acceptance of Terms</h2>
            <p>
              By accessing or using the Spurvancelab website, you agree to be bound by these Terms
              of Service. If you do not agree with any part of these terms, please do not use our
              website or services.
            </p>
          </div>
          <div>
            <h2 className="text-white text-lg font-semibold mb-3">2. Services</h2>
            <p>
              Spurvancelab provides software development services, including web, mobile, AI, cloud,
              and consulting services for startups and remote teams. Specific project terms are
              governed by separate agreements between the parties.
            </p>
          </div>
          <div>
            <h2 className="text-white text-lg font-semibold mb-3">3. Intellectual Property</h2>
            <p>
              All content on this website, including text, graphics, logos, and software, is the
              property of Spurvancelab or its licensors and is protected by applicable intellectual
              property laws.
            </p>
          </div>
          <div>
            <h2 className="text-white text-lg font-semibold mb-3">4. User Conduct</h2>
            <p>
              You agree not to misuse our website, attempt unauthorized access to our systems, or
              use our services for any unlawful purpose.
            </p>
          </div>
          <div>
            <h2 className="text-white text-lg font-semibold mb-3">5. Limitation of Liability</h2>
            <p>
              To the maximum extent permitted by law, Spurvancelab shall not be liable for any
              indirect, incidental, or consequential damages arising from the use of our website or
              services.
            </p>
          </div>
          <div>
            <h2 className="text-white text-lg font-semibold mb-3">6. Contact Us</h2>
            <p>
              Questions about these Terms can be directed to hello@spurvancelab.com.
            </p>
          </div>
        </div>
      </section>
      <Footer />
    </main>
  );
}

export default TermsPage;
