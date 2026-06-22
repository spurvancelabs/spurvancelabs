'use client'
import React, { useState, useEffect, useRef } from 'react'
import "./Interective.css"

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
    <section className="tour-section">
      <div className="tour-container">
        <div className="tour-header">
          <span className="tour-badge">Interactive Tour</span>
          <h2>See it in <span>action</span></h2>
          <p>Explore our platform's key features through this interactive demo</p>
        </div>

        <div className="tour-wrapper">
          {/* Sidebar Tabs */}
          <div className="tour-sidebar">
            <div 
              className={`tour-tab ${isActive('dashboard') ? 'active' : ''}`}
              onClick={() => handleTabClick('dashboard')}
              ref={(el) => { tabRefs.current['dashboard'] = el }}
              tabIndex={0}
              role="tab"
              aria-selected={isActive('dashboard')}
            >
              <div className="tour-tab-icon">
                <i className="fas fa-th-large"></i>
              </div>
              <div className="tour-tab-info">
                <h4>Dashboard</h4>
                <span>Overview & metrics</span>
              </div>
            </div>
            <div 
              className={`tour-tab ${isActive('analytics') ? 'active' : ''}`}
              onClick={() => handleTabClick('analytics')}
              ref={(el) => { tabRefs.current['analytics'] = el }}
              tabIndex={0}
              role="tab"
              aria-selected={isActive('analytics')}
            >
              <div className="tour-tab-icon">
                <i className="fas fa-chart-line"></i>
              </div>
              <div className="tour-tab-info">
                <h4>Analytics</h4>
                <span>Data & insights</span>
              </div>
            </div>
            <div 
              className={`tour-tab ${isActive('reports') ? 'active' : ''}`}
              onClick={() => handleTabClick('reports')}
              ref={(el) => { tabRefs.current['reports'] = el }}
              tabIndex={0}
              role="tab"
              aria-selected={isActive('reports')}
            >
              <div className="tour-tab-icon">
                <i className="fas fa-file-alt"></i>
              </div>
              <div className="tour-tab-info">
                <h4>Reports</h4>
                <span>Custom reports</span>
              </div>
            </div>
            <div 
              className={`tour-tab ${isActive('automation') ? 'active' : ''}`}
              onClick={() => handleTabClick('automation')}
              ref={(el) => { tabRefs.current['automation'] = el }}
              tabIndex={0}
              role="tab"
              aria-selected={isActive('automation')}
            >
              <div className="tour-tab-icon">
                <i className="fas fa-robot"></i>
              </div>
              <div className="tour-tab-info">
                <h4>Automation</h4>
                <span>Workflow automation</span>
              </div>
            </div>
            <div 
              className={`tour-tab ${isActive('team') ? 'active' : ''}`}
              onClick={() => handleTabClick('team')}
              ref={(el) => { tabRefs.current['team'] = el }}
              tabIndex={0}
              role="tab"
              aria-selected={isActive('team')}
            >
              <div className="tour-tab-icon">
                <i className="fas fa-users"></i>
              </div>
              <div className="tour-tab-info">
                <h4>Team</h4>
                <span>Collaboration</span>
              </div>
            </div>
          </div>

          {/* Main Content Area */}
          <div className="tour-content">
            {/* Dashboard Panel */}
            {isActive('dashboard') && (
              <div className="tour-panel active" id="panel-dashboard">
                <div className="tour-panel-header">
                  <h3>Dashboard</h3>
                  <p>Real-time overview of your business performance</p>
                </div>
                <div className="tour-panel-body">
                  <div className="tour-stats-grid">
                    <div className="tour-stat-card">
                      <span className="tour-stat-value">$124.5K</span>
                      <span className="tour-stat-label">Total Revenue</span>
                    </div>
                    <div className="tour-stat-card">
                      <span className="tour-stat-value">2,847</span>
                      <span className="tour-stat-label">Active Users</span>
                    </div>
                    <div className="tour-stat-card">
                      <span className="tour-stat-value">67%</span>
                      <span className="tour-stat-label">Engagement Rate</span>
                    </div>
                    <div className="tour-stat-card">
                      <span className="tour-stat-value">183</span>
                      <span className="tour-stat-label">New Signups</span>
                    </div>
                  </div>
                  <div className="tour-chart-placeholder">
                    <div className="tour-chart-bars">
                      <div className="tour-chart-bar" style={{height: '40%'}}></div>
                      <div className="tour-chart-bar" style={{height: '65%'}}></div>
                      <div className="tour-chart-bar" style={{height: '80%'}}></div>
                      <div className="tour-chart-bar" style={{height: '55%'}}></div>
                      <div className="tour-chart-bar" style={{height: '90%'}}></div>
                      <div className="tour-chart-bar" style={{height: '70%'}}></div>
                      <div className="tour-chart-bar" style={{height: '45%'}}></div>
                    </div>
                    <span className="tour-chart-label">Weekly Performance</span>
                  </div>
                </div>
              </div>
            )}

            {/* Analytics Panel */}
            {isActive('analytics') && (
              <div className="tour-panel active" id="panel-analytics">
                <div className="tour-panel-header">
                  <h3>Analytics</h3>
                  <p>Deep insights into your data and user behavior</p>
                </div>
                <div className="tour-panel-body">
                  <div className="tour-analytics-grid">
                    <div className="tour-analytics-item">
                      <span className="tour-analytics-value">42.8K</span>
                      <span className="tour-analytics-label">Page Views</span>
                    </div>
                    <div className="tour-analytics-item">
                      <span className="tour-analytics-value">3.2min</span>
                      <span className="tour-analytics-label">Avg Session</span>
                    </div>
                    <div className="tour-analytics-item">
                      <span className="tour-analytics-value">24.7%</span>
                      <span className="tour-analytics-label">Bounce Rate</span>
                    </div>
                    <div className="tour-analytics-item">
                      <span className="tour-analytics-value">18.9K</span>
                      <span className="tour-analytics-label">Unique Visitors</span>
                    </div>
                  </div>
                  <div className="tour-analytics-donut">
                    <div className="tour-donut-ring">
                      <span className="tour-donut-value">67%</span>
                      <span className="tour-donut-label">Conversion Rate</span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Reports Panel */}
            {isActive('reports') && (
              <div className="tour-panel active" id="panel-reports">
                <div className="tour-panel-header">
                  <h3>Reports</h3>
                  <p>Generate and customize detailed reports</p>
                </div>
                <div className="tour-panel-body">
                  <div className="tour-reports-list">
                    <div className="tour-report-item">
                      <i className="fas fa-file-pdf"></i>
                      <div className="tour-report-info">
                        <h4>Monthly Performance Report</h4>
                        <span>Generated: Today, 10:30 AM</span>
                      </div>
                    </div>
                    <div className="tour-report-item">
                      <i className="fas fa-file-excel"></i>
                      <div className="tour-report-info">
                        <h4>Revenue Breakdown Q2</h4>
                        <span>Generated: Yesterday, 4:15 PM</span>
                      </div>
                    </div>
                    <div className="tour-report-item">
                      <i className="fas fa-file-alt"></i>
                      <div className="tour-report-info">
                        <h4>User Engagement Analysis</h4>
                        <span>Generated: 2 days ago</span>
                      </div>
                    </div>
                    <div className="tour-report-item">
                      <i className="fas fa-file-pdf"></i>
                      <div className="tour-report-info">
                        <h4>Annual Summary 2024</h4>
                        <span>Generated: Dec 31, 2024</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Automation Panel */}
            {isActive('automation') && (
              <div className="tour-panel active" id="panel-automation">
                <div className="tour-panel-header">
                  <h3>Automation</h3>
                  <p>Streamline your workflows with automation rules</p>
                </div>
                <div className="tour-panel-body">
                  <div className="tour-automation-grid">
                    <div className="tour-automation-card">
                      <div className="tour-automation-icon">
                        <i className="fas fa-envelope"></i>
                      </div>
                      <h4>Email Sequences</h4>
                      <p>Automated email campaigns triggered by user actions</p>
                    </div>
                    <div className="tour-automation-card">
                      <div className="tour-automation-icon">
                        <i className="fas fa-credit-card"></i>
                      </div>
                      <h4>Payment Processing</h4>
                      <p>Auto-invoice and payment reminder workflows</p>
                    </div>
                    <div className="tour-automation-card">
                      <div className="tour-automation-icon">
                        <i className="fas fa-user-plus"></i>
                      </div>
                      <h4>User Onboarding</h4>
                      <p>Welcome emails, tutorials, and follow-up sequences</p>
                    </div>
                    <div className="tour-automation-card">
                      <div className="tour-automation-icon">
                        <i className="fas fa-bell"></i>
                      </div>
                      <h4>Alert Notifications</h4>
                      <p>Real-time alerts for system events and anomalies</p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Team Panel */}
            {isActive('team') && (
              <div className="tour-panel active" id="panel-team">
                <div className="tour-panel-header">
                  <h3>Team</h3>
                  <p>Manage your team members and permissions</p>
                </div>
                <div className="tour-panel-body">
                  <div className="tour-team-grid">
                    <div className="tour-team-member">
                      <div className="tour-team-avatar" style={{background: '#7c3aed'}}>JD</div>
                      <div className="tour-team-info">
                        <h4>John Doe</h4>
                        <span>CEO & Founder</span>
                      </div>
                    </div>
                    <div className="tour-team-member">
                      <div className="tour-team-avatar" style={{background: '#22d3ee'}}>SC</div>
                      <div className="tour-team-info">
                        <h4>Sarah Chen</h4>
                        <span>CTO</span>
                      </div>
                    </div>
                    <div className="tour-team-member">
                      <div className="tour-team-avatar" style={{background: '#f59e0b'}}>MJ</div>
                      <div className="tour-team-info">
                        <h4>Mike Johnson</h4>
                        <span>Lead Developer</span>
                      </div>
                    </div>
                    <div className="tour-team-member">
                      <div className="tour-team-avatar" style={{background: '#ec4899'}}>ED</div>
                      <div className="tour-team-info">
                        <h4>Emily Davis</h4>
                        <span>Product Designer</span>
                      </div>
                    </div>
                    <div className="tour-team-member">
                      <div className="tour-team-avatar" style={{background: '#34d399'}}>DW</div>
                      <div className="tour-team-info">
                        <h4>David Wilson</h4>
                        <span>Marketing Lead</span>
                      </div>
                    </div>
                    <div className="tour-team-member">
                      <div className="tour-team-avatar" style={{background: '#8b5cf6'}}>LP</div>
                      <div className="tour-team-info">
                        <h4>Lisa Park</h4>
                        <span>UX Researcher</span>
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