'use client';

import Header from '@/components/landing/Header';
import Footer from '@/components/landing/Footer';
import JobsHero from '@/components/landing/Jobs/JobsHero';
import JobsListings from '@/components/landing/Jobs/JobsListings';
import JobsPerks from '@/components/landing/Jobs/JobsPerks';
import '../../../global.css';

export default function JobsPage() {
  return (
    <main className="min-h-screen overflow-hidden">
      <Header />
      <section className="w-full">
        <JobsHero />
      </section>
      <section className="w-full px-4 sm:px-6 md:px-8 lg:px-12 xl:px-16">
        <JobsListings />
      </section>
      <section className="w-full px-4 sm:px-6 md:px-8 lg:px-12 xl:px-16">
        <JobsPerks />
      </section>
      <Footer />
    </main>
  );
}