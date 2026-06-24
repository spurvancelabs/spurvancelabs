
"use client"
import HeroContact from '@/components/landing/Contact/HeroContact'
import Footer from '@/components/landing/Footer'
import Header from '@/components/landing/Header'
import React from 'react'
import "../../../global.css"
import MapContact from '@/components/landing/Contact/MapContact'

function ContactPage() {
  return (
    <section className=''>
        <Header/>
        <HeroContact/>
        <MapContact/>

        <Footer/>
    </section>
  )
}

export default ContactPage