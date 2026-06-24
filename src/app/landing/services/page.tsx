import React from 'react'
import "../../../global.css"
import HeroService from '@/components/landing/Services/HeroService'
import Header from '@/components/landing/Header'
import Footer from '@/components/landing/Footer'
import AIServices from '@/components/landing/Services/AIServices'
import InternshipPricing from '@/components/landing/Services/InternshipPricing'
import ServiceGrid from '@/components/landing/Services/ServiceGrid'
import ServiceProcess from '@/components/landing/Services/ServiceProcess'
import GetStarted from '@/components/landing/Internships/GetStarted'
function ServicePage() {
  return (
<section className=' '>
    <Header/>
    <div className=''>
    <HeroService/>
    <ServiceGrid/>
    <AIServices/>
    <InternshipPricing/>
    <ServiceProcess/>
    <GetStarted/>
    </div>
    <Footer/>
</section>
  )
}

export default ServicePage