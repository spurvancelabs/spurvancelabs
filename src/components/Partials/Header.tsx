import React from 'react'
import NotificationBell from '../NotificationBell'
import ProfileDropdown from '../dasboard/ProfileDropdown'
import Link from 'next/link'
import Image from 'next/image'

function Header() {
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 backdrop-blur-2xl bg-black/50 border-b border-white/5 shadow-2xl shadow-black/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center space-x-2">
            <Link href="/" className="flex items-center space-x-2">
              <Image 
                src="/spurvance-logo.png" 
                alt="Spurvancelab" 
                width={40}
                height={40}
                className="h-8 w-8 object-contain md:h-12 md:w-12"
                priority
              />
              <span className='text-[18px] font-semibold md:text-2xl text-white'>
                Spurvancelab
              </span>
            </Link>
          </div>
          
          <div className="flex items-center space-x-4">
              <NotificationBell  />
            <ProfileDropdown />
          </div>
        </div>
      </div>
    </nav>
  )
}

export default Header