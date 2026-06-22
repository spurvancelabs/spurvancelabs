'use client';

import './TrustedBy.css';

const trustedCompanies = [
  { icon: 'fa-linkedin-in', name: 'LinkedIn' },
  { icon: 'fa-google', name: 'Google' },
  { icon: 'fa-twitter', name: 'Twitter' },
  { icon: 'fa-github', name: 'GitHub' },
  { icon: 'fa-apple', name: 'Apple' },
  { icon: 'fa-microsoft', name: 'Microsoft' },
];

export default function TrustedBy() {
  return (
    <section className="trusted-section">
      <div className="trusted-header">
        <h2>Trusted by <span>industry leaders</span></h2>
      </div>
      <div className="trusted-grid">
        {trustedCompanies.map((company) => (
          <div key={company.name} className="trusted-item">
            <i className={`fab ${company.icon}`}></i>
            <span>{company.name}</span>
          </div>
        ))}
      </div>
    </section>
  );
}