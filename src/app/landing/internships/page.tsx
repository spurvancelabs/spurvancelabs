'use client';

import Header from '@/components/landing/Header';
import Footer from '@/components/landing/Footer';
import InternshipHero from '@/components/landing/Internships/InternshipHero';
import InternshipListings from '@/components/landing/Internships/InternshipListings';
import InternshipBenefits from '@/components/landing/Internships/InternshipBenefits';
import '../../../global.css';
import GetStarted from '@/components/landing/Internships/GetStarted';

export default function InternshipsPage() {
  return (
    <main className="min-h-screen overflow-hidden">
      <Header />
      <section className="w-full">
        <InternshipHero />
      </section>
      <section className="w-full px-4 sm:px-6 md:px-8 lg:px-12 xl:px-16">
        <InternshipListings />
      </section>
      <section className="w-full px-4 sm:px-6 md:px-8 lg:px-12 xl:px-16">
        <InternshipBenefits />
      </section>
      <section className="w-full px-4 sm:px-6 md:px-8 lg:px-12 xl:px-16">
        <GetStarted />
      </section>
      <Footer />
    </main>
  );
}