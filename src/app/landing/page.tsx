import Header from '@/components/landing/Header';
import {Hero} from '@/components/landing/Hero';
import CcpBanner from '@/components/landing/CcpBanner';
import TrustedBy from '@/components/landing/TrustedBy';
import Stats from '@/components/landing/Stats';
import Services from '@/components/landing/Services';
import WhyChooseUs from '@/components/landing/WhyChooseUs';
import Process from '@/components/landing/Process';
import TechStack from '@/components/landing/TechStack';
import Portfolio from '@/components/landing/Portfolio';
import CaseStudies from '@/components/landing/CaseStudies';
import Testimonials from '@/components/landing/Testinomials';
import Faq from '@/components/landing/Faq';
import Cta from '@/components/landing/Cta';
import Contact from '@/components/landing/Contact';
import Footer from '@/components/landing/Footer';
import {SvgBackgrounds} from '@/components/landing/SvgBackgrounds';
import './page.css';
import DesignShowCase from '@/components/landing/DesignShowCase';
import OurNetwork from '@/components/landing/OurNetwork';
import Interective from '@/components/landing/Interective';
import "../../global.css";

export default function Home() {
  return (
    <main className="main min-h-screen overflow-hidden ">
      {/* Fixed Header - sticky at top */}
      <Header />
      
      {/* All sections with proper spacing and responsive padding */}
      <section className="w-full">
        <Hero />
      </section>

      <CcpBanner />
      
      <section className="w-full px-4 sm:px-6 md:px-8 lg:px-12 xl:px-16">
        <TechStack />
      </section>
      
      <section className="w-full px-4 sm:px-6 md:px-8 lg:px-12 xl:px-16">
        <TrustedBy />
      </section>
      
      <section className="w-full px-4 sm:px-6 md:px-8 lg:px-12 xl:px-16">
        <Stats />
      </section>
      
      <section className="w-full px-4 sm:px-6 md:px-8 lg:px-12 xl:px-16">
        <Services />
      </section>
      
      <section className="w-full px-4 sm:px-6 md:px-8 lg:px-12 xl:px-16">
        <WhyChooseUs />
      </section>
      
      <section className="w-full px-4 sm:px-6 md:px-8 lg:px-12 xl:px-16">
        <Process />
      </section>
      
      <section className="w-full px-4 sm:px-6 md:px-8 lg:px-12 xl:px-16">
        <Interective />
      </section>
      
      <section className="w-full px-4 sm:px-6 md:px-8 lg:px-12 xl:px-16">
        <DesignShowCase />
      </section>
      
      <section className="w-full px-4 sm:px-6 md:px-8 lg:px-12 xl:px-16">
        <OurNetwork />
      </section>
      
      <section className="w-full px-4 sm:px-6 md:px-8 lg:px-12 xl:px-16">
        <Portfolio />
      </section>
      
      <section className="w-full px-4 sm:px-6 md:px-8 lg:px-12 xl:px-16">
        <CaseStudies />
      </section>
      
      <section className="w-full px-4 sm:px-6 md:px-8 lg:px-12 xl:px-16">
        <Testimonials />
      </section>
      
      <section className="w-full px-4 sm:px-6 md:px-8 lg:px-12 xl:px-16">
        <Faq />
      </section>
      
      <section className="w-full px-4 sm:px-6 md:px-8 lg:px-12 xl:px-16">
        <Cta />
      </section>
      
      <section className="w-full px-4 sm:px-6 md:px-8 lg:px-12 xl:px-16">
        <Contact />
      </section>
      
      {/* SVG Backgrounds - positioned absolutely with proper z-index */}
    
        <SvgBackgrounds />      
      {/* Footer - full width */}
      <Footer />
    </main>
  );
}