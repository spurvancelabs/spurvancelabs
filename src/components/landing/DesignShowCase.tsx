import React from 'react'

import "../../components/landing/DesignShowCase.css"

function DesignShowCase() {
  return (
   <section className="showcase-section">
    <div className="showcase-container">
        <div className="showcase-header">
            <span className="showcase-badge">Design Showcase</span>
            <h2>Where <span>vision</span> meets <span>craft</span></h2>
            <p>From wireframes to polished interfaces — our design process in action</p>
        </div>

        <div className="showcase-grid">
            {/* <!-- Wireframes --> */}
            <div className="showcase-card wireframe-card">
                <div className="showcase-card-header">
                    <span className="showcase-card-number">01</span>
                    <span className="showcase-card-tag">Process</span>
                </div>
                <h3>Wireframes</h3>
                <p>Low-fidelity sketches that define structure, layout, and user flow before any code is written.</p>
                <div className="showcase-preview wireframe-preview">
                    <div className="wireframe-grid">
                        <div className="wireframe-box"></div>
                        <div className="wireframe-box"></div>
                        <div className="wireframe-box"></div>
                        <div className="wireframe-box"></div>
                        <div className="wireframe-box"></div>
                        <div className="wireframe-box"></div>
                        <div className="wireframe-box"></div>
                        <div className="wireframe-box"></div>
                        <div className="wireframe-box"></div>
                    </div>
                    <div className="wireframe-lines">
                        <span></span><span></span><span></span>
                    </div>
                </div>
                <div className="showcase-features">
                    <span>User flows</span>
                    <span>Layout planning</span>
                    <span>Information architecture</span>
                </div>
            </div>

            {/* <!-- UI Screens --> */}
            <div className="showcase-card ui-card">
                <div className="showcase-card-header">
                    <span className="showcase-card-number">02</span>
                    <span className="showcase-card-tag">Visual</span>
                </div>
                <h3>UI Screens</h3>
                <p>High-fidelity designs with pixel-perfect typography, colors, and interactive components.</p>
                <div className="showcase-preview ui-preview">
                    <div className="ui-device">
                        <div className="ui-screen">
                            <div className="ui-header">
                                <div className="ui-dot"></div>
                                <div className="ui-dot"></div>
                                <div className="ui-dot"></div>
                            </div>
                            <div className="ui-content">
                                <div className="ui-bar" style={{width: '70%'}}></div>
                                <div className="ui-bar" style={{width: '85%'}}></div>
                                <div className="ui-bar" style={{width: '55%'}}></div>
                                <div className="ui-bar" style={{width: '90%'}}></div>
                                <div className="ui-bar" style={{width: '40%'}}></div>
                                <div className="ui-bar" style={{width: '75%'}}></div>
                            </div>
                            <div className="ui-footer">
                                <div className="ui-button"></div>
                                <div className="ui-button"></div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="showcase-features">
                    <span>Interactive prototypes</span>
                    <span>Responsive design</span>
                    <span>Design tokens</span>
                </div>
            </div>

            {/* <!-- Design Systems --> */}
            <div className="showcase-card system-card">
                <div className="showcase-card-header">
                    <span className="showcase-card-number">03</span>
                    <span className="showcase-card-tag">Foundation</span>
                </div>
                <h3>Design Systems</h3>
                <p>Scalable systems with reusable components, patterns, and guidelines for consistent experiences.</p>
                <div className="showcase-preview system-preview">
                    <div className="system-grid">
                        <div className="system-color primary"></div>
                        <div className="system-color secondary"></div>
                        <div className="system-color accent"></div>
                        <div className="system-color neutral"></div>
                        <div className="system-color dark"></div>
                        <div className="system-color light"></div>
                    </div>
                    <div className="system-components">
                        <div className="system-comp"></div>
                        <div className="system-comp"></div>
                        <div className="system-comp"></div>
                        <div className="system-comp"></div>
                    </div>
                </div>
                <div className="showcase-features">
                    <span>Component library</span>
                    <span>Typography scale</span>
                    <span>Color palette</span>
                </div>
            </div>
        </div>
    </div>
</section>
  )
}

export default DesignShowCase