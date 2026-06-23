'use client'
import React, { useState, useEffect, useRef } from 'react'

function Interective() {
  const [activeTab, setActiveTab] = useState('dashboard')
  const tabRefs = useRef<{ [key: string]: HTMLDivElement | null }>({})

  // Define tab panels with their content
  const panels = {
    dashboard: {
      title: "Dashboard",
      subtitle: "Real-time overview of your business performance",
      // ... content
    },
    analytics: {
      title: "Analytics",
      subtitle: "Deep insights into your data and user behavior",
      // ... content
    },
    // ... other tabs
  }

  // Handle tab switching
  const handleTabClick = (tabName: string) => {
    setActiveTab(tabName)
  }

  // Keyboard navigation
  useEffect(() => {
    const tabs = ['dashboard', 'analytics', 'reports', 'automation', 'team']
    
    const handleKeyDown = (e: KeyboardEvent) => {
      const currentIndex = tabs.indexOf(activeTab)
      let newIndex = currentIndex

      if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
        e.preventDefault()
        newIndex = (currentIndex + 1) % tabs.length
      } else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
        e.preventDefault()
        newIndex = (currentIndex - 1 + tabs.length) % tabs.length
      }

      if (newIndex !== currentIndex) {
        setActiveTab(tabs[newIndex])
        // Focus the new tab
        tabRefs.current[tabs[newIndex]]?.focus()
      }
    }

    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [activeTab])

  // Helper to check if a tab is active
  const isActive = (tabName: string) => activeTab === tabName

  return (
    <section className=" py-20 px-8 pb-24 border-t border-[#1a1a1a] overflow-hidden">
      <div className="max-w-[1200px] mx-auto">
        <div className="text-center mb-14">
          <span className="inline-block text-[#888] text-[0.7rem] uppercase tracking-[0.2em] bg-[#1a1a1a] px-6 py-[0.4rem] rounded-[30px] mb-3 border border-[#2a2a2a]">
            Interactive Tour
          </span>
          <h2 className="text-white text-[3rem] font-bold tracking-[-0.03em] mb-3">
            See it in <span className="bg-gradient-to-br from-[#f0f0f0] to-[#777] bg-clip-text text-transparent">action</span>
          </h2>
          <p className="text-[#666] text-[1.1rem] font-light max-w-[500px] mx-auto">
            Explore our platform's key features through this interactive demo
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-[240px_1fr] gap-8 bg-[#0a0a0a] border border-[#1a1a1a] rounded-2xl overflow-hidden min-h-[500px] relative">
          {/* Sidebar Tabs */}
          <div className="bg-[#0a0a0a] p-6 px-4 border-r border-[#1a1a1a] flex flex-row flex-wrap lg:flex-col gap-[0.3rem] lg:border-r lg:border-b-0 border-b border-[#1a1a1a]">
            <div 
              className={`flex items-center gap-4 px-5 py-[0.9rem] rounded-[10px] cursor-pointer transition-[0.3s_ease] border border-transparent flex-1 min-w-[100px] lg:min-w-0 lg:flex-row flex-col text-center lg:text-left ${isActive('dashboard') ? 'bg-[#1a1a1a] border-[#2a2a2a]' : 'hover:bg-[#111] hover:border-[#1a1a1a]'}`}
              onClick={() => handleTabClick('dashboard')}
              ref={(el) => { tabRefs.current['dashboard'] = el }}
              tabIndex={0}
              role="tab"
              aria-selected={isActive('dashboard')}
            >
              <div className={`w-10 h-10 min-w-10 rounded-[10px] bg-[#1a1a1a] flex items-center justify-center transition-[0.3s_ease] ${isActive('dashboard') ? 'bg-[#2a2a2a]' : ''}`}>
                <i className={`fas fa-th-large text-[1.1rem] transition-[0.3s_ease] ${isActive('dashboard') ? 'text-white' : 'text-[#666]'}`}></i>
              </div>
              <div className="tour-tab-info">
                <h4 className={`text-[0.9rem] font-semibold m-0 transition-[0.3s_ease] ${isActive('dashboard') ? 'text-white' : 'text-[#666]'}`}>Dashboard</h4>
                <span className="text-[#444] text-[0.7rem] hidden lg:inline">Overview & metrics</span>
              </div>
            </div>

            <div 
              className={`flex items-center gap-4 px-5 py-[0.9rem] rounded-[10px] cursor-pointer transition-[0.3s_ease] border border-transparent flex-1 min-w-[100px] lg:min-w-0 lg:flex-row flex-col text-center lg:text-left ${isActive('analytics') ? 'bg-[#1a1a1a] border-[#2a2a2a]' : 'hover:bg-[#111] hover:border-[#1a1a1a]'}`}
              onClick={() => handleTabClick('analytics')}
              ref={(el) => { tabRefs.current['analytics'] = el }}
              tabIndex={0}
              role="tab"
              aria-selected={isActive('analytics')}
            >
              <div className={`w-10 h-10 min-w-10 rounded-[10px] bg-[#1a1a1a] flex items-center justify-center transition-[0.3s_ease] ${isActive('analytics') ? 'bg-[#2a2a2a]' : ''}`}>
                <i className={`fas fa-chart-line text-[1.1rem] transition-[0.3s_ease] ${isActive('analytics') ? 'text-white' : 'text-[#666]'}`}></i>
              </div>
              <div className="tour-tab-info">
                <h4 className={`text-[0.9rem] font-semibold m-0 transition-[0.3s_ease] ${isActive('analytics') ? 'text-white' : 'text-[#666]'}`}>Analytics</h4>
                <span className="text-[#444] text-[0.7rem] hidden lg:inline">Data & insights</span>
              </div>
            </div>

            <div 
              className={`flex items-center gap-4 px-5 py-[0.9rem] rounded-[10px] cursor-pointer transition-[0.3s_ease] border border-transparent flex-1 min-w-[100px] lg:min-w-0 lg:flex-row flex-col text-center lg:text-left ${isActive('reports') ? 'bg-[#1a1a1a] border-[#2a2a2a]' : 'hover:bg-[#111] hover:border-[#1a1a1a]'}`}
              onClick={() => handleTabClick('reports')}
              ref={(el) => { tabRefs.current['reports'] = el }}
              tabIndex={0}
              role="tab"
              aria-selected={isActive('reports')}
            >
              <div className={`w-10 h-10 min-w-10 rounded-[10px] bg-[#1a1a1a] flex items-center justify-center transition-[0.3s_ease] ${isActive('reports') ? 'bg-[#2a2a2a]' : ''}`}>
                <i className={`fas fa-file-alt text-[1.1rem] transition-[0.3s_ease] ${isActive('reports') ? 'text-white' : 'text-[#666]'}`}></i>
              </div>
              <div className="tour-tab-info">
                <h4 className={`text-[0.9rem] font-semibold m-0 transition-[0.3s_ease] ${isActive('reports') ? 'text-white' : 'text-[#666]'}`}>Reports</h4>
                <span className="text-[#444] text-[0.7rem] hidden lg:inline">Custom reports</span>
              </div>
            </div>

            <div 
              className={`flex items-center gap-4 px-5 py-[0.9rem] rounded-[10px] cursor-pointer transition-[0.3s_ease] border border-transparent flex-1 min-w-[100px] lg:min-w-0 lg:flex-row flex-col text-center lg:text-left ${isActive('automation') ? 'bg-[#1a1a1a] border-[#2a2a2a]' : 'hover:bg-[#111] hover:border-[#1a1a1a]'}`}
              onClick={() => handleTabClick('automation')}
              ref={(el) => { tabRefs.current['automation'] = el }}
              tabIndex={0}
              role="tab"
              aria-selected={isActive('automation')}
            >
              <div className={`w-10 h-10 min-w-10 rounded-[10px] bg-[#1a1a1a] flex items-center justify-center transition-[0.3s_ease] ${isActive('automation') ? 'bg-[#2a2a2a]' : ''}`}>
                <i className={`fas fa-robot text-[1.1rem] transition-[0.3s_ease] ${isActive('automation') ? 'text-white' : 'text-[#666]'}`}></i>
              </div>
              <div className="tour-tab-info">
                <h4 className={`text-[0.9rem] font-semibold m-0 transition-[0.3s_ease] ${isActive('automation') ? 'text-white' : 'text-[#666]'}`}>Automation</h4>
                <span className="text-[#444] text-[0.7rem] hidden lg:inline">Workflow automation</span>
              </div>
            </div>

            <div 
              className={`flex items-center gap-4 px-5 py-[0.9rem] rounded-[10px] cursor-pointer transition-[0.3s_ease] border border-transparent flex-1 min-w-[100px] lg:min-w-0 lg:flex-row flex-col text-center lg:text-left ${isActive('team') ? 'bg-[#1a1a1a] border-[#2a2a2a]' : 'hover:bg-[#111] hover:border-[#1a1a1a]'}`}
              onClick={() => handleTabClick('team')}
              ref={(el) => { tabRefs.current['team'] = el }}
              tabIndex={0}
              role="tab"
              aria-selected={isActive('team')}
            >
              <div className={`w-10 h-10 min-w-10 rounded-[10px] bg-[#1a1a1a] flex items-center justify-center transition-[0.3s_ease] ${isActive('team') ? 'bg-[#2a2a2a]' : ''}`}>
                <i className={`fas fa-users text-[1.1rem] transition-[0.3s_ease] ${isActive('team') ? 'text-white' : 'text-[#666]'}`}></i>
              </div>
              <div className="tour-tab-info">
                <h4 className={`text-[0.9rem] font-semibold m-0 transition-[0.3s_ease] ${isActive('team') ? 'text-white' : 'text-[#666]'}`}>Team</h4>
                <span className="text-[#444] text-[0.7rem] hidden lg:inline">Collaboration</span>
              </div>
            </div>
          </div>

          {/* Main Content Area */}
          <div className="p-4 overflow-y-auto lg:max-h-[600px]">
            {/* Dashboard Panel */}
            {isActive('dashboard') && (
              <div className="block animate-[fadeIn_0.4s_ease]">
                <div className="mb-4">
                  <h3 className="text-white text-[1.4rem] font-semibold mb-[0.2rem]">Dashboard</h3>
                  <p className="text-[#666] text-[0.9rem] mb-6">Real-time overview of your business performance</p>
                </div>
                <div className="tour-panel-body">
                  <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                    <div className="bg-[#0a0a0a] border border-[#1a1a1a] rounded-xl p-5 text-center">
                      <span className="block text-white text-[1.6rem] font-bold tracking-[-0.02em]">$124.5K</span>
                      <span className="block text-[#666] text-[0.75rem] mt-[0.2rem]">Total Revenue</span>
                    </div>
                    <div className="bg-[#0a0a0a] border border-[#1a1a1a] rounded-xl p-5 text-center">
                      <span className="block text-white text-[1.6rem] font-bold tracking-[-0.02em]">2,847</span>
                      <span className="block text-[#666] text-[0.75rem] mt-[0.2rem]">Active Users</span>
                    </div>
                    <div className="bg-[#0a0a0a] border border-[#1a1a1a] rounded-xl p-5 text-center">
                      <span className="block text-white text-[1.6rem] font-bold tracking-[-0.02em]">67%</span>
                      <span className="block text-[#666] text-[0.75rem] mt-[0.2rem]">Engagement Rate</span>
                    </div>
                    <div className="bg-[#0a0a0a] border border-[#1a1a1a] rounded-xl p-5 text-center">
                      <span className="block text-white text-[1.6rem] font-bold tracking-[-0.02em]">183</span>
                      <span className="block text-[#666] text-[0.75rem] mt-[0.2rem]">New Signups</span>
                    </div>
                  </div>
                  <div className="bg-[#0a0a0a] border border-[#1a1a1a] rounded-xl p-6 text-center">
                    <div className="flex items-end justify-center gap-5 h-[120px]">
                      <div className="w-[30px] bg-gradient-to-b from-[#7c3aed] to-[#22d3ee] rounded-t transition-[0.3s_ease] min-h-[10px] hover:opacity-70 hover:scale-y-[1.05] hover:origin-bottom" style={{height: '40%'}}></div>
                      <div className="w-[30px] bg-gradient-to-b from-[#7c3aed] to-[#22d3ee] rounded-t transition-[0.3s_ease] min-h-[10px] hover:opacity-70 hover:scale-y-[1.05] hover:origin-bottom" style={{height: '65%'}}></div>
                      <div className="w-[30px] bg-gradient-to-b from-[#7c3aed] to-[#22d3ee] rounded-t transition-[0.3s_ease] min-h-[10px] hover:opacity-70 hover:scale-y-[1.05] hover:origin-bottom" style={{height: '80%'}}></div>
                      <div className="w-[30px] bg-gradient-to-b from-[#7c3aed] to-[#22d3ee] rounded-t transition-[0.3s_ease] min-h-[10px] hover:opacity-70 hover:scale-y-[1.05] hover:origin-bottom" style={{height: '55%'}}></div>
                      <div className="w-[30px] bg-gradient-to-b from-[#7c3aed] to-[#22d3ee] rounded-t transition-[0.3s_ease] min-h-[10px] hover:opacity-70 hover:scale-y-[1.05] hover:origin-bottom" style={{height: '90%'}}></div>
                      <div className="w-[30px] bg-gradient-to-b from-[#7c3aed] to-[#22d3ee] rounded-t transition-[0.3s_ease] min-h-[10px] hover:opacity-70 hover:scale-y-[1.05] hover:origin-bottom" style={{height: '70%'}}></div>
                      <div className="w-[30px] bg-gradient-to-b from-[#7c3aed] to-[#22d3ee] rounded-t transition-[0.3s_ease] min-h-[10px] hover:opacity-70 hover:scale-y-[1.05] hover:origin-bottom" style={{height: '45%'}}></div>
                    </div>
                    <span className="text-[#666] text-[0.7rem] block mt-3">Weekly Performance</span>
                  </div>
                </div>
              </div>
            )}

            {/* Analytics Panel */}
            {isActive('analytics') && (
              <div className="block animate-[fadeIn_0.4s_ease]">
                <div className="mb-4">
                  <h3 className="text-white text-[1.4rem] font-semibold mb-[0.2rem]">Analytics</h3>
                  <p className="text-[#666] text-[0.9rem] mb-6">Deep insights into your data and user behavior</p>
                </div>
                <div className="tour-panel-body">
                  <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                    <div className="bg-[#0a0a0a] border border-[#1a1a1a] rounded-xl p-5 text-center">
                      <span className="block text-white text-[1.4rem] font-bold">42.8K</span>
                      <span className="text-[#666] text-[0.75rem]">Page Views</span>
                    </div>
                    <div className="bg-[#0a0a0a] border border-[#1a1a1a] rounded-xl p-5 text-center">
                      <span className="block text-white text-[1.4rem] font-bold">3.2min</span>
                      <span className="text-[#666] text-[0.75rem]">Avg Session</span>
                    </div>
                    <div className="bg-[#0a0a0a] border border-[#1a1a1a] rounded-xl p-5 text-center">
                      <span className="block text-white text-[1.4rem] font-bold">24.7%</span>
                      <span className="text-[#666] text-[0.75rem]">Bounce Rate</span>
                    </div>
                    <div className="bg-[#0a0a0a] border border-[#1a1a1a] rounded-xl p-5 text-center">
                      <span className="block text-white text-[1.4rem] font-bold">18.9K</span>
                      <span className="text-[#666] text-[0.75rem]">Unique Visitors</span>
                    </div>
                  </div>
                  <div className="flex justify-center p-6">
                    <div className="w-[150px] h-[150px] rounded-full border-[12px] border-[#1a1a1a] border-t-[#7c3aed] border-r-[#22d3ee] flex flex-col items-center justify-center animate-[spin_8s_linear_infinite]">
                      <span className="text-white text-[1.8rem] font-bold">67%</span>
                      <span className="text-[#666] text-[0.7rem]">Conversion Rate</span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Reports Panel */}
            {isActive('reports') && (
              <div className="block animate-[fadeIn_0.4s_ease]">
                <div className="mb-4">
                  <h3 className="text-white text-[1.4rem] font-semibold mb-[0.2rem]">Reports</h3>
                  <p className="text-[#666] text-[0.9rem] mb-6">Generate and customize detailed reports</p>
                </div>
                <div className="tour-panel-body">
                  <div className="flex flex-col gap-3">
                    <div className="flex items-center gap-4 p-4 px-5 bg-[#0a0a0a] border border-[#1a1a1a] rounded-[10px] transition-[0.3s_ease] hover:border-[#2a2a2a]">
                      <i className="fas fa-file-pdf text-[#666] text-[1.4rem]"></i>
                      <div className="flex-1">
                        <h4 className="text-white text-[0.9rem] font-medium m-0">Monthly Performance Report</h4>
                        <span className="text-[#444] text-[0.7rem]">Generated: Today, 10:30 AM</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-4 p-4 px-5 bg-[#0a0a0a] border border-[#1a1a1a] rounded-[10px] transition-[0.3s_ease] hover:border-[#2a2a2a]">
                      <i className="fas fa-file-excel text-[#666] text-[1.4rem]"></i>
                      <div className="flex-1">
                        <h4 className="text-white text-[0.9rem] font-medium m-0">Revenue Breakdown Q2</h4>
                        <span className="text-[#444] text-[0.7rem]">Generated: Yesterday, 4:15 PM</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-4 p-4 px-5 bg-[#0a0a0a] border border-[#1a1a1a] rounded-[10px] transition-[0.3s_ease] hover:border-[#2a2a2a]">
                      <i className="fas fa-file-alt text-[#666] text-[1.4rem]"></i>
                      <div className="flex-1">
                        <h4 className="text-white text-[0.9rem] font-medium m-0">User Engagement Analysis</h4>
                        <span className="text-[#444] text-[0.7rem]">Generated: 2 days ago</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-4 p-4 px-5 bg-[#0a0a0a] border border-[#1a1a1a] rounded-[10px] transition-[0.3s_ease] hover:border-[#2a2a2a]">
                      <i className="fas fa-file-pdf text-[#666] text-[1.4rem]"></i>
                      <div className="flex-1">
                        <h4 className="text-white text-[0.9rem] font-medium m-0">Annual Summary 2024</h4>
                        <span className="text-[#444] text-[0.7rem]">Generated: Dec 31, 2024</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Automation Panel */}
            {isActive('automation') && (
              <div className="block animate-[fadeIn_0.4s_ease]">
                <div className="mb-4">
                  <h3 className="text-white text-[1.4rem] font-semibold mb-[0.2rem]">Automation</h3>
                  <p className="text-[#666] text-[0.9rem] mb-6">Streamline your workflows with automation rules</p>
                </div>
                <div className="tour-panel-body">
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                    <div className="bg-[#0a0a0a] border border-[#1a1a1a] rounded-xl p-6 text-center">
                      <div className="w-[50px] h-[50px] rounded-xl bg-[#1a1a1a] flex items-center justify-center mx-auto mb-3">
                        <i className="fas fa-envelope text-[#666] text-[1.3rem]"></i>
                      </div>
                      <h4 className="text-white text-[1rem] font-semibold mb-[0.3rem]">Email Sequences</h4>
                      <p className="text-[#666] text-[0.8rem] leading-[1.5]">Automated email campaigns triggered by user actions</p>
                    </div>
                    <div className="bg-[#0a0a0a] border border-[#1a1a1a] rounded-xl p-6 text-center">
                      <div className="w-[50px] h-[50px] rounded-xl bg-[#1a1a1a] flex items-center justify-center mx-auto mb-3">
                        <i className="fas fa-credit-card text-[#666] text-[1.3rem]"></i>
                      </div>
                      <h4 className="text-white text-[1rem] font-semibold mb-[0.3rem]">Payment Processing</h4>
                      <p className="text-[#666] text-[0.8rem] leading-[1.5]">Auto-invoice and payment reminder workflows</p>
                    </div>
                    <div className="bg-[#0a0a0a] border border-[#1a1a1a] rounded-xl p-6 text-center">
                      <div className="w-[50px] h-[50px] rounded-xl bg-[#1a1a1a] flex items-center justify-center mx-auto mb-3">
                        <i className="fas fa-user-plus text-[#666] text-[1.3rem]"></i>
                      </div>
                      <h4 className="text-white text-[1rem] font-semibold mb-[0.3rem]">User Onboarding</h4>
                      <p className="text-[#666] text-[0.8rem] leading-[1.5]">Welcome emails, tutorials, and follow-up sequences</p>
                    </div>
                    <div className="bg-[#0a0a0a] border border-[#1a1a1a] rounded-xl p-6 text-center">
                      <div className="w-[50px] h-[50px] rounded-xl bg-[#1a1a1a] flex items-center justify-center mx-auto mb-3">
                        <i className="fas fa-bell text-[#666] text-[1.3rem]"></i>
                      </div>
                      <h4 className="text-white text-[1rem] font-semibold mb-[0.3rem]">Alert Notifications</h4>
                      <p className="text-[#666] text-[0.8rem] leading-[1.5]">Real-time alerts for system events and anomalies</p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Team Panel */}
            {isActive('team') && (
              <div className="block animate-[fadeIn_0.4s_ease]">
                <div className="mb-4">
                  <h3 className="text-white text-[1.4rem] font-semibold mb-[0.2rem]">Team</h3>
                  <p className="text-[#666] text-[0.9rem] mb-6">Manage your team members and permissions</p>
                </div>
                <div className="tour-panel-body">
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
                    <div className="flex items-center gap-4 p-3 px-4 bg-[#0a0a0a] border border-[#1a1a1a] rounded-[10px] transition-[0.3s_ease] hover:border-[#2a2a2a]">
                      <div className="w-10 h-10 rounded-full flex items-center justify-center text-white text-[0.8rem] font-semibold" style={{background: '#7c3aed'}}>JD</div>
                      <div className="flex-1">
                        <h4 className="text-white text-[0.9rem] font-medium m-0">John Doe</h4>
                        <span className="text-[#666] text-[0.7rem]">CEO & Founder</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-4 p-3 px-4 bg-[#0a0a0a] border border-[#1a1a1a] rounded-[10px] transition-[0.3s_ease] hover:border-[#2a2a2a]">
                      <div className="w-10 h-10 rounded-full flex items-center justify-center text-white text-[0.8rem] font-semibold" style={{background: '#22d3ee'}}>SC</div>
                      <div className="flex-1">
                        <h4 className="text-white text-[0.9rem] font-medium m-0">Sarah Chen</h4>
                        <span className="text-[#666] text-[0.7rem]">CTO</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-4 p-3 px-4 bg-[#0a0a0a] border border-[#1a1a1a] rounded-[10px] transition-[0.3s_ease] hover:border-[#2a2a2a]">
                      <div className="w-10 h-10 rounded-full flex items-center justify-center text-white text-[0.8rem] font-semibold" style={{background: '#f59e0b'}}>MJ</div>
                      <div className="flex-1">
                        <h4 className="text-white text-[0.9rem] font-medium m-0">Mike Johnson</h4>
                        <span className="text-[#666] text-[0.7rem]">Lead Developer</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-4 p-3 px-4 bg-[#0a0a0a] border border-[#1a1a1a] rounded-[10px] transition-[0.3s_ease] hover:border-[#2a2a2a]">
                      <div className="w-10 h-10 rounded-full flex items-center justify-center text-white text-[0.8rem] font-semibold" style={{background: '#ec4899'}}>ED</div>
                      <div className="flex-1">
                        <h4 className="text-white text-[0.9rem] font-medium m-0">Emily Davis</h4>
                        <span className="text-[#666] text-[0.7rem]">Product Designer</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-4 p-3 px-4 bg-[#0a0a0a] border border-[#1a1a1a] rounded-[10px] transition-[0.3s_ease] hover:border-[#2a2a2a]">
                      <div className="w-10 h-10 rounded-full flex items-center justify-center text-white text-[0.8rem] font-semibold" style={{background: '#34d399'}}>DW</div>
                      <div className="flex-1">
                        <h4 className="text-white text-[0.9rem] font-medium m-0">David Wilson</h4>
                        <span className="text-[#666] text-[0.7rem]">Marketing Lead</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-4 p-3 px-4 bg-[#0a0a0a] border border-[#1a1a1a] rounded-[10px] transition-[0.3s_ease] hover:border-[#2a2a2a]">
                      <div className="w-10 h-10 rounded-full flex items-center justify-center text-white text-[0.8rem] font-semibold" style={{background: '#8b5cf6'}}>LP</div>
                      <div className="flex-1">
                        <h4 className="text-white text-[0.9rem] font-medium m-0">Lisa Park</h4>
                        <span className="text-[#666] text-[0.7rem]">UX Researcher</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  )
}

export default Interective