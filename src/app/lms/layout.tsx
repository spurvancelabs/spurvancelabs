'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { ROLES, type Role } from '@/lib/lms/roles'
import "@/global.css"

type NavVisibility = 'guest' | Role

interface NavItem {
  href: string
  label: string
  roles: NavVisibility[]
}

const navItems: NavItem[] = [
  { href: '/lms', label: 'Courses', roles: ['guest', ROLES.USER, ROLES.INSTRUCTOR, ROLES.ADMIN] },
  { href: '/lms/my-courses', label: 'My Learning', roles: [ROLES.USER, ROLES.ADMIN] },
  { href: '/lms/wishlist', label: 'Wishlist', roles: [ROLES.USER, ROLES.ADMIN] },
  { href: '/lms/certificates', label: 'Certificates', roles: [ROLES.USER, ROLES.ADMIN] },
  { href: '/lms/instructor/dashboard', label: 'Instructor', roles: [ROLES.INSTRUCTOR, ROLES.ADMIN] },
  { href: '/lms/profile', label: 'Profile', roles: [ROLES.USER, ROLES.INSTRUCTOR, ROLES.ADMIN] },
  { href: '/dashboard', label: 'Dashboard', roles: [ROLES.USER, ROLES.INSTRUCTOR, ROLES.ADMIN] },
]

export default function LMSLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const [scrolled, setScrolled] = useState(false)
  const [role, setRole] = useState<NavVisibility>('guest')

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const res = await fetch('/api/auth/me')
        if (res.ok) {
          const user = await res.json()
          setRole(user?.role || ROLES.USER)
        } else {
          setRole('guest')
        }
      } catch {
        setRole('guest')
      }
    }
    checkAuth()
  }, [])

  const isAdmin = pathname.startsWith('/lms/admin')
  const visibleNav = navItems.filter(item => item.roles.includes(role))

  if (isAdmin) {
    return <>{children}</>
  }

  return (
    <div className="min-h-screen bg-black">
      <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled ? 'bg-zinc-950/90 backdrop-blur-xl border-b border-white/[0.06]' : 'bg-transparent'}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <Link href="/lms" className="flex items-center gap-3">
              <img src="/spurvance-logo-removebg-preview.png" alt="Spurvance" className="w-8 h-8 object-contain" />
              <span className="text-white font-semibold">LMS</span>
            </Link>
            <nav className="flex items-center gap-6">
              {visibleNav.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="text-sm text-gray-400 hover:text-white transition-colors"
                >
                  {item.label}
                </Link>
              ))}
            </nav>
          </div>
        </div>
      </header>
      <div className="pt-16">
        {children}
      </div>
    </div>
  )
}
