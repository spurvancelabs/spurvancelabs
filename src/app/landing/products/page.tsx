'use client';

import Header from '@/components/landing/Header';
import Footer from '@/components/landing/Footer';
import ProductHero from '@/components/landing/Products/ProductHero';
import ProductListings from '@/components/landing/Products/ProductListings';
import ProductFeatures from '@/components/landing/Products/ProductFeatures';
import '../../../global.css';
import GetStarted from '@/components/landing/Internships/GetStarted';

export default function ProductsPage() {
  return (
    <main className="min-h-screen overflow-hidden">
      <Header />
      <section className="w-full">
        <ProductHero />
      </section>
      <section className="w-full px-4 sm:px-6 md:px-8 lg:px-12 xl:px-16">
        <ProductListings />
      </section>
      <section className="w-full px-4 sm:px-6 md:px-8 lg:px-12 xl:px-16">
        <ProductFeatures />
      </section>
      <section className="w-full px-4 sm:px-6 md:px-8 lg:px-12 xl:px-16">
        <GetStarted />
      </section>
      <Footer />
    </main>
  );
}