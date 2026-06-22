'use client';

import { useState, useRef } from 'react';
import './Contact.css';

export default function Contact() {
  const [formData, setFormData] = useState({
    fullName: '',
    emailAddress: '',
    subject: '',
    message: '',
    agree: false,
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const formRef = useRef<HTMLFormElement>(null);

  const validateField = (name: string, value: string | boolean): string => {
    switch (name) {
      case 'fullName':
        if (!value || (typeof value === 'string' && !value.trim())) {
          return 'Please enter your name';
        }
        return '';
      case 'emailAddress':
        if (!value || (typeof value === 'string' && !value.trim())) {
          return 'Please enter your email';
        }
        if (typeof value === 'string' && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
          return 'Please enter a valid email';
        }
        return '';
      case 'message':
        if (!value || (typeof value === 'string' && !value.trim())) {
          return 'Please enter your message';
        }
        return '';
      case 'agree':
        if (!value) {
          return 'Please agree to the terms';
        }
        return '';
      default:
        return '';
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    const checked = type === 'checkbox' ? (e.target as HTMLInputElement).checked : undefined;
    const val = type === 'checkbox' ? checked : value;
    
    setFormData((prev) => ({ ...prev, [name]: val }));
    
    // Clear error on input
    if (errors[name]) {
      const error = validateField(name, val as string | boolean);
      setErrors((prev) => ({ ...prev, [name]: error }));
    }
  };

  const handleBlur = (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    const checked = type === 'checkbox' ? (e.target as HTMLInputElement).checked : undefined;
    const val = type === 'checkbox' ? checked : value;
    const error = validateField(name, val as string | boolean);
    setErrors((prev) => ({ ...prev, [name]: error }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate all fields
    const newErrors: Record<string, string> = {};
    Object.entries(formData).forEach(([key, value]) => {
      const error = validateField(key, value);
      if (error) newErrors[key] = error;
    });
    
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      // Scroll to first error
      const firstError = document.querySelector('.form-group.error');
      if (firstError) {
        firstError.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
      return;
    }
    
    setIsSubmitting(true);
    
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 2000));
    
    setIsSubmitting(false);
    setIsSuccess(true);
    
    // Reset form after 5 seconds
    setTimeout(() => {
      setFormData({
        fullName: '',
        emailAddress: '',
        subject: '',
        message: '',
        agree: false,
      });
      setIsSuccess(false);
    }, 5000);
  };

  return (
    <section className="contact-section">
      <div className="contact-header">
        <h2>Let's <span>connect</span></h2>
        <p>Have a project in mind? Let's discuss how we can bring your vision to life</p>
      </div>

      <div className="contact-container">
        <div className="contact-info">
          <div className="contact-info-card">
            <div className="contact-info-header">
              <h3>Contact Information</h3>
              <p>Reach out to us through any of the channels below</p>
            </div>

            <div className="contact-info-items">
              <div className="contact-info-item">
                <div className="contact-icon">
                  <i className="fas fa-map-marker-alt"></i>
                </div>
                <div className="contact-detail">
                  <span className="contact-label">Location</span>
                  <p>123 Tech Street, Silicon Valley, CA 94025</p>
                </div>
              </div>

              <div className="contact-info-item">
                <div className="contact-icon">
                  <i className="fas fa-envelope"></i>
                </div>
                <div className="contact-detail">
                  <span className="contact-label">Email</span>
                  <p>hello@spurvancelab.com</p>
                  <p>support@spurvancelab.com</p>
                </div>
              </div>

              <div className="contact-info-item">
                <div className="contact-icon">
                  <i className="fas fa-phone-alt"></i>
                </div>
                <div className="contact-detail">
                  <span className="contact-label">Phone</span>
                  <p>+1 (555) 123-4567</p>
                  <p>+1 (555) 987-6543</p>
                </div>
              </div>

              <div className="contact-info-item">
                <div className="contact-icon">
                  <i className="fas fa-clock"></i>
                </div>
                <div className="contact-detail">
                  <span className="contact-label">Working Hours</span>
                  <p>Mon - Fri: 9:00 AM - 6:00 PM</p>
                  <p>Sat - Sun: By Appointment</p>
                </div>
              </div>
            </div>

            <div className="contact-social">
              <span className="social-label">Follow Us</span>
              <div className="social-icons">
                <a href="#"><i className="fab fa-linkedin-in"></i></a>
                <a href="#"><i className="fab fa-twitter"></i></a>
                <a href="#"><i className="fab fa-github"></i></a>
                <a href="#"><i className="fab fa-youtube"></i></a>
              </div>
            </div>
          </div>
        </div>

        <div className="contact-form-wrapper">
          <form className="contact-form" ref={formRef} onSubmit={handleSubmit} noValidate>
            <div className="form-row">
              <div className={`form-group ${errors.fullName ? 'error' : ''}`}>
                <label htmlFor="fullName">Full Name</label>
                <input
                  type="text"
                  id="fullName"
                  name="fullName"
                  placeholder="John Doe"
                  value={formData.fullName}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  required
                />
                <span className="form-error">{errors.fullName}</span>
              </div>
              <div className={`form-group ${errors.emailAddress ? 'error' : ''}`}>
                <label htmlFor="emailAddress">Email Address</label>
                <input
                  type="email"
                  id="emailAddress"
                  name="emailAddress"
                  placeholder="john@example.com"
                  value={formData.emailAddress}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  required
                />
                <span className="form-error">{errors.emailAddress}</span>
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="subject">Subject</label>
              <input
                type="text"
                id="subject"
                name="subject"
                placeholder="Project Discussion"
                value={formData.subject}
                onChange={handleChange}
              />
            </div>

            <div className={`form-group ${errors.message ? 'error' : ''}`}>
              <label htmlFor="message">Message</label>
              <textarea
                id="message"
                name="message"
                rows={5}
                placeholder="Tell us about your project..."
                value={formData.message}
                onChange={handleChange}
                onBlur={handleBlur}
                required
              ></textarea>
              <span className="form-error">{errors.message}</span>
            </div>

            <div className={`form-group checkbox-group ${errors.agree ? 'error' : ''}`}>
              <input
                type="checkbox"
                id="agree"
                name="agree"
                checked={formData.agree}
                onChange={handleChange}
                onBlur={handleBlur}
                required
              />
              <label htmlFor="agree">
                I agree to the <a href="#">Privacy Policy</a> and <a href="#">Terms of Service</a>
              </label>
              <span className="form-error">{errors.agree}</span>
            </div>

            <button type="submit" className="contact-submit" disabled={isSubmitting}>
              <span>{isSubmitting ? 'Sending...' : 'Send Message'}</span>
              {isSubmitting ? (
                <i className="fas fa-spinner fa-spin"></i>
              ) : (
                <i className="fas fa-paper-plane"></i>
              )}
            </button>

            {isSuccess && (
              <div className="contact-success show">
                <div className="contact-success-icon">
                  <i className="fas fa-check-circle"></i>
                </div>
                <h3>Message Sent!</h3>
                <p>Thank you for reaching out. We'll get back to you within 24 hours.</p>
              </div>
            )}
          </form>
        </div>
      </div>
    </section>
  );
}