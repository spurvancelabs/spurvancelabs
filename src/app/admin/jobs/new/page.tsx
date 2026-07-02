'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import toast from 'react-hot-toast';

const defaultForm = {
  title: '', department: '', type: 'Full-time', location: '',
  salary: '', salaryMin: '', salaryMax: '', skills: '',
  description: '', icon: '', status: 'ACTIVE',
};

export default function NewJobPage() {
  const router = useRouter();
  const [form, setForm] = useState(defaultForm);
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const payload = {
        ...form,
        skills: form.skills ? form.skills.split(',').map((s: string) => s.trim()) : [],
        salaryMin: form.salaryMin ? parseInt(form.salaryMin) : null,
        salaryMax: form.salaryMax ? parseInt(form.salaryMax) : null,
      };
      const res = await fetch('/api/admin/jobs', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      if (!res.ok) throw new Error('Failed to create');
      toast.success('Job created successfully');
      router.push('/admin/jobs');
    } catch (err: any) {
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-3 xs:px-4 sm:px-6 md:px-8">
      <Link href="/admin/jobs" className="inline-flex items-center gap-2 text-gray-400 hover:text-white text-sm transition-colors mb-4 sm:mb-6">
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.5 12h-15m0 0l6.75 6.75M4.5 12l6.75-6.75" /></svg>
        Back to Jobs
      </Link>

      <div className="bg-zinc-900/50 border border-white/[0.06] rounded-2xl overflow-hidden">
        <div className="border-b border-white/[0.06] px-4 sm:px-6 py-3 sm:py-4">
          <h1 className="text-base sm:text-lg font-semibold text-white">Add New Job</h1>
        </div>
        
        <form onSubmit={handleSubmit} className="p-4 sm:p-6 space-y-4 sm:space-y-5">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
            {/* Title - Full Width */}
            <div className="sm:col-span-2">
              <label className="block text-gray-400 text-xs sm:text-sm mb-1 font-medium">Title *</label>
              <input 
                type="text" 
                name="title" 
                required 
                value={form.title} 
                onChange={handleChange}
                className="w-full bg-[#1a1a1a] border border-[#2a2a2a] rounded-lg px-3 sm:px-4 py-2 sm:py-2.5 text-white text-sm focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500/20 transition-all" 
                placeholder="Enter job title"
              />
            </div>

            {/* Department */}
            <div>
              <label className="block text-gray-400 text-xs sm:text-sm mb-1 font-medium">Department *</label>
              <input 
                type="text" 
                name="department" 
                required 
                value={form.department} 
                onChange={handleChange}
                className="w-full bg-[#1a1a1a] border border-[#2a2a2a] rounded-lg px-3 sm:px-4 py-2 sm:py-2.5 text-white text-sm focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500/20 transition-all" 
                placeholder="e.g., Engineering"
              />
            </div>

            {/* Job Type */}
            <div>
              <label className="block text-gray-400 text-xs sm:text-sm mb-1 font-medium">Type *</label>
              <select 
                name="type" 
                value={form.type} 
                onChange={handleChange}
                className="w-full bg-[#1a1a1a] border border-[#2a2a2a] rounded-lg px-3 sm:px-4 py-2 sm:py-2.5 text-white text-sm focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500/20 transition-all"
              >
                {['Full-time', 'Part-time', 'Contract', 'Freelance', 'Remote'].map(t => (
                  <option key={t} value={t}>{t}</option>
                ))}
              </select>
            </div>

            {/* Location */}
            <div>
              <label className="block text-gray-400 text-xs sm:text-sm mb-1 font-medium">Location *</label>
              <input 
                type="text" 
                name="location" 
                required 
                value={form.location} 
                onChange={handleChange}
                className="w-full bg-[#1a1a1a] border border-[#2a2a2a] rounded-lg px-3 sm:px-4 py-2 sm:py-2.5 text-white text-sm focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500/20 transition-all" 
                placeholder="e.g., New York, Remote"
              />
            </div>

            {/* Salary Display */}
            <div>
              <label className="block text-gray-400 text-xs sm:text-sm mb-1 font-medium">Salary (display)</label>
              <input 
                type="text" 
                name="salary" 
                value={form.salary} 
                onChange={handleChange}
                className="w-full bg-[#1a1a1a] border border-[#2a2a2a] rounded-lg px-3 sm:px-4 py-2 sm:py-2.5 text-white text-sm focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500/20 transition-all" 
                placeholder="$80,000 - $100,000"
              />
            </div>

            {/* Salary Min */}
            <div>
              <label className="block text-gray-400 text-xs sm:text-sm mb-1 font-medium">Salary Min</label>
              <input 
                type="number" 
                name="salaryMin" 
                value={form.salaryMin} 
                onChange={handleChange}
                className="w-full bg-[#1a1a1a] border border-[#2a2a2a] rounded-lg px-3 sm:px-4 py-2 sm:py-2.5 text-white text-sm focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500/20 transition-all" 
                placeholder="50000"
              />
            </div>

            {/* Salary Max */}
            <div>
              <label className="block text-gray-400 text-xs sm:text-sm mb-1 font-medium">Salary Max</label>
              <input 
                type="number" 
                name="salaryMax" 
                value={form.salaryMax} 
                onChange={handleChange}
                className="w-full bg-[#1a1a1a] border border-[#2a2a2a] rounded-lg px-3 sm:px-4 py-2 sm:py-2.5 text-white text-sm focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500/20 transition-all" 
                placeholder="100000"
              />
            </div>

            {/* Status */}
            <div>
              <label className="block text-gray-400 text-xs sm:text-sm mb-1 font-medium">Status</label>
              <select 
                name="status" 
                value={form.status} 
                onChange={handleChange}
                className="w-full bg-[#1a1a1a] border border-[#2a2a2a] rounded-lg px-3 sm:px-4 py-2 sm:py-2.5 text-white text-sm focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500/20 transition-all"
              >
                <option value="ACTIVE">Active</option>
                <option value="CLOSED">Closed</option>
                <option value="DRAFT">Draft</option>
              </select>
            </div>

            {/* Skills - Full Width */}
            <div className="sm:col-span-2">
              <label className="block text-gray-400 text-xs sm:text-sm mb-1 font-medium">Skills (comma separated)</label>
              <input 
                type="text" 
                name="skills" 
                value={form.skills} 
                onChange={handleChange}
                className="w-full bg-[#1a1a1a] border border-[#2a2a2a] rounded-lg px-3 sm:px-4 py-2 sm:py-2.5 text-white text-sm focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500/20 transition-all" 
                placeholder="React, Node.js, TypeScript, PostgreSQL"
              />
            </div>

            {/* Description - Full Width */}
            <div className="sm:col-span-2">
              <label className="block text-gray-400 text-xs sm:text-sm mb-1 font-medium">Description *</label>
              <textarea 
                name="description" 
                required 
                rows={5} 
                value={form.description} 
                onChange={handleChange}
                className="w-full bg-[#1a1a1a] border border-[#2a2a2a] rounded-lg px-3 sm:px-4 py-2 sm:py-2.5 text-white text-sm focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500/20 transition-all resize-y min-h-[100px] sm:min-h-[120px]" 
                placeholder="Describe the job role, responsibilities, and requirements..."
              />
            </div>

            {/* Icon URL - Full Width */}
            <div className="sm:col-span-2">
              <label className="block text-gray-400 text-xs sm:text-sm mb-1 font-medium">Icon URL</label>
              <input 
                type="url" 
                name="icon" 
                value={form.icon} 
                onChange={handleChange}
                className="w-full bg-[#1a1a1a] border border-[#2a2a2a] rounded-lg px-3 sm:px-4 py-2 sm:py-2.5 text-white text-sm focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500/20 transition-all" 
                placeholder="https://example.com/icon.png"
              />
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-3 pt-4 sm:pt-6 border-t border-white/[0.06]">
            <Link href="/admin/jobs"
              className="flex-1 bg-[#1a1a1a] text-gray-400 border border-[#2a2a2a] px-4 py-2.5 rounded-lg text-sm font-medium hover:bg-[#2a2a2a] hover:text-white transition-all text-center order-2 sm:order-1">
              Cancel
            </Link>
            <button 
              type="submit" 
              disabled={loading}
              className="flex-1 bg-blue-500 text-white px-4 py-2.5 rounded-lg text-sm font-medium hover:bg-blue-600 transition-all cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed order-1 sm:order-2"
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <svg className="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Creating...
                </span>
              ) : (
                'Create Job'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}