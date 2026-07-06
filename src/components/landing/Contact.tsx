'use client';

import { useState, useRef } from 'react';

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
    <section className="py-12 px-4 sm:py-20 sm:px-8 pb-16 sm:pb-24 overflow-hidden">
          <div className="text-center mb-10 sm:mb-14">
        <h2 className="text-white text-[1.8rem] sm:text-[2.4rem] md:text-[3rem] font-bold tracking-[-0.03em] mb-3">
          Let's <span className="bg-gradient-to-br from-[#f0f0f0] to-[#777] bg-clip-text text-transparent">connect</span>
        </h2>
        <p className="text-[#666] text-[0.85rem] sm:text-[1.1rem] font-light max-w-[500px] mx-auto">
Have a project in mind? Our software development company for remote teams is ready to bring your vision to life        </p>
      </div>

      <div className="max-w-[1200px] mx-auto grid grid-cols-1 lg:grid-cols-[1fr_1.5fr] gap-6 sm:gap-12 items-start">
        {/* Contact Info */}
        <div className="bg-[#0a0a0a] border border-[#1a1a1a] rounded-2xl p-5 sm:p-10 transition-[0.4s_ease] hover:border-[#2a2a2a] hover:-translate-y-1 hover:shadow-[0_20px_40px_rgba(0,0,0,0.4)]">
          <div className="mb-6 sm:mb-8">
            <h3 className="text-white text-[1.1rem] sm:text-[1.4rem] font-semibold mb-2">Contact Information</h3>
            <p className="text-[#666] text-[0.85rem] sm:text-[0.9rem] leading-[1.6]">Reach out to us through any of the channels below</p>
          </div>

          <div className="flex flex-col gap-5 sm:gap-6 mb-8">
            <div className="flex items-start gap-3 sm:gap-4">
              <div className="w-10 h-10 sm:w-11 sm:h-11 min-w-[40px] sm:min-w-[44px] rounded-xl bg-[#1a1a1a] border border-[#1a1a1a] flex items-center justify-center transition-[0.3s_ease] hover:bg-[#2a2a2a] hover:border-[#2a2a2a]">
                <i className="fas fa-map-marker-alt text-[#666] text-[0.85rem] sm:text-[1rem] transition-[0.3s_ease] hover:text-white"></i>
              </div>
              <div>
                <span className="block text-[#444] text-[0.6rem] sm:text-[0.65rem] uppercase tracking-[0.08em] mb-[0.2rem]">Location</span>
                <p className="text-[#c0c0c0] text-[0.85rem] sm:text-[0.9rem] leading-[1.6] m-0">123 Tech Street, Silicon Valley, CA 94025</p>
              </div>
            </div>

            <div className="flex items-start gap-3 sm:gap-4">
              <div className="w-10 h-10 sm:w-11 sm:h-11 min-w-[40px] sm:min-w-[44px] rounded-xl bg-[#1a1a1a] border border-[#1a1a1a] flex items-center justify-center transition-[0.3s_ease] hover:bg-[#2a2a2a] hover:border-[#2a2a2a]">
                <i className="fas fa-envelope text-[#666] text-[0.85rem] sm:text-[1rem] transition-[0.3s_ease] hover:text-white"></i>
              </div>
              <div>
                <span className="block text-[#444] text-[0.6rem] sm:text-[0.65rem] uppercase tracking-[0.08em] mb-[0.2rem]">Email</span>
                <p className="text-[#c0c0c0] text-[0.85rem] sm:text-[0.9rem] leading-[1.6] m-0">hello@spurvancelab.com</p>
                <p className="text-[#c0c0c0] text-[0.85rem] sm:text-[0.9rem] leading-[1.6] m-0">support@spurvancelab.com</p>
              </div>
            </div>

            <div className="flex items-start gap-3 sm:gap-4">
              <div className="w-10 h-10 sm:w-11 sm:h-11 min-w-[40px] sm:min-w-[44px] rounded-xl bg-[#1a1a1a] border border-[#1a1a1a] flex items-center justify-center transition-[0.3s_ease] hover:bg-[#2a2a2a] hover:border-[#2a2a2a]">
                <i className="fas fa-phone-alt text-[#666] text-[0.85rem] sm:text-[1rem] transition-[0.3s_ease] hover:text-white"></i>
              </div>
              <div>
                <span className="block text-[#444] text-[0.6rem] sm:text-[0.65rem] uppercase tracking-[0.08em] mb-[0.2rem]">Phone</span>
                <p className="text-[#c0c0c0] text-[0.85rem] sm:text-[0.9rem] leading-[1.6] m-0">+1 (555) 123-4567</p>
                <p className="text-[#c0c0c0] text-[0.85rem] sm:text-[0.9rem] leading-[1.6] m-0">+1 (555) 987-6543</p>
              </div>
            </div>

            <div className="flex items-start gap-3 sm:gap-4">
              <div className="w-10 h-10 sm:w-11 sm:h-11 min-w-[40px] sm:min-w-[44px] rounded-xl bg-[#1a1a1a] border border-[#1a1a1a] flex items-center justify-center transition-[0.3s_ease] hover:bg-[#2a2a2a] hover:border-[#2a2a2a]">
                <i className="fas fa-clock text-[#666] text-[0.85rem] sm:text-[1rem] transition-[0.3s_ease] hover:text-white"></i>
              </div>
              <div>
                <span className="block text-[#444] text-[0.6rem] sm:text-[0.65rem] uppercase tracking-[0.08em] mb-[0.2rem]">Working Hours</span>
                <p className="text-[#c0c0c0] text-[0.85rem] sm:text-[0.9rem] leading-[1.6] m-0">Mon - Fri: 9:00 AM - 6:00 PM</p>
                <p className="text-[#c0c0c0] text-[0.85rem] sm:text-[0.9rem] leading-[1.6] m-0">Sat - Sun: By Appointment</p>
              </div>
            </div>
          </div>

          <div className="pt-6 sm:pt-8 border-t border-[#1a1a1a]">
            <span className="block text-[#444] text-[0.6rem] sm:text-[0.65rem] uppercase tracking-[0.08em] mb-3">Follow Us</span>
            <div className="flex gap-3">
              <a href="#" className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-[#1a1a1a] border border-[#1a1a1a] flex items-center justify-center text-[#666] no-underline transition-[0.3s_ease] hover:bg-[#2a2a2a] hover:border-[#2a2a2a] hover:text-white hover:-translate-y-1">
                <i className="fab fa-linkedin-in text-sm sm:text-base"></i>
              </a>
              <a href="#" className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-[#1a1a1a] border border-[#1a1a1a] flex items-center justify-center text-[#666] no-underline transition-[0.3s_ease] hover:bg-[#2a2a2a] hover:border-[#2a2a2a] hover:text-white hover:-translate-y-1">
                <i className="fab fa-twitter text-sm sm:text-base"></i>
              </a>
              <a href="#" className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-[#1a1a1a] border border-[#1a1a1a] flex items-center justify-center text-[#666] no-underline transition-[0.3s_ease] hover:bg-[#2a2a2a] hover:border-[#2a2a2a] hover:text-white hover:-translate-y-1">
                <i className="fab fa-github text-sm sm:text-base"></i>
              </a>
              <a href="#" className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-[#1a1a1a] border border-[#1a1a1a] flex items-center justify-center text-[#666] no-underline transition-[0.3s_ease] hover:bg-[#2a2a2a] hover:border-[#2a2a2a] hover:text-white hover:-translate-y-1">
                <i className="fab fa-youtube text-sm sm:text-base"></i>
              </a>
            </div>
          </div>
        </div>

        {/* Contact Form */}
        <div className="bg-[#0a0a0a] border border-[#1a1a1a] rounded-2xl p-5 sm:p-10 transition-[0.4s_ease] hover:border-[#2a2a2a] hover:shadow-[0_20px_40px_rgba(0,0,0,0.4)]">
          <form className="flex flex-col gap-4 sm:gap-6" ref={formRef} onSubmit={handleSubmit} noValidate>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
              <div className={`flex flex-col gap-1 ${errors.fullName ? 'error' : ''}`}>
                <label htmlFor="fullName" className="text-[#888] text-[0.7rem] sm:text-[0.8rem] font-medium tracking-[0.02em]">Full Name</label>
                <input
                  type="text"
                  id="fullName"
                  name="fullName"
                  placeholder="John Doe"
                  value={formData.fullName}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  required
                  className={`bg-[#0a0a0a] border border-[#1a1a1a] rounded-[10px] px-4 sm:px-5 py-[0.75rem] sm:py-[0.9rem] text-white text-[0.85rem] sm:text-[0.95rem] transition-[0.3s_ease] w-full focus:outline-none focus:border-[#2a2a2a] focus:bg-[#111] focus:shadow-[0_0_30px_rgba(255,255,255,0.02)] placeholder:text-[#444] ${
                    errors.fullName ? 'border-[#ef4444]' : ''
                  }`}
                />
                <span className={`text-[#ef4444] text-[0.7rem] sm:text-[0.75rem] ${errors.fullName ? 'block' : 'hidden'}`}>{errors.fullName}</span>
              </div>
              <div className={`flex flex-col gap-1 ${errors.emailAddress ? 'error' : ''}`}>
                <label htmlFor="emailAddress" className="text-[#888] text-[0.7rem] sm:text-[0.8rem] font-medium tracking-[0.02em]">Email Address</label>
                <input
                  type="email"
                  id="emailAddress"
                  name="emailAddress"
                  placeholder="john@example.com"
                  value={formData.emailAddress}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  required
                  className={`bg-[#0a0a0a] border border-[#1a1a1a] rounded-[10px] px-4 sm:px-5 py-[0.75rem] sm:py-[0.9rem] text-white text-[0.85rem] sm:text-[0.95rem] transition-[0.3s_ease] w-full focus:outline-none focus:border-[#2a2a2a] focus:bg-[#111] focus:shadow-[0_0_30px_rgba(255,255,255,0.02)] placeholder:text-[#444] ${
                    errors.emailAddress ? 'border-[#ef4444]' : ''
                  }`}
                />
                <span className={`text-[#ef4444] text-[0.7rem] sm:text-[0.75rem] ${errors.emailAddress ? 'block' : 'hidden'}`}>{errors.emailAddress}</span>
              </div>
            </div>

            <div className="flex flex-col gap-1">
              <label htmlFor="subject" className="text-[#888] text-[0.7rem] sm:text-[0.8rem] font-medium tracking-[0.02em]">Subject</label>
              <input
                type="text"
                id="subject"
                name="subject"
                placeholder="Project Discussion"
                value={formData.subject}
                onChange={handleChange}
                className="bg-[#0a0a0a] border border-[#1a1a1a] rounded-[10px] px-4 sm:px-5 py-[0.75rem] sm:py-[0.9rem] text-white text-[0.85rem] sm:text-[0.95rem] transition-[0.3s_ease] w-full focus:outline-none focus:border-[#2a2a2a] focus:bg-[#111] focus:shadow-[0_0_30px_rgba(255,255,255,0.02)] placeholder:text-[#444]"
              />
            </div>

            <div className={`flex flex-col gap-1 ${errors.message ? 'error' : ''}`}>
              <label htmlFor="message" className="text-[#888] text-[0.7rem] sm:text-[0.8rem] font-medium tracking-[0.02em]">Message</label>
              <textarea
                id="message"
                name="message"
                rows={4}
                placeholder="Tell us about your project..."
                value={formData.message}
                onChange={handleChange}
                onBlur={handleBlur}
                required
                className={`bg-[#0a0a0a] border border-[#1a1a1a] rounded-[10px] px-4 sm:px-5 py-[0.75rem] sm:py-[0.9rem] text-white text-[0.85rem] sm:text-[0.95rem] transition-[0.3s_ease] w-full focus:outline-none focus:border-[#2a2a2a] focus:bg-[#111] focus:shadow-[0_0_30px_rgba(255,255,255,0.02)] placeholder:text-[#444] resize-y min-h-[100px] ${
                  errors.message ? 'border-[#ef4444]' : ''
                }`}
              ></textarea>
              <span className={`text-[#ef4444] text-[0.7rem] sm:text-[0.75rem] ${errors.message ? 'block' : 'hidden'}`}>{errors.message}</span>
            </div>

            <div className={`flex flex-row items-start sm:items-center gap-3 flex-wrap ${errors.agree ? 'error' : ''}`}>
              <input
                type="checkbox"
                id="agree"
                name="agree"
                checked={formData.agree}
                onChange={handleChange}
                onBlur={handleBlur}
                required
                className="w-[18px] h-[18px] min-w-[18px] accent-white cursor-pointer p-0 mt-1 sm:mt-0"
              />
              <label htmlFor="agree" className="text-[#666] text-[0.8rem] sm:text-[0.85rem] font-normal cursor-pointer">
                I agree to the <a href="#" className="text-[#888] no-underline border-b border-[#1a1a1a] pb-[1px] transition-[0.3s_ease] hover:text-white hover:border-b-[#444]">Privacy Policy</a> and <a href="#" className="text-[#888] no-underline border-b border-[#1a1a1a] pb-[1px] transition-[0.3s_ease] hover:text-white hover:border-b-[#444]">Terms of Service</a>
              </label>
              <span className={`text-[#ef4444] text-[0.7rem] sm:text-[0.75rem] w-full ${errors.agree ? 'block' : 'hidden'}`}>{errors.agree}</span>
            </div>

            <button type="submit" className="inline-flex items-center justify-center gap-3 px-8 sm:px-10 py-3 sm:py-4 bg-white text-black border-none rounded-[50px] text-[0.9rem] sm:text-[1rem] font-semibold cursor-pointer transition-[0.4s_cubic-bezier(0.25,0.46,0.45,0.94)] relative overflow-hidden w-full hover:-translate-y-1 hover:shadow-[0_20px_40px_rgba(255,255,255,0.15)] hover:gap-5 disabled:opacity-60 disabled:cursor-not-allowed disabled:transform-none" disabled={isSubmitting}>
              <span className="absolute top-0 left-[-100%] w-full h-full bg-gradient-to-r from-transparent via-white/20 to-transparent transition-[0.6s_ease] hover:left-full"></span>
              <span>{isSubmitting ? 'Sending...' : 'Send Message'}</span>
              {isSubmitting ? (
                <i className="fas fa-spinner fa-spin text-[0.9rem]"></i>
              ) : (
                <i className="fas fa-paper-plane text-[0.9rem] transition-[0.3s_ease] hover:translate-x-1"></i>
              )}
            </button>

            <div className={`text-center p-6 sm:p-8 ${isSuccess ? 'block' : 'hidden'}`}>
              <i className="fas fa-check-circle text-[2.5rem] sm:text-[3rem] text-[#22c55e] mb-3 sm:mb-4"></i>
              <h3 className="text-white text-[1.2rem] sm:text-[1.4rem] mb-2">Message Sent!</h3>
              <p className="text-[#666] text-[0.9rem] sm:text-[0.95rem]">Thank you for reaching out. We'll get back to you within 24 hours.</p>
            </div>
          </form>
        </div>
      </div>
    </section>
  );
}