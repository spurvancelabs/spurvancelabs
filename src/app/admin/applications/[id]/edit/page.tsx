'use client';

import { useState } from 'react';
import { useParams, useSearchParams, useRouter } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import toast from 'react-hot-toast';

export default function EditApplicationPage() {
  const params = useParams();
  const searchParams = useSearchParams();
  const router = useRouter();
  const id = params.id as string;
  const type = searchParams.get('type') || 'job';

  const { data, isLoading } = useQuery({
    queryKey: ['admin-application-detail', id, type],
    queryFn: async () => {
      const res = await fetch(`/api/admin/applications/${id}?type=${type}`);
      if (!res.ok) throw new Error('Failed to fetch');
      const json = await res.json();
      return json.application;
    },
  });

  const isJob = data?.applicationType === 'job';

  const [form, setForm] = useState<any>(null);
  const [saving, setSaving] = useState(false);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!data) {
    return (
      <div className="text-center py-16">
        <p className="text-gray-500">Application not found.</p>
      </div>
    );
  }

  const app = data;
  if (!form) setForm({
    name: app.name || '',
    email: app.email || '',
    phone: app.phone || '',
    current_company: app.current_company || '',
    current_position: app.current_position || '',
    years_of_experience: app.years_of_experience || '',
    linkedin_url: app.linkedin_url || '',
    portfolio_url: app.portfolio_url || '',
    salary_expectation: app.salary_expectation || '',
    start_date: app.start_date ? app.start_date.split('T')[0] : '',
    work_authorization: app.work_authorization || '',
    referral_source: app.referral_source || '',
    cover_letter: app.cover_letter || '',
    additional_info: app.additional_info || '',
    university: app.university || '',
    major: app.major || '',
    year_of_study: app.year_of_study || '',
    graduation_date: app.graduation_date ? app.graduation_date.split('T')[0] : '',
    gpa: app.gpa || '',
    github_url: app.github_url || '',
    available_start_date: app.available_start_date ? app.available_start_date.split('T')[0] : '',
    availability_duration: app.availability_duration || '',
  });

  if (!form) return null;

  const handleChange = (key: string, value: string) => setForm({ ...form, [key]: value });

  const handleSave = async () => {
    setSaving(true);
    try {
      const res = await fetch(`/api/admin/applications/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...form, type }),
      });
      if (!res.ok) throw new Error('Failed to save');
      toast.success('Application updated');
      router.push(`/admin/applications/${id}?type=${type}`);
    } catch (err: any) {
      toast.error(err.message);
    } finally {
      setSaving(false);
    }
  };

  const renderField = (label: string, key: string, opts?: { type?: string; long?: boolean; placeholder?: string }) => {
    const common = 'w-full bg-[#1a1a1a] border border-[#2a2a2a] rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-blue-500';
    return (
      <div key={key} className={opts?.long ? 'col-span-2' : ''}>
        <label className="text-xs text-gray-400 block mb-1">{label}</label>
        {opts?.long ? (
          <textarea
            rows={4}
            value={form[key] || ''}
            onChange={e => handleChange(key, e.target.value)}
            placeholder={opts?.placeholder || ''}
            className={`${common} resize-none`}
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
    <div className="space-y-6 max-w-3xl">
      <div className="flex items-center gap-4">
        <button onClick={() => router.back()} className="p-2 text-gray-400 hover:text-white hover:bg-white/5 rounded-lg transition-all cursor-pointer">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" /></svg>
        </button>
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-white">Edit Application</h1>
          <p className="text-gray-400 text-sm mt-0.5">{app.name} &middot; {app.postingTitle || 'Unknown Position'}</p>
        </div>
      </div>

      <div className="bg-zinc-900/50 border border-white/[0.06] rounded-2xl p-6">
        <h2 className="text-lg font-semibold text-white mb-4">Personal Information</h2>
        <div className="grid grid-cols-2 gap-x-6 gap-y-4">
          {renderField('Name', 'name')}
          {renderField('Email', 'email', { type: 'email' })}
          {renderField('Phone', 'phone', { placeholder: '+1234567890' })}
          {renderField('LinkedIn URL', 'linkedin_url', { placeholder: 'https://linkedin.com/in/...' })}
        </div>
      </div>

      {isJob ? (
        <div className="bg-zinc-900/50 border border-white/[0.06] rounded-2xl p-6">
          <h2 className="text-lg font-semibold text-white mb-4">Professional Details</h2>
          <div className="grid grid-cols-2 gap-x-6 gap-y-4">
            {renderField('Current Company', 'current_company')}
            {renderField('Current Position', 'current_position')}
            {renderField('Years of Experience', 'years_of_experience', { type: 'number' })}
            {renderField('Portfolio URL', 'portfolio_url', { placeholder: 'https://...' })}
            {renderField('Salary Expectation', 'salary_expectation')}
            {renderField('Start Date', 'start_date', { type: 'date' })}
            {renderField('Work Authorization', 'work_authorization')}
            {renderField('Referral Source', 'referral_source')}
            {renderField('Cover Letter', 'cover_letter', { long: true })}
            {renderField('Additional Info', 'additional_info', { long: true })}
          </div>
        </div>
      ) : (
        <div className="bg-zinc-900/50 border border-white/[0.06] rounded-2xl p-6">
          <h2 className="text-lg font-semibold text-white mb-4">Academic Details</h2>
          <div className="grid grid-cols-2 gap-x-6 gap-y-4">
            {renderField('University', 'university')}
            {renderField('Major', 'major')}
            {renderField('Year of Study', 'year_of_study')}
            {renderField('Graduation Date', 'graduation_date', { type: 'date' })}
            {renderField('GPA', 'gpa')}
            {renderField('GitHub URL', 'github_url', { placeholder: 'https://github.com/...' })}
            {renderField('Available Start Date', 'available_start_date', { type: 'date' })}
            {renderField('Availability Duration', 'availability_duration')}
            {renderField('Work Authorization', 'work_authorization')}
            {renderField('Referral Source', 'referral_source')}
            {renderField('Cover Letter', 'cover_letter', { long: true })}
            {renderField('Additional Info', 'additional_info', { long: true })}
          </div>
        </div>
      )}

      <div className="flex items-center gap-3">
        <button
          onClick={handleSave}
          disabled={saving}
          className="px-6 py-2.5 bg-blue-500/20 text-blue-400 border border-blue-500/30 rounded-xl text-sm font-medium hover:bg-blue-500/30 transition-all disabled:opacity-50 cursor-pointer"
        >
          {saving ? 'Saving...' : 'Save Changes'}
        </button>
        <button
          onClick={() => router.back()}
          className="px-6 py-2.5 bg-[#1a1a1a] text-gray-300 border border-[#2a2a2a] rounded-xl text-sm font-medium hover:text-white hover:border-gray-600 transition-all cursor-pointer"
        >
          Cancel
        </button>
      </div>
    </div>
  );
}
