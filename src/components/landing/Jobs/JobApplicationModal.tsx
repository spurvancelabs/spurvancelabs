'use client';

import { useState, useRef } from 'react';
import { useMutation } from '@tanstack/react-query';
import { submitJobApplication } from '@/lib/api/applications';

interface Job {
  id: string;
  title: string;
}

interface JobApplicationModalProps {
  job: Job | null;
  onClose: () => void;
}

const yearsOfExperienceOptions = [
  'Fresher', 'Less than 1 year', '1-2 years', '3-5 years', '5-10 years', '10+ years',
];

const workAuthorizationOptions = [
  'Citizen', 'Permanent Resident', 'Work Visa', 'Student Visa', 'Need Sponsorship', 'Other',
];

const referralSourceOptions = [
  'LinkedIn', 'Company Website', 'Indeed', 'Glassdoor', 'Referral', 'University', 'Other',
];

export default function JobApplicationModal({ job, onClose }: JobApplicationModalProps) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    currentCompany: '',
    currentPosition: '',
    yearsOfExperience: '',
    linkedInUrl: '',
    portfolioUrl: '',
    coverLetter: '',
    salaryExpectation: '',
    startDate: '',
    workAuthorization: '',
    referralSource: '',
    additionalInfo: '',
  });
  const [resumeFile, setResumeFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const mutation = useMutation({
    mutationFn: submitJobApplication,
    onError: (err: unknown) => {
      const message = err instanceof Error ? err.message : 'Something went wrong';
      (err as any)?.error ? (err as any).error : message;
    },
  });

  if (!job) return null;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    mutation.mutate({
      ...formData,
      jobId: job.id,
      resume: resumeFile,
    });
  };

  if (mutation.isSuccess) {
    return (
      <div className="fixed inset-0 z-[200] flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
        <div className="bg-[#0a0a0a] border border-[#1a1a1a] rounded-xl p-8 max-w-md w-full text-center">
          <div className="text-green-500 text-5xl mb-4">✓</div>
          <h3 className="text-white text-2xl font-semibold mb-2">Application Submitted!</h3>
          <p className="text-[#666] mb-6">Thank you for applying to {job.title}. We&apos;ll review your application and get back to you soon.</p>
          <button
            onClick={onClose}
            className="bg-blue-500 text-white px-6 py-2 rounded-full font-medium cursor-pointer hover:bg-blue-600 transition-[0.3s_ease]"
          >
            Close
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
      <div className="bg-[#0a0a0a] border border-[#1a1a1a] rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto scrollbar-thin scrollbar-track-black scrollbar-thumb-white/20 hover:scrollbar-thumb-white/40">
        <div className="sticky top-0 bg-[#0a0a0a] border-b border-[#1a1a1a] px-6 py-4 flex items-center justify-between z-10">
          <div>
            <h2 className="text-white text-xl font-semibold">Apply for {job.title}</h2>
            <p className="text-[#666] text-sm">Fill out the form below to submit your application</p>
          </div>
          <button
            onClick={onClose}
            className="text-[#666] hover:text-white text-2xl cursor-pointer transition-[0.3s_ease]"
          >
            ✕
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-[#888] text-sm mb-1">Full Name *</label>
              <input
                type="text"
                name="name"
                required
                value={formData.name}
                onChange={handleChange}
                className="w-full bg-[#1a1a1a] border border-[#2a2a2a] rounded-lg px-4 py-2.5 text-white text-sm focus:outline-none focus:border-blue-500 transition-[0.3s_ease]"
                placeholder="John Doe"
              />
            </div>
            <div>
              <label className="block text-[#888] text-sm mb-1">Email *</label>
              <input
                type="email"
                name="email"
                required
                value={formData.email}
                onChange={handleChange}
                className="w-full bg-[#1a1a1a] border border-[#2a2a2a] rounded-lg px-4 py-2.5 text-white text-sm focus:outline-none focus:border-blue-500 transition-[0.3s_ease]"
                placeholder="john@example.com"
              />
            </div>
            <div>
              <label className="block text-[#888] text-sm mb-1">Phone</label>
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                className="w-full bg-[#1a1a1a] border border-[#2a2a2a] rounded-lg px-4 py-2.5 text-white text-sm focus:outline-none focus:border-blue-500 transition-[0.3s_ease]"
                placeholder="+1 234 567 890"
              />
            </div>
            <div>
              <label className="block text-[#888] text-sm mb-1">Current Company</label>
              <input
                type="text"
                name="currentCompany"
                value={formData.currentCompany}
                onChange={handleChange}
                className="w-full bg-[#1a1a1a] border border-[#2a2a2a] rounded-lg px-4 py-2.5 text-white text-sm focus:outline-none focus:border-blue-500 transition-[0.3s_ease]"
                placeholder="Company name"
              />
            </div>
            <div>
              <label className="block text-[#888] text-sm mb-1">Current Position</label>
              <input
                type="text"
                name="currentPosition"
                value={formData.currentPosition}
                onChange={handleChange}
                className="w-full bg-[#1a1a1a] border border-[#2a2a2a] rounded-lg px-4 py-2.5 text-white text-sm focus:outline-none focus:border-blue-500 transition-[0.3s_ease]"
                placeholder="Current job title"
              />
            </div>
            <div>
              <label className="block text-[#888] text-sm mb-1">Years of Experience</label>
              <select
                name="yearsOfExperience"
                value={formData.yearsOfExperience}
                onChange={handleChange}
                className="w-full bg-[#1a1a1a] border border-[#2a2a2a] rounded-lg px-4 py-2.5 text-white text-sm focus:outline-none focus:border-blue-500 transition-[0.3s_ease]"
              >
                <option value="">Select experience</option>
                {yearsOfExperienceOptions.map(opt => (
                  <option key={opt} value={opt}>{opt}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-[#888] text-sm mb-1">LinkedIn URL</label>
              <input
                type="url"
                name="linkedInUrl"
                value={formData.linkedInUrl}
                onChange={handleChange}
                className="w-full bg-[#1a1a1a] border border-[#2a2a2a] rounded-lg px-4 py-2.5 text-white text-sm focus:outline-none focus:border-blue-500 transition-[0.3s_ease]"
                placeholder="https://linkedin.com/in/..."
              />
            </div>
            <div>
              <label className="block text-[#888] text-sm mb-1">Portfolio URL</label>
              <input
                type="url"
                name="portfolioUrl"
                value={formData.portfolioUrl}
                onChange={handleChange}
                className="w-full bg-[#1a1a1a] border border-[#2a2a2a] rounded-lg px-4 py-2.5 text-white text-sm focus:outline-none focus:border-blue-500 transition-[0.3s_ease]"
                placeholder="https://yourportfolio.com"
              />
            </div>
          </div>

          <div>
            <label className="block text-[#888] text-sm mb-1">Resume *</label>
            <div
              onClick={() => fileInputRef.current?.click()}
              className="w-full bg-[#1a1a1a] border border-dashed border-[#2a2a2a] rounded-lg px-4 py-8 text-center cursor-pointer hover:border-blue-500 transition-[0.3s_ease]"
            >
              {resumeFile ? (
                <p className="text-white text-sm">{resumeFile.name}</p>
              ) : (
                <div>
                  <p className="text-[#666] text-sm">Click to upload your resume</p>
                  <p className="text-[#555] text-xs mt-1">PDF, DOC, DOCX, JPG, PNG (max 5MB)</p>
                </div>
              )}
            </div>
            <input
              ref={fileInputRef}
              type="file"
              accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
              className="hidden"
              onChange={(e) => setResumeFile(e.target.files?.[0] || null)}
            />
          </div>

          <div>
            <label className="block text-[#888] text-sm mb-1">Cover Letter</label>
            <textarea
              name="coverLetter"
              rows={4}
              value={formData.coverLetter}
              onChange={handleChange}
              className="w-full bg-[#1a1a1a] border border-[#2a2a2a] rounded-lg px-4 py-2.5 text-white text-sm focus:outline-none focus:border-blue-500 transition-[0.3s_ease] resize-vertical"
              placeholder="Tell us why you're a great fit for this role..."
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-[#888] text-sm mb-1">Salary Expectation</label>
              <input
                type="text"
                name="salaryExpectation"
                value={formData.salaryExpectation}
                onChange={handleChange}
                className="w-full bg-[#1a1a1a] border border-[#2a2a2a] rounded-lg px-4 py-2.5 text-white text-sm focus:outline-none focus:border-blue-500 transition-[0.3s_ease]"
                placeholder="e.g. $80,000 - $100,000"
              />
            </div>
            <div>
              <label className="block text-[#888] text-sm mb-1">Start Date</label>
              <input
                type="date"
                name="startDate"
                value={formData.startDate}
                onChange={handleChange}
                className="w-full bg-[#1a1a1a] border border-[#2a2a2a] rounded-lg px-4 py-2.5 text-white text-sm focus:outline-none focus:border-blue-500 transition-[0.3s_ease]"
              />
            </div>
            <div>
              <label className="block text-[#888] text-sm mb-1">Work Authorization</label>
              <select
                name="workAuthorization"
                value={formData.workAuthorization}
                onChange={handleChange}
                className="w-full bg-[#1a1a1a] border border-[#2a2a2a] rounded-lg px-4 py-2.5 text-white text-sm focus:outline-none focus:border-blue-500 transition-[0.3s_ease]"
              >
                <option value="">Select authorization</option>
                {workAuthorizationOptions.map(opt => (
                  <option key={opt} value={opt}>{opt}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-[#888] text-sm mb-1">Referral Source</label>
              <select
                name="referralSource"
                value={formData.referralSource}
                onChange={handleChange}
                className="w-full bg-[#1a1a1a] border border-[#2a2a2a] rounded-lg px-4 py-2.5 text-white text-sm focus:outline-none focus:border-blue-500 transition-[0.3s_ease]"
              >
                <option value="">Select source</option>
                {referralSourceOptions.map(opt => (
                  <option key={opt} value={opt}>{opt}</option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="block text-[#888] text-sm mb-1">Additional Information</label>
            <textarea
              name="additionalInfo"
              rows={3}
              value={formData.additionalInfo}
              onChange={handleChange}
              className="w-full bg-[#1a1a1a] border border-[#2a2a2a] rounded-lg px-4 py-2.5 text-white text-sm focus:outline-none focus:border-blue-500 transition-[0.3s_ease] resize-vertical"
              placeholder="Anything else you'd like us to know..."
            />
          </div>

          {mutation.isError && (
            <div className="bg-red-500/10 border border-red-500/30 text-red-400 text-sm rounded-lg px-4 py-3">
              {mutation.error instanceof Error ? mutation.error.message : 'Something went wrong'}
            </div>
          )}

          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 bg-[#1a1a1a] text-[#888] border border-[#2a2a2a] px-5 py-2.5 rounded-full text-sm font-medium cursor-pointer hover:bg-[#2a2a2a] hover:text-white transition-[0.3s_ease]"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={mutation.isPending}
              className="flex-1 bg-blue-500 text-white px-5 py-2.5 rounded-full text-sm font-medium cursor-pointer hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition-[0.3s_ease]"
            >
              {mutation.isPending ? 'Submitting...' : 'Submit Application'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
