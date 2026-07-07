'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

const icons: Record<string, React.ReactNode> = {
  dashboard: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3.75 6A2.25 2.25 0 016 3.75h2.25A2.25 2.25 0 0110.5 6v2.25a2.25 2.25 0 01-2.25 2.25H6a2.25 2.25 0 01-2.25-2.25V6zM3.75 15.75A2.25 2.25 0 016 13.5h2.25a2.25 2.25 0 012.25 2.25V18a2.25 2.25 0 01-2.25 2.25H6A2.25 2.25 0 013.75 18v-2.25zM13.5 6a2.25 2.25 0 012.25-2.25H18A2.25 2.25 0 0120.25 6v2.25A2.25 2.25 0 0118 10.5h-2.25a2.25 2.25 0 01-2.25-2.25V6zM13.5 15.75a2.25 2.25 0 012.25-2.25H18a2.25 2.25 0 012.25 2.25V18A2.25 2.25 0 0118 20.25h-2.25A2.25 2.25 0 0113.5 18v-2.25z" /></svg>,
  courses: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25" /></svg>,
  enrollments: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z" /></svg>,
}

interface NavItem {
  href: string
  label: string
  icon: keyof typeof icons
}

const navItems: NavItem[] = [
  { href: '/lms/instructor/dashboard', label: 'Dashboard', icon: 'dashboard' },
  { href: '/lms/instructor/courses', label: 'Courses', icon: 'courses' },
  { href: '/lms/instructor/enrollments', label: 'Enrollments', icon: 'enrollments' },
]

export default function InstructorSidebar() {
  const pathname = usePathname()
  const [menuOpen, setMenuOpen] = useState(false)

  useEffect(() => {
    if (menuOpen) document.body.style.overflow = 'hidden'
    else document.body.style.overflow = ''
    return () => { document.body.style.overflow = '' }
  }, [menuOpen])

  const close = () => setMenuOpen(false)

  return (
    <>
      <button
        onClick={() => setMenuOpen(!menuOpen)}
        className="fixed top-4 left-4 z-50 lg:hidden p-2 rounded-lg bg-black border border-white/10 text-white"
      >
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          {menuOpen ? (
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          ) : (
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          )}
        </svg>
      </button>

      {menuOpen && <div className="fixed inset-0 bg-black/50 z-30 lg:hidden" onClick={close} />}

      <aside className={`fixed left-0 top-0 h-screen w-64 bg-zinc-950 border-r border-white/[0.06] flex flex-col z-40 transition-transform duration-200 ${menuOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0`}>
        <div className="p-5 border-b border-white/[0.06]">
          <Link href="/lms/instructor/dashboard" className="flex items-center gap-3" onClick={close}>
            <img src="/spurvance-logo-removebg-preview.png" alt="Spurvance" className="w-8 h-8 object-contain" />
            <div>
              <span className="text-white text-sm font-semibold block leading-tight">Instructor</span>
              <span className="text-[10px] text-gray-500">Course Management</span>
            </div>
          </Link>
        </div>

        <nav className="flex-1 overflow-y-auto p-3 space-y-1">
          {navItems.map((item) => {
            const active = pathname === item.href || pathname.startsWith(item.href + '/')
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={close}
                className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-all ${
                  active ? 'bg-amber-500/10 text-amber-400 font-medium' : 'text-gray-400 hover:text-white hover:bg-white/5'
                }`}
              >
                <span className="shrink-0">{icons[item.icon]}</span>
                <span>{item.label}</span>
              </Link>
            )
          })}
        </nav>

        <div className="p-3 border-t border-white/[0.06] space-y-1">
          <Link
            href="/lms"
            onClick={close}
            className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-gray-400 hover:text-white hover:bg-white/5 transition-all"
          >
            <svg className="w-5 h-5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M10.5 19.5h3m-6.75 2.25h10.5a2.25 2.25 0 002.25-2.25v-2.25m-8.25 2.25V9m0 0l-3 3m3-3l3 3M3.75 12.75V5.25A2.25 2.25 0 016 3h12a2.25 2.25 0 012.25 2.25v7.5" />
            </svg>
            Back to LMS
          </Link>
        </div>
      </aside>
    </>
  )
}
