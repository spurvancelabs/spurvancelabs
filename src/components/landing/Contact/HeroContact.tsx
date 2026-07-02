import React from 'react'
import "../../../global.css"
import Header from '../Header'
import Image from 'next/image'

function HeroContact() {
  return (
      <div className='flex flex-col lg:flex-row items-center justify-center w-full h-auto lg:h-screen mt-20 mb-10 px-4 sm:px-0 relative'>
        <div className='flex-1 p-5 md:p-10'>
            <h3 className='font-bold text-white text-lg sm:text-xl'>Do, you want to contact us</h3>
            <h1 className='font-bold text-xl sm:text-2xl md:text-4xl text-white'>Hello, Everyone From Spurvancelab Meeting Team</h1>
            <p className='text-sm text-gray-500 mt-6 sm:mt-10'>Lorem, ipsum dolor sit amet consectetur adipisicing elit. Repudiandae rem, error quas assumenda deserunt nisi tenetur aperiam, vero facilis at voluptates dolorum, aliquam eligendi nesciunt. Repudiandae aperiam inventore omnis accusamus.</p>
            <div className='flex flex-col sm:flex-row gap-3 sm:gap-5 mt-5'>
            <button className='relative bg-white font-semibold text-black py-2 px-4 rounded-full hover:bg-gray-300 cursor-pointer text-sm sm:text-base'>Schedule Meeting</button>
            <button className='hover:text-gray-300 cursor-pointer border border-white py-2 px-4 rounded-full text-white text-sm sm:text-base'>Schedule Call</button>
            </div>
        </div>
       {/* Contact Form */}
<div className="bg-[#0a0a0a] flex-1 mx-2 sm:m-4 md:m-10 border border-[#1a1a1a] rounded-2xl p-4 sm:p-5 transition-[0.4s_ease] hover:border-[#2a2a2a]">
  <form className="flex flex-col gap-4 sm:gap-6">
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
      <div className="flex flex-col gap-1">
        <label htmlFor="fullName" className="text-[#888] text-[0.7rem] sm:text-[0.8rem] font-medium tracking-[0.02em]">Full Name</label>
        <input
          type="text"
          id="fullName"
          name="fullName"
          placeholder="John Doe"
          className="bg-[#0a0a0a] border border-[#1a1a1a] rounded-[10px] px-4 sm:px-5 py-[0.75rem] sm:py-[0.9rem] text-white text-[0.85rem] sm:text-[0.95rem] transition-[0.3s_ease] w-full focus:outline-none focus:border-[#2a2a2a] focus:bg-[#111] focus:shadow-[0_0_30px_rgba(255,255,255,0.02)] placeholder:text-[#444]"
        />
      </div>
      <div className="flex flex-col gap-1">
        <label htmlFor="emailAddress" className="text-[#888] text-[0.7rem] sm:text-[0.8rem] font-medium tracking-[0.02em]">Email Address</label>
        <input
          type="email"
          id="emailAddress"
          name="emailAddress"
          placeholder="john@example.com"
          className="bg-[#0a0a0a] border border-[#1a1a1a] rounded-[10px] px-4 sm:px-5 py-[0.75rem] sm:py-[0.9rem] text-white text-[0.85rem] sm:text-[0.95rem] transition-[0.3s_ease] w-full focus:outline-none focus:border-[#2a2a2a] focus:bg-[#111] focus:shadow-[0_0_30px_rgba(255,255,255,0.02)] placeholder:text-[#444]"
        />
      </div>
    </div>

    <div className="flex flex-col gap-1">
      <label htmlFor="subject" className="text-[#888] text-[0.7rem] sm:text-[0.8rem] font-medium tracking-[0.02em]">Subject</label>
      <input
        type="text"
        id="subject"
        name="subject"
        placeholder="Project Discussion"
        className="bg-[#0a0a0a] border border-[#1a1a1a] rounded-[10px] px-4 sm:px-5 py-[0.75rem] sm:py-[0.9rem] text-white text-[0.85rem] sm:text-[0.95rem] transition-[0.3s_ease] w-full focus:outline-none focus:border-[#2a2a2a] focus:bg-[#111] focus:shadow-[0_0_30px_rgba(255,255,255,0.02)] placeholder:text-[#444]"
      />
    </div>

    <div className="flex flex-col gap-1">
      <label htmlFor="message" className="text-[#888] text-[0.7rem] sm:text-[0.8rem] font-medium tracking-[0.02em]">Message</label>
      <textarea
        id="message"
        name="message"
        rows={4}
        placeholder="Tell us about your project..."
        className="bg-[#0a0a0a] border border-[#1a1a1a] rounded-[10px] px-4 sm:px-5 py-[0.75rem] sm:py-[0.9rem] text-white text-[0.85rem] sm:text-[0.95rem] transition-[0.3s_ease] w-full focus:outline-none focus:border-[#2a2a2a] focus:bg-[#111] focus:shadow-[0_0_30px_rgba(255,255,255,0.02)] placeholder:text-[#444] resize-y min-h-[100px]"
      ></textarea>
    </div>

    <div className="flex flex-row items-start sm:items-center gap-3 flex-wrap">
      <input
        type="checkbox"
        id="agree"
        name="agree"
        className="w-[18px] h-[18px] min-w-[18px] accent-white cursor-pointer p-0 mt-1 sm:mt-0"
      />
      <label htmlFor="agree" className="text-[#666] text-[0.8rem] sm:text-[0.85rem] font-normal cursor-pointer">
        I agree to the <a href="#" className="text-[#888] no-underline border-b border-[#1a1a1a] pb-[1px] transition-[0.3s_ease] hover:text-white hover:border-b-[#444]">Privacy Policy</a> and <a href="#" className="text-[#888] no-underline border-b border-[#1a1a1a] pb-[1px] transition-[0.3s_ease] hover:text-white hover:border-b-[#444]">Terms of Service</a>
      </label>
    </div>

    <button type="submit" className="inline-flex items-center justify-center gap-3 px-8 sm:px-10 py-3 sm:py-4 bg-white text-black border-none rounded-[50px] text-[0.9rem] sm:text-[1rem] font-semibold cursor-pointer transition-[0.4s_cubic-bezier(0.25,0.46,0.45,0.94)] relative overflow-hidden w-full hover:-translate-y-1 hover:shadow-[0_20px_40px_rgba(255,255,255,0.15)] hover:gap-5">
      <span className="absolute top-0 left-[-100%] w-full h-full bg-gradient-to-r from-transparent via-white/20 to-transparent transition-[0.6s_ease] hover:left-full"></span>
      <span>Send Message</span>
      <i className="fas fa-paper-plane text-[0.9rem] transition-[0.3s_ease] hover:translate-x-1"></i>
    </button>
  </form>
</div>

<div className='w-40 h-40 sm:w-80 sm:h-80 -z-5 absolute left-0 top-0 bg-linear-to-r from-blue-700 to-slate-50 rounded-full filter blur-3xl animate-blob animation-delay-2000'></div>
<div className='w-40 h-40 sm:w-80 sm:h-80 -z-5 absolute right-0 bottom-0 bg-linear-to-r from-blue-700 to-slate-50 rounded-full filter blur-3xl animate-blob animation-delay-4000'></div>

<div className='hidden sm:block absolute top-12 left-[calc(50%+2px)]'>
<Image src={"/element.svg"} alt="contact" width={50} height={50} />
</div>
    </div>
  )
}

export default HeroContact