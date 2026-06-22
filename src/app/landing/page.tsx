import Header from '@/components/landing/Header';
import {Hero} from '@/components/landing/Hero';
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
    <main className="main">
      <Header />
      <Hero />
      <TechStack />
      <TrustedBy />
      <Stats />
      <Services />
      <WhyChooseUs />
      <Process />
      <Interective/>
      <DesignShowCase/>
      <OurNetwork/>
      <Portfolio />
      <CaseStudies />
      <Testimonials />
      <Faq />
      <Cta />
      <Contact />
      <SvgBackgrounds />
      <Footer />
    </main>
  );
}