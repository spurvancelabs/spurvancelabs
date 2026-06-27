import Image from 'next/image'
import React from 'react'
import { HiOutlineMail, HiOutlinePhone, HiOutlineLocationMarker } from 'react-icons/hi'
import { FaRegEnvelope } from 'react-icons/fa'

function MapContact() {
  return (
    <div className="flex flex-col md:flex-row gap-12 items-center max-w-7xl mx-auto px-6 py-16 bg-gradient-to-br from-black via-gray-900 to-black min-h-screen">
      {/* Right side - Map */}
      <div className="flex-1 relative">
        <div className="absolute -inset-4  blur-3xl rounded-full"></div>
        <div className="relative">
          <Image 
            className='w-full h-auto drop-shadow-2xl' 
            src="/map.svg" 
            width={600} 
            height={600} 
            alt="map"
            priority
          />  
        </div>
      </div>
      
      {/* Left side - Text content */}
      <div className="flex-1 space-y-6">
        <div className="space-y-2">
         <span className="inline-flex items-center gap-2 text-blue-400 text-sm font-semibold tracking-wider uppercase bg-blue-500/10 px-4 py-1.5 rounded-full border border-blue-500/20 transform  shadow-[0_8px_30px_rgba(59,130,246,0.3)] relative">
  {/* 3D shadow effects */}
  <span className="absolute inset-0 rounded-full bg-gradient-to-b from-blue-400/10 to-transparent opacity-50"></span>
  <span className="absolute inset-0 rounded-full shadow-[inset_0_2px_4px_rgba(255,255,255,0.1),inset_0_-2px_4px_rgba(0,0,0,0.3)]"></span>
  <span className="absolute -bottom-0.5 inset-x-0 h-1/2 rounded-full bg-gradient-to-t from-blue-500/20 to-transparent blur-sm"></span>
  
  {/* Glow effect */}
  <span className="absolute -inset-1 rounded-full bg-blue-500/20 blur-xl opacity-0 "></span>
  
  <span className="relative z-10">Contact Us</span>
</span>
          <h2 className="text-5xl font-bold text-white leading-tight">
            Get in <span className="bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">Touch</span>
          </h2>
        </div>
        
        <p className="text-gray-400 text-lg leading-relaxed max-w-md">
          We'd love to hear from you! Feel free to reach out to us with any questions,
          feedback, or inquiries.
        </p>
        
        <div className="space-y-4 pt-2">
          <div className="flex items-center gap-4 group cursor-pointer">
            <div className="w-12 h-12 rounded-full  flex items-center justify-center  transition-all duration-300 group-hover:scale-110">
              <img className='w-10 h-10 object-cover' src="https://img.icons8.com/3d-fluency/94/place-marker.png" alt="location"/>
            </div>
            <div>
              <p className="text-gray-500 text-xs font-medium uppercase tracking-wider">Location</p>
              <p className="text-gray-300 group-hover:text-white transition-colors">123 Main Street, City, Country</p>
            </div>
          </div>
          
          <div className="flex items-center gap-4 group cursor-pointer">
            <div className="w-12 h-12 rounded-full  flex items-center justify-center  transition-all duration-300 group-hover:scale-110">
              <img className='w-10 h-10 object-cover' src="https://img.icons8.com/3d-fluency/94/phone-disconnected.png" alt="contact"/>
            </div>
            <div>
              <p className="text-gray-500 text-xs font-medium uppercase tracking-wider">Phone</p>
              <p className="text-gray-300 group-hover:text-white transition-colors">+1 (555) 123-4567</p>
            </div>
          </div>
          
          <div className="flex items-center gap-4 group cursor-pointer">
            <div className="w-12 h-12 rounded-full  flex items-center justify-center  transition-all duration-300 group-hover:scale-110">
              <img className='w-10 h-10 object-cover' src="https://img.icons8.com/3d-fluency/94/mail.png" alt="contact"/>
            </div>
            <div>
              <p className="text-gray-500 text-xs font-medium uppercase tracking-wider">Email</p>
              <p className="text-gray-300 group-hover:text-white transition-colors">contact@example.com</p>
            </div>
          </div>
        </div>
        
        <button className="group cursor-pointer relative overflow-hidden bg-gradient-to-r from-blue-500 to-cyan-500 text-white px-5 py-3 rounded-full font-medium shadow-2xl shadow-blue-500/25 hover:shadow-blue-500/50 transition-all duration-300">
          <span className="relative z-10 flex items-center gap-2">
            <FaRegEnvelope className="text-lg" />
            Contact Us
          </span>
          <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-cyan-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
          <div className="absolute -inset-1 bg-gradient-to-r from-blue-500 to-cyan-500 blur-xl opacity-0 group-hover:opacity-50 transition-opacity duration-300"></div>
        </button>
      </div>
    </div>
  )
}

export default MapContact