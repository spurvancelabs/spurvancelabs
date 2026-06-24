'use client';

import Header from '@/components/landing/Header';
import Footer from '@/components/landing/Footer';
import AboutHero from '@/components/landing/About/AboutHero';
import AboutTeam from '@/components/landing/About/AboutTeam';
import AboutValues from '@/components/landing/About/AboutValues';
import '../../../global.css';

export default function AboutPage() {
  return (
    <main className="min-h-screen overflow-hidden">
      <Header />
      <section className="w-full">
        <AboutHero />
      </section>
      <section className="w-full px-4 sm:px-6 md:px-8 lg:px-12 xl:px-16">
        <AboutTeam />
      </section>
      <section className="w-full px-4 sm:px-6 md:px-8 lg:px-12 xl:px-16">
        <AboutValues />
      </section>
      <Footer />
    </main>
  );
}