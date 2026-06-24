import React from 'react'
import "../../../global.css"
import HeroService from '@/components/landing/Services/HeroService'
import Header from '@/components/landing/Header'
import Footer from '@/components/landing/Footer'
import AIServices from '@/components/landing/Services/AIServices'
import PricingService from '@/components/landing/Services/PricingService'
import ServiceGrid from '@/components/landing/Services/ServiceGrid'
import ServiceProcess from '@/components/landing/Services/ServiceProcess'
function ServicePage() {
  return (
<section className=' '>
    <Header/>
    <div className=''>
    <HeroService/>
    <ServiceGrid/>
    <AIServices/>
    <ServiceProcess/>
    <PricingService/>
    </div>
    <Footer/>
</section>
  )
}

export default ServicePage