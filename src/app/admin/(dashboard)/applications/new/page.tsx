'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import toast from 'react-hot-toast';

const statusOptions = ['PENDING', 'REVIEWED', 'SHORTLISTED', 'REJECTED', 'ACCEPTED'];

export default function NewApplicationPage() {
  const router = useRouter();
  const [type, setType] = useState<'job' | 'internship'>('job');
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState<any>({
    job_id: '',
    internship_id: '',
    name: '',
    email: '',
    phone: '',
    status: 'PENDING',
    interviewer_name: '',
    interview_date: '',
    current_company: '',
    current_position: '',
    years_of_experience: '',
    linkedin_url: '',
    portfolio_url: '',
    salary_expectation: '',
    start_date: '',
    work_authorization: '',
    referral_source: '',
    cover_letter: '',
    additional_info: '',
    university: '',
    major: '',
    year_of_study: '',
    graduation_date: '',
    gpa: '',
    github_url: '',
    available_start_date: '',
    availability_duration: '',
  });

  const { data: jobsData } = useQuery({
    queryKey: ['admin-jobs-list'],
    queryFn: async () => {
      const res = await fetch('/api/admin/jobs');
      if (!res.ok) throw new Error('Failed to fetch');
      const json = await res.json();
      return json.jobs || [];
    },
  });

  const { data: internshipsData } = useQuery({
    queryKey: ['admin-internships-list'],
    queryFn: async () => {
      const res = await fetch('/api/admin/internships');
      if (!res.ok) throw new Error('Failed to fetch');
      const json = await res.json();
      return json.internships || [];
    },
  });

  const { data: interviewersData } = useQuery({
    queryKey: ['admin-interviewers'],
    queryFn: async () => {
      const res = await fetch('/api/admin/interviewers');
      if (!res.ok) throw new Error('Failed to fetch');
      const json = await res.json();
      return json.interviewers || [];
    },
  });

  const jobs = jobsData || [];
  const internships = internshipsData || [];
  const interviewers = interviewersData || [];

  const handleChange = (key: string, value: string) => setForm({ ...form, [key]: value });

  const handleSave = async () => {
    if (!form.name.trim() || !form.email.trim()) {
      toast.error('Name and email are required');
      return;
    }
    setSaving(true);
    try {
      const payload = { ...form, type };
      const res = await fetch('/api/admin/applications', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || 'Failed to create');
      toast.success('Application created');
      router.push(`/admin/applications/${json.application.id}?type=${type}`);
    } catch (err: any) {
      toast.error(err.message);
    } finally {
      setSaving(false);
    }
  };

  const renderField = (label: string, key: string, opts?: { type?: string; long?: boolean; placeholder?: string; required?: boolean }) => {
    const common = 'w-full bg-[#1a1a1a] border border-[#2a2a2a] rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-blue-500 transition-all placeholder:text-gray-500';
    return (
      <div key={key} className={opts?.long ? 'col-span-2' : ''}>
        <label className="text-xs text-gray-400 block mb-1">
          {label} {opts?.required && <span className="text-red-400">*</span>}
        </label>
        {opts?.long ? (
          <textarea 
            rows={4} 
            value={form[key] || ''} 
            onChange={e => handleChange(key, e.target.value)} 
            placeholder={opts?.placeholder || ''} 
            className={`${common} resize-none min-h-[100px]`} 
          />
        ) : (
          <input 
            type={opts?.type || 'text'} 
            value={form[key] || ''} 
            onChange={e => handleChange(key, e.target.value)} 
            placeholder={opts?.placeholder || ''} 
            className={common} 
          />
        )}
      </div>
    );
  };

  return (
    <div className="space-y-4 sm:space-y-6 max-w-3xl px-2 xs:px-3 sm:px-4 md:px-6">
      {/* Header */}
      <div className="flex items-center gap-3 sm:gap-4">
        <button 
          onClick={() => router.back()} 
          className="p-1.5 sm:p-2 text-gray-400 hover:text-white hover:bg-white/5 rounded-lg transition-all cursor-pointer"
        >
          <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
          </svg>
        </button>
        <div>
          <h1 className="text-lg xs:text-xl sm:text-2xl font-bold text-white">Add Application</h1>
          <p className="text-gray-400 text-xs sm:text-sm mt-0.5">Manually add a new application</p>
        </div>
      </div>

      {/* Type + Posting selector */}
      <div className="bg-zinc-900/50 border border-white/[0.06] rounded-2xl p-4 sm:p-6">
        <h2 className="text-base sm:text-lg font-semibold text-white mb-3 sm:mb-4">Application Type</h2>
        <div className="flex flex-wrap gap-2 mb-3 sm:mb-4">
          <button
            onClick={() => setType('job')}
            className={`px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg text-xs sm:text-sm font-medium transition-all cursor-pointer ${
              type === 'job' 
                ? 'bg-blue-500/20 text-blue-400 border border-blue-500/30' 
                : 'bg-[#1a1a1a] text-gray-400 border border-[#2a2a2a] hover:text-white'
            }`}
          >
            Job
          </button>
          <button
            onClick={() => setType('internship')}
            className={`px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg text-xs sm:text-sm font-medium transition-all cursor-pointer ${
              type === 'internship' 
                ? 'bg-purple-500/20 text-purple-400 border border-purple-500/30' 
                : 'bg-[#1a1a1a] text-gray-400 border border-[#2a2a2a] hover:text-white'
            }`}
          >
            Internship
          </button>
        </div>

        {type === 'job' ? (
          <div>
            <label className="text-xs text-gray-400 block mb-1">Job Posting</label>
            <select 
              value={form.job_id} 
              onChange={e => handleChange('job_id', e.target.value)} 
              className="w-full bg-[#1a1a1a] border border-[#2a2a2a] rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-blue-500 cursor-pointer transition-all"
            >
              <option value="">Select a job...</option>
              {jobs.map((j: any) => <option key={j.id} value={j.id}>{j.title}</option>)}
            </select>
          </div>
        ) : (
          <div>
            <label className="text-xs text-gray-400 block mb-1">Internship Posting</label>
            <select 
              value={form.internship_id} 
              onChange={e => handleChange('internship_id', e.target.value)} 
              className="w-full bg-[#1a1a1a] border border-[#2a2a2a] rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-blue-500 cursor-pointer transition-all"
            >
              <option value="">Select an internship...</option>
              {internships.map((i: any) => <option key={i.id} value={i.id}>{i.title}</option>)}
            </select>
          </div>
        )}
      </div>

      {/* Personal Information */}
      <div className="bg-zinc-900/50 border border-white/[0.06] rounded-2xl p-4 sm:p-6">
        <h2 className="text-base sm:text-lg font-semibold text-white mb-3 sm:mb-4">Personal Information</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
          {renderField('Name', 'name', { required: true, placeholder: 'Your full name' })}
          {renderField('Email', 'email', { type: 'email', required: true, placeholder: 'john@example.com' })}
          {renderField('Phone', 'phone', { placeholder: '+1 (555) 123-4567' })}
          {renderField('LinkedIn URL', 'linkedin_url', { placeholder: 'https://linkedin.com/in/username' })}
        </div>
      </div>

      {/* Status & Interview */}
      <div className="bg-zinc-900/50 border border-white/[0.06] rounded-2xl p-4 sm:p-6">
        <h2 className="text-base sm:text-lg font-semibold text-white mb-3 sm:mb-4">Status & Interview</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
          <div>
            <label className="text-xs text-gray-400 block mb-1">Status</label>
            <select 
              value={form.status} 
              onChange={e => handleChange('status', e.target.value)} 
              className="w-full bg-[#1a1a1a] border border-[#2a2a2a] rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-blue-500 cursor-pointer transition-all"
            >
              {statusOptions.map(s => <option key={s} value={s}>{s}</option>)}
            </select>
          </div>
          <div>
            <label className="text-xs text-gray-400 block mb-1">Interviewer</label>
            <select 
              value={form.interviewer_name} 
              onChange={e => handleChange('interviewer_name', e.target.value)} 
              className="w-full bg-[#1a1a1a] border border-[#2a2a2a] rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-blue-500 cursor-pointer transition-all"
            >
              <option value="">— Select Interviewer —</option>
              {interviewers.map((iv: any) => <option key={iv.id} value={iv.name}>{iv.name}</option>)}
            </select>
          </div>
          {renderField('Interview Date', 'interview_date', { type: 'date', placeholder: 'Select interview date' })}
          {renderField('Referral Source', 'referral_source', { placeholder: 'LinkedIn, Indeed, Employee Referral, etc.' })}
        </div>
      </div>

      {/* Type-specific fields */}
      {type === 'job' ? (
        <div className="bg-zinc-900/50 border border-white/[0.06] rounded-2xl p-4 sm:p-6">
          <h2 className="text-base sm:text-lg font-semibold text-white mb-3 sm:mb-4">Professional Details</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
            {renderField('Current Company', 'current_company', { placeholder: 'Google, Amazon, etc.' })}
            {renderField('Current Position', 'current_position', { placeholder: 'Software Engineer, Product Manager, etc.' })}
            {renderField('Years of Experience', 'years_of_experience', { type: 'number', placeholder: '5' })}
            {renderField('Portfolio URL', 'portfolio_url', { placeholder: 'https://portfolio.com/username' })}
            {renderField('Salary Expectation', 'salary_expectation', { placeholder: '$80,000 - $100,000' })}
            {renderField('Start Date', 'start_date', { type: 'date', placeholder: 'Select start date' })}
            {renderField('Work Authorization', 'work_authorization', { placeholder: 'US Citizen, Green Card, H1B, etc.' })}
          </div>
        </div>
      ) : (
        <div className="bg-zinc-900/50 border border-white/[0.06] rounded-2xl p-4 sm:p-6">
          <h2 className="text-base sm:text-lg font-semibold text-white mb-3 sm:mb-4">Academic Details</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
            {renderField('University', 'university', { placeholder: 'Stanford University, MIT, etc.' })}
            {renderField('Major', 'major', { placeholder: 'Computer Science, Business, etc.' })}
            {renderField('Year of Study', 'year_of_study', { placeholder: 'Freshman, Sophomore, Junior, Senior, Graduate' })}
            {renderField('Graduation Date', 'graduation_date', { type: 'date', placeholder: 'Select graduation date' })}
            {renderField('GPA', 'gpa', { type: 'number', placeholder: '3.8' })}
            {renderField('GitHub URL', 'github_url', { placeholder: 'https://github.com/username' })}
            {renderField('Available Start Date', 'available_start_date', { type: 'date', placeholder: 'Select available start date' })}
            {renderField('Availability Duration', 'availability_duration', { placeholder: '3 months, 6 months, 1 year' })}
            {renderField('Work Authorization', 'work_authorization', { placeholder: 'US Citizen, Green Card, CPT, OPT, etc.' })}
          </div>
        </div>
      )}

      {/* Additional Information */}
      <div className="bg-zinc-900/50 border border-white/[0.06] rounded-2xl p-4 sm:p-6">
        <h2 className="text-base sm:text-lg font-semibold text-white mb-3 sm:mb-4">Additional Information</h2>
        <div className="grid grid-cols-1 gap-3 sm:gap-4">
          {renderField('Cover Letter', 'cover_letter', { 
            long: true, 
            placeholder: 'Dear Hiring Team,\n\nI am writing to express my interest in the position...' 
          })}
          {renderField('Additional Info', 'additional_info', { 
            long: true, 
            placeholder: 'Any additional information you want to share about the candidate...' 
          })}
        </div>
      </div>

      {/* Actions */}
      <div className="flex flex-col sm:flex-row items-center gap-3 pb-4">
        <button
          onClick={handleSave}
          disabled={saving}
          className="w-full sm:w-auto px-6 py-2.5 bg-blue-500/20 text-blue-400 border border-blue-500/30 rounded-xl text-sm font-medium hover:bg-blue-500/30 transition-all disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
        >
          {saving ? (
            <span className="flex items-center justify-center gap-2">
              <svg className="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Creating...
            </span>
          ) : (
            'Create Application'
          )}
        </button>
        <button
          onClick={() => router.back()}
          className="w-full sm:w-auto px-6 py-2.5 bg-[#1a1a1a] text-gray-300 border border-[#2a2a2a] rounded-xl text-sm font-medium hover:text-white hover:border-gray-600 transition-all cursor-pointer"
        >
          Cancel
        </button>
      </div>
    </div>
  );
}