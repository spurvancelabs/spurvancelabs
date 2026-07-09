'use client'

import React, { useState, useEffect } from 'react'
import NotificationBell from '../NotificationBell'
import ProfileDropdown from '../dasboard/ProfileDropdown'
import Link from 'next/link'
import Image from 'next/image'
import { usePathname } from 'next/navigation'
import { ROLES } from '@/lib/lms/roles'

const navLinks = [
  { href: '/lms', label: 'Courses' },
  { href: '/lms/my-courses', label: 'My Learning' },
  { href: '/lms/wishlist', label: 'Wishlist' },
  { href: '/lms/certificates', label: 'Certificates' },
]

function Header() {
  const pathname = usePathname()
  const [role, setRole] = useState<string | null>(null)
  const [isLoggedIn, setIsLoggedIn] = useState(false)

  useEffect(() => {
    const check = async () => {
      try {
        const res = await fetch('/api/auth/me')
        if (res.ok) {
          const user = await res.json()
          setRole(user?.role)
          setIsLoggedIn(true)
        }
      } catch {}
    }
    check()
  }, [])

  const isStudent = role === ROLES.USER || role === null
  const isInstructor = role === ROLES.INSTRUCTOR

  const instructorLinks = [
    { href: '/lms/instructor/dashboard', label: 'Dashboard' },
    { href: '/lms/instructor/courses', label: 'Courses' },
    { href: '/lms', label: 'LMS Catalog' },
  ]

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 backdrop-blur-2xl bg-black/50 border-b border-white/5 shadow-2xl shadow-black/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center gap-6">
            <Link href="/" className="flex items-center space-x-2 shrink-0">
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
            <nav className="hidden md:flex items-center gap-5">
              {(isStudent ? navLinks : isInstructor ? instructorLinks : []).map(link => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`text-sm transition-colors ${
                    pathname === link.href || pathname.startsWith(link.href + '/')
                      ? 'text-white font-medium'
                      : 'text-gray-400 hover:text-white'
                  }`}
                >
                  {link.label}
                </Link>
              ))}
            </nav>
          </div>
          
          <div className="flex items-center space-x-4">
            {isLoggedIn ? (
              <>
                <NotificationBell />
                <ProfileDropdown />
              </>
            ) : (
              <Link
                href="/login"
                className="px-5 py-2 bg-blue-600 hover:bg-blue-500 text-white text-sm font-medium rounded-xl transition-all"
              >
                Sign In
              </Link>
            )}
          </div>
        </div>
      </div>
    </nav>
  )
}

export default Header