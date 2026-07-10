import React from 'react'
import "../../../global.css"
import HeroService from '@/components/landing/Services/HeroService'
import Header from '@/components/landing/Header'
import Footer from '@/components/landing/Footer'
import AIServices from '@/components/landing/Services/AIServices'
import ServiceGrid from '@/components/landing/Services/ServiceGrid'
import ServiceProcess from '@/components/landing/Services/ServiceProcess'
import GetStarted from '@/components/landing/Internships/GetStarted'
function ServicePage() {
  return (
    <main className="min-h-screen overflow-hidden">
      <Header />
      <section className="w-full">
    <HeroService/>
      </section>
      <section className="w-full px-4 sm:px-6 md:px-8 lg:px-12 xl:px-16">
       <ServiceGrid/>

      </section>
      <section className="w-full px-4 sm:px-6 md:px-8 lg:px-12 xl:px-16 mb-20">
    <AIServices/>
      </section>
    
     
      <Footer />
    </main>

  )
}

export default ServicePage