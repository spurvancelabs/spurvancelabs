import Image from 'next/image'
import React from 'react'
import './OurNetwork.css';
function OurNetwork() {
  return (
    <section className="svg-lines-section">
    <div className="svg-lines-container">
        {/* <!-- Background blurred spots --> */}
        <div className="svg-spot svg-spot-1"></div>
        <div className="svg-spot svg-spot-2"></div>
        <div className="svg-spot svg-spot-3"></div>
        
        {/* <!-- Left Side - SVG Lines Animation --> */}
        <div className="svg-lines-left">
            <div className="svg-lines-wrapper">
                <Image src="https://cdn3d.iconscout.com/3d/premium/thumb/coding-3d-icon-png-download-8049728.png" alt="" width={500} height={500}></Image>
            </div>
        </div>
        
        {/* <!-- Right Side - Content --> */}
        <div className="svg-lines-right">
            <div className="svg-lines-content">
                <span className="svg-lines-badge">Our Network</span>
                <h2>Connected <span>ecosystem</span></h2>
                <p>Our infrastructure spans across multiple platforms and technologies, creating a seamless experience for your business.</p>
                
                <div className="svg-lines-features">
                    <div className="svg-feature">
                        <div className="svg-feature-icon">
                            <i className="fas fa-code"></i>
                        </div>
                        <div className="svg-feature-text">
                            <h4>Full-Stack Development</h4>
                            <p>End-to-end solutions from frontend to backend</p>
                        </div>
                    </div>
                    <div className="svg-feature">
                        <div className="svg-feature-icon">
                            <i className="fas fa-cloud"></i>
                        </div>
                        <div className="svg-feature-text">
                            <h4>Cloud Infrastructure</h4>
                            <p>Scalable, secure, and reliable cloud solutions</p>
                        </div>
                    </div>
                    <div className="svg-feature">
                        <div className="svg-feature-icon">
                            <i className="fas fa-bolt"></i>
                        </div>
                        <div className="svg-feature-text">
                            <h4>Real-Time Integration</h4>
                            <p>Seamless API and third-party integrations</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</section>
  )
}

export default OurNetwork