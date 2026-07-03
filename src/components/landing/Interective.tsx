'use client'
import React, { useRef, useEffect } from 'react'
import gsap from 'gsap'
import { useGSAP } from '@gsap/react'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import Lenis from 'lenis'

gsap.registerPlugin(ScrollTrigger, useGSAP)

const tabs = ['dashboard', 'analytics', 'reports', 'automation', 'team']

function Interective() {
  const containerRef = useRef<HTMLDivElement>(null)
  const sectionRef = useRef<HTMLElement>(null)
  const panelRefs = useRef<{ [key: string]: HTMLDivElement | null }>({})
  const tabRefs = useRef<{ [key: string]: HTMLDivElement | null }>({})
  const lastIndexRef = useRef(0)

  useEffect(() => {
    const lenis = new Lenis({
      duration: 1,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: 'vertical',
      smoothWheel: true,
    })

    lenis.on('scroll', ScrollTrigger.update)

    gsap.ticker.add((time) => {
      lenis.raf(time * 1000)
    })
    gsap.ticker.lagSmoothing(0)

    return () => {
      lenis.destroy()
      gsap.ticker.lagSmoothing(1)
    }
  }, [])

  useGSAP(() => {
    const section = sectionRef.current
    const container = containerRef.current
    if (!section || !container) return

    const panels = tabs.map(name => panelRefs.current[name]).filter(Boolean)
    const tabElements = tabs.map(name => tabRefs.current[name]).filter(Boolean)

    gsap.set(panels.slice(1), { opacity: 0 })

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: section,
        start: 'top top',
        end: () => `+=${container.offsetHeight * 3}`,
        pin: true,
        scrub: 0,
        anticipatePin: 1,
        onLeave: () => {
          gsap.set(container, { clearProps: 'all' })
        },
        onEnterBack: () => {
          gsap.set(container, { clearProps: 'all' })
        },
      },
      paused: true,
    })

    panels.forEach((panel, i) => {
      if (i === 0) return
      const prev = tabs[i - 1]
      const tabEl = panelRefs.current[prev]

      tl.to(tabEl || panel, {
        opacity: 0,
        duration: 0,
      }, i)

      tl.to(panel, {
        opacity: 1,
        duration: 0,
      }, i)
    })

    tabElements.forEach((t, i) => {
      tl.to(t, {
        color: '#666',
        duration: 0,
      }, i)

      if (tabRefs.current[tabs[i]]) {
        tl.to(tabRefs.current[tabs[i]], {
          color: '#fff',
          duration: 0,
        }, i)
      }
    })

    tl.eventCallback('onUpdate', () => {
      const progress = tl.progress()
      const rawIndex = Math.min(Math.floor(progress * tabs.length), tabs.length - 1)
      const lastIndex = lastIndexRef.current

      let index = rawIndex
      if (rawIndex > lastIndex + 1) {
        index = lastIndex + 1
      } else if (rawIndex < lastIndex - 1) {
        index = lastIndex - 1
      }

      lastIndexRef.current = index
      const current = tabs[index]

      setActiveTab(current)

      tabs.forEach(name => {
        const el = tabRefs.current[name]
        if (!el) return
        el.style.color = name === current ? '#ffffff' : '#666666'
      })
    })
  })

  const [activeTab, setActiveTab] = React.useState(tabs[0])

  const getIconClass = (tabName: string) => {
    const icons = {
      dashboard: 'fa-th-large',
      analytics: 'fa-chart-line',
      reports: 'fa-file-alt',
      automation: 'fa-robot',
      team: 'fa-users'
    }
    return icons[tabName as keyof typeof icons] || 'fa-circle'
  }

  const getSubtitle = (tabName: string) => {
    const subtitles = {
      dashboard: 'Overview & metrics',
      analytics: 'Data & insights',
      reports: 'Custom reports',
      automation: 'Workflow automation',
      team: 'Collaboration'
    }
    return subtitles[tabName as keyof typeof subtitles] || ''
  }

  return (
    <section 
      ref={sectionRef}
      className="py-12 px-4 sm:py-20 sm:px-8 pb-16 sm:pb-24"
    >
      <div className="max-w-[1200px] mx-auto" ref={containerRef}>
        <div className="text-center mb-14" id="header-animation">
          <span className="inline-block text-[#888] text-[0.7rem] uppercase tracking-[0.2em] bg-[#1a1a1a] px-6 py-[0.4rem] rounded-[30px] mb-3 border border-[#2a2a2a]">
            Interactive Tour
          </span>
          <h2 className="text-white text-[2rem] sm:text-[2.4rem] md:text-[3rem] font-bold tracking-[-0.03em] mb-3">
            See it in <span className="bg-gradient-to-br from-[#f0f0f0] to-[#777] bg-clip-text text-transparent">action</span>
          </h2>
          <p className="text-[#666] text-[0.9rem] sm:text-[1.1rem] font-light max-w-[500px] mx-auto">
            Explore our platform&apos;s key features through this interactive demo
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-[240px_1fr] bg-[#0a0a0a] border border-[#1a1a1a] rounded-2xl overflow-hidden min-h-[500px]">
          <div className="bg-[#0a0a0a] p-4 px-3 border-r border-[#1a1a1a] flex flex-row flex-wrap lg:flex-col gap-[0.2rem] lg:border-r lg:border-b-0 border-b border-[#1a1a1a]">
            {tabs.map((tabName, index) => (
              <div 
                key={tabName}
                ref={(el) => { tabRefs.current[tabName] = el }}
                className={`flex items-center gap-3 px-4 py-[0.7rem] rounded-[10px] transition-all duration-300 border border-transparent flex-1 min-w-[80px] lg:min-w-0 lg:flex-row flex-col text-center lg:text-left ${
                  activeTab === tabName
                    ? 'bg-[#1a1a1a] border-[#2a2a2a] shadow-lg shadow-[#7c3aed]/10 text-white' 
                    : 'text-[#666] hover:bg-[#111] hover:border-[#1a1a1a]'
                }`}
                tabIndex={0}
                role="tab"
                aria-selected={activeTab === tabName}
              >
                <div className="hidden lg:block text-[0.6rem] text-[#444] font-mono mr-1">
                  {String(index + 1).padStart(2, '0')}
                </div>
                
                <div className={`w-9 h-9 min-w-9 rounded-[10px] bg-[#1a1a1a] flex items-center justify-center transition-all duration-300 ${
                  activeTab === tabName ? 'bg-gradient-to-br from-[#7c3aed] to-[#22d3ee] shadow-lg' : ''
                }`}>
                  <i className={`fas ${getIconClass(tabName)} text-[1rem] transition-all duration-300 ${
                    activeTab === tabName ? 'text-white' : 'text-[#666]'
                  }`}></i>
                </div>
                <div className="tour-tab-info">
                  <h4 className="text-[0.8rem] font-semibold m-0 transition-all duration-300">
                    {tabName.charAt(0).toUpperCase() + tabName.slice(1)}
                  </h4>
                  <span className="text-[#444] text-[0.6rem] hidden lg:inline">
                    {getSubtitle(tabName)}
                  </span>
                </div>
              </div>
            ))}
          </div>

          <div className="p-3 sm:p-4 overflow-hidden lg:max-h-[600px] relative min-h-[400px]">
            {tabs.map((tabName) => (
              <div 
                key={tabName}
                ref={(el) => { panelRefs.current[tabName] = el }}
                className="absolute inset-0 p-3 sm:p-4"
              >
                {tabName === 'dashboard' && (
                  <div className="block">
                    <div className="mb-4">
                      <h3 className="text-white text-[1.4rem] font-semibold mb-[0.2rem]">Dashboard</h3>
                      <p className="text-[#666] text-[0.9rem] mb-6">Real-time overview of your business performance</p>
                    </div>
                    <div className="tour-panel-body">
                      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-6">
                        {[
                          { label: 'Total Revenue', value: '$124.5K' },
                          { label: 'Active Users', value: '2,847' },
                          { label: 'Engagement Rate', value: '67%' },
                          { label: 'New Signups', value: '183' }
                        ].map((item, index) => (
                          <div key={index} className="bg-[#0a0a0a] border border-[#1a1a1a] rounded-xl p-3 sm:p-5 text-center hover:border-[#2a2a2a] transition-all duration-300 hover:scale-105 hover:shadow-lg">
                            <span className="block text-white text-[1.2rem] sm:text-[1.6rem] font-bold tracking-[-0.02em]">{item.value}</span>
                            <span className="block text-[#666] text-[0.75rem] mt-[0.2rem]">{item.label}</span>
                          </div>
                        ))}
                      </div>
                      <div className="bg-[#0a0a0a] border border-[#1a1a1a] rounded-xl p-6 text-center">
                        <div className="flex items-end justify-center gap-5 h-[120px]">
                          {[40, 65, 80, 55, 90, 70, 45].map((height, index) => (
                            <div 
                              key={index}
                              className="w-[30px] bg-gradient-to-b from-[#7c3aed] to-[#22d3ee] rounded-t transition-all duration-300 min-h-[10px] hover:opacity-70 hover:scale-y-[1.05] hover:origin-bottom"
                              style={{height: `${height}%`}}
                            ></div>
                          ))}
                        </div>
                        <span className="text-[#666] text-[0.7rem] block mt-3">Weekly Performance</span>
                      </div>
                    </div>
                  </div>
                )}

                {tabName === 'analytics' && (
                  <div className="block ">
                    <div className="mb-4">
                      <h3 className="text-white text-[1.4rem] font-semibold mb-[0.2rem]">Analytics</h3>
                      <p className="text-[#666] text-[0.9rem] mb-6">Deep insights into your data and user behavior</p>
                    </div>
                    <div className="tour-panel-body ">
                      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-6">
                        {[
                          { label: 'Page Views', value: '42.8K' },
                          { label: 'Avg Session', value: '3.2min' },
                          { label: 'Bounce Rate', value: '24.7%' },
                          { label: 'Unique Visitors', value: '18.9K' }
                        ].map((item, index) => (
                          <div key={index} className="bg-[#0a0a0a] border border-[#1a1a1a] rounded-xl p-4 sm:p-5 text-center hover:border-[#2a2a2a] transition-all duration-300 hover:scale-105 hover:shadow-lg">
                            <span className="block text-white text-[1.2rem] sm:text-[1.4rem] font-bold">{item.value}</span>
                            <span className="text-[#666] text-[0.75rem]">{item.label}</span>
                          </div>
                        ))}
                      </div>
                      <div className="flex justify-center p-6">
                        <div className="w-[150px] h-[150px] rounded-full border-[12px] border-[#1a1a1a] border-t-[#7c3aed] border-r-[#22d3ee] flex flex-col items-center justify-center animate-[spin_8s_linear_infinite] hover:scale-110 transition-all duration-300">
                          <span className="text-white text-[1.8rem] font-bold">67%</span>
                          <span className="text-[#666] text-[0.7rem]">Conversion Rate</span>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {tabName === 'reports' && (
                  <div className="block">
                    <div className="mb-4">
                      <h3 className="text-white text-[1.4rem] font-semibold mb-[0.2rem]">Reports</h3>
                      <p className="text-[#666] text-[0.9rem] mb-6">Generate and customize detailed reports</p>
                    </div>
                    <div className="tour-panel-body">
                      <div className="flex flex-col gap-3">
                        {[
                          { icon: 'fa-file-pdf', title: 'Monthly Performance Report', date: 'Today, 10:30 AM' },
                          { icon: 'fa-file-excel', title: 'Revenue Breakdown Q2', date: 'Yesterday, 4:15 PM' },
                          { icon: 'fa-file-alt', title: 'User Engagement Analysis', date: '2 days ago' },
                          { icon: 'fa-file-pdf', title: 'Annual Summary 2024', date: 'Dec 31, 2024' }
                        ].map((item, index) => (
                          <div key={index} className="flex items-center gap-4 p-4 px-5 bg-[#0a0a0a] border border-[#1a1a1a] rounded-[10px] transition-all duration-300 hover:border-[#2a2a2a] hover:translate-x-2 hover:shadow-lg">
                            <i className={`fas ${item.icon} text-[#666] text-[1.4rem]`}></i>
                            <div className="flex-1">
                              <h4 className="text-white text-[0.9rem] font-medium m-0">{item.title}</h4>
                              <span className="text-[#444] text-[0.7rem]">Generated: {item.date}</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {tabName === 'automation' && (
                  <div className="block">
                    <div className="mb-4">
                      <h3 className="text-white text-[1.4rem] font-semibold mb-[0.2rem]">Automation</h3>
                      <p className="text-[#666] text-[0.9rem] mb-6">Streamline your workflows with automation rules</p>
                    </div>
                    <div className="tour-panel-body">
                      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                        {[
                          { icon: 'fa-envelope', title: 'Email Sequences', desc: 'Automated email campaigns triggered by user actions' },
                          { icon: 'fa-credit-card', title: 'Payment Processing', desc: 'Auto-invoice and payment reminder workflows' },
                          { icon: 'fa-user-plus', title: 'User Onboarding', desc: 'Welcome emails, tutorials, and follow-up sequences' },
                          { icon: 'fa-bell', title: 'Alert Notifications', desc: 'Real-time alerts for system events and anomalies' }
                        ].map((item, index) => (
                          <div key={index} className="bg-[#0a0a0a] border border-[#1a1a1a] rounded-xl p-6 text-center hover:border-[#2a2a2a] transition-all duration-300 hover:scale-105 hover:shadow-lg">
                            <div className="w-[50px] h-[50px] rounded-xl bg-[#1a1a1a] flex items-center justify-center mx-auto mb-3">
                              <i className={`fas ${item.icon} text-[#666] text-[1.3rem]`}></i>
                            </div>
                            <h4 className="text-white text-[1rem] font-semibold mb-[0.3rem]">{item.title}</h4>
                            <p className="text-[#666] text-[0.8rem] leading-[1.5]">{item.desc}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {tabName === 'team' && (
                  <div className="block">
                    <div className="mb-4">
                      <h3 className="text-white text-[1.4rem] font-semibold mb-[0.2rem]">Team</h3>
                      <p className="text-[#666] text-[0.9rem] mb-6">Manage your team members and permissions</p>
                    </div>
                    <div className="tour-panel-body">
                      <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
                        {[
                          { name: 'John Doe', role: 'CEO & Founder', initials: 'JD', color: '#7c3aed' },
                          { name: 'Sarah Chen', role: 'CTO', initials: 'SC', color: '#22d3ee' },
                          { name: 'Mike Johnson', role: 'Lead Developer', initials: 'MJ', color: '#f59e0b' },
                          { name: 'Emily Davis', role: 'Product Designer', initials: 'ED', color: '#ec4899' },
                          { name: 'David Wilson', role: 'Marketing Lead', initials: 'DW', color: '#34d399' },
                          { name: 'Lisa Park', role: 'UX Researcher', initials: 'LP', color: '#8b5cf6' }
                        ].map((member, index) => (
                          <div key={index} className="flex items-center gap-4 p-3 px-4 bg-[#0a0a0a] border border-[#1a1a1a] rounded-[10px] transition-all duration-300 hover:border-[#2a2a2a] hover:translate-x-2 hover:shadow-lg">
                            <div className="w-10 h-10 rounded-full flex items-center justify-center text-white text-[0.8rem] font-semibold transition-all duration-300 hover:scale-110" style={{background: member.color}}>
                              {member.initials}
                            </div>
                            <div className="flex-1">
                              <h4 className="text-white text-[0.9rem] font-medium m-0">{member.name}</h4>
                              <span className="text-[#666] text-[0.7rem]">{member.role}</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

export default Interective
