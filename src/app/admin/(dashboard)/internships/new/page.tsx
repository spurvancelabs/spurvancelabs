'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import toast from 'react-hot-toast';

const defaultForm = {
  title: '', department: '', duration: '3 months', location: '',
  stipend: '', stipendAmount: '', skills: '',
  description: '', icon: '', status: 'ACTIVE',
};

type FormErrors = Partial<Record<keyof typeof defaultForm, string>>;

function validateForm(form: typeof defaultForm): FormErrors {
  const errors: FormErrors = {};
  if (!form.title.trim()) errors.title = 'Title is required';
  if (!form.department.trim()) errors.department = 'Department is required';
  if (!form.location.trim()) errors.location = 'Location is required';
  if (!form.description.trim()) errors.description = 'Description is required';
  return errors;
}

export default function NewInternshipPage() {
  const router = useRouter();
  const [form, setForm] = useState(defaultForm);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<FormErrors>({});

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
    if (errors[name as keyof typeof defaultForm]) {
      setErrors(prev => ({ ...prev, [name]: undefined }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const validationErrors = validateForm(form);
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }
    setErrors({});
    setLoading(true);
    try {
      const payload = {
        ...form,
        skills: form.skills ? form.skills.split(',').map((s: string) => s.trim()) : [],
        stipendAmount: form.stipendAmount ? parseInt(form.stipendAmount) : null,
      };
      const res = await fetch('/api/admin/internships', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      if (!res.ok) throw new Error('Failed to create');
      toast.success('Internship created successfully');
      router.push('/admin/internships');
    } catch (err: any) {
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      <Link href="/admin/internships" className="inline-flex items-center gap-2 text-gray-400 hover:text-white text-sm transition-colors mb-6">
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.5 12h-15m0 0l6.75 6.75M4.5 12l6.75-6.75" /></svg>
        Back to Internships
      </Link>

      <div className="bg-zinc-900/50 border border-white/[0.06] rounded-2xl">
        <div className="border-b border-white/[0.06] px-6 py-4">
          <h1 className="text-lg font-semibold text-white">Add New Internship</h1>
        </div>
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="md:col-span-2">
              <label className="block text-gray-400 text-sm mb-1">Title *</label>
              <input type="text" name="title" required value={form.title} onChange={handleChange}
                className={`w-full bg-[#1a1a1a] border rounded-lg px-4 py-2.5 text-white text-sm focus:outline-none ${errors.title ? 'border-red-500 focus:border-red-500' : 'border-[#2a2a2a] focus:border-blue-500'}`} />
              {errors.title && <p className="text-red-400 text-xs mt-1">{errors.title}</p>}
            </div>
            <div>
              <label className="block text-gray-400 text-sm mb-1">Department *</label>
              <input type="text" name="department" required value={form.department} onChange={handleChange}
                className={`w-full bg-[#1a1a1a] border rounded-lg px-4 py-2.5 text-white text-sm focus:outline-none ${errors.department ? 'border-red-500 focus:border-red-500' : 'border-[#2a2a2a] focus:border-blue-500'}`} />
              {errors.department && <p className="text-red-400 text-xs mt-1">{errors.department}</p>}
            </div>
            <div>
              <label className="block text-gray-400 text-sm mb-1">Duration *</label>
              <select name="duration" value={form.duration} onChange={handleChange}
                className="w-full bg-[#1a1a1a] border border-[#2a2a2a] rounded-lg px-4 py-2.5 text-white text-sm focus:outline-none focus:border-blue-500">
                {['1 month', '2 months', '3 months', '4 months', '6 months', 'Summer'].map(t => (
                  <option key={t} value={t}>{t}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-gray-400 text-sm mb-1">Location *</label>
              <input type="text" name="location" required value={form.location} onChange={handleChange}
                className={`w-full bg-[#1a1a1a] border rounded-lg px-4 py-2.5 text-white text-sm focus:outline-none ${errors.location ? 'border-red-500 focus:border-red-500' : 'border-[#2a2a2a] focus:border-blue-500'}`} />
              {errors.location && <p className="text-red-400 text-xs mt-1">{errors.location}</p>}
            </div>
            <div>
              <label className="block text-gray-400 text-sm mb-1">Stipend (display)</label>
              <input type="text" name="stipend" value={form.stipend} onChange={handleChange}
                className="w-full bg-[#1a1a1a] border border-[#2a2a2a] rounded-lg px-4 py-2.5 text-white text-sm focus:outline-none focus:border-blue-500" placeholder="$1,000/month" />
            </div>
            <div>
              <label className="block text-gray-400 text-sm mb-1">Stipend Amount</label>
              <input type="number" name="stipendAmount" value={form.stipendAmount} onChange={handleChange}
                className="w-full bg-[#1a1a1a] border border-[#2a2a2a] rounded-lg px-4 py-2.5 text-white text-sm focus:outline-none focus:border-blue-500" />
            </div>
            <div>
              <label className="block text-gray-400 text-sm mb-1">Status</label>
              <select name="status" value={form.status} onChange={handleChange}
                className="w-full bg-[#1a1a1a] border border-[#2a2a2a] rounded-lg px-4 py-2.5 text-white text-sm focus:outline-none focus:border-blue-500">
                <option value="ACTIVE">Active</option>
                <option value="CLOSED">Closed</option>
                <option value="DRAFT">Draft</option>
              </select>
            </div>
            <div className="md:col-span-2">
              <label className="block text-gray-400 text-sm mb-1">Skills (comma separated)</label>
              <input type="text" name="skills" value={form.skills} onChange={handleChange}
                className="w-full bg-[#1a1a1a] border border-[#2a2a2a] rounded-lg px-4 py-2.5 text-white text-sm focus:outline-none focus:border-blue-500" placeholder="React, Node.js, TypeScript" />
            </div>
            <div className="md:col-span-2">
              <label className="block text-gray-400 text-sm mb-1">Description *</label>
              <textarea name="description" required rows={4} value={form.description} onChange={handleChange}
                className={`w-full bg-[#1a1a1a] border rounded-lg px-4 py-2.5 text-white text-sm focus:outline-none resize-vertical ${errors.description ? 'border-red-500 focus:border-red-500' : 'border-[#2a2a2a] focus:border-blue-500'}`} />
              {errors.description && <p className="text-red-400 text-xs mt-1">{errors.description}</p>}
            </div>
            <div className="md:col-span-2">
              <label className="block text-gray-400 text-sm mb-1">Icon URL</label>
              <input type="url" name="icon" value={form.icon} onChange={handleChange}
                className="w-full bg-[#1a1a1a] border border-[#2a2a2a] rounded-lg px-4 py-2.5 text-white text-sm focus:outline-none focus:border-blue-500" />
            </div>
          </div>
          <div className="flex gap-3 pt-2">
            <Link href="/admin/internships"
              className="flex-1 bg-[#1a1a1a] text-gray-400 border border-[#2a2a2a] px-4 py-2.5 rounded-lg text-sm font-medium hover:bg-[#2a2a2a] hover:text-white transition-all text-center">
              Cancel
            </Link>
            <button type="submit" disabled={loading}
              className="flex-1 bg-blue-500 text-white px-4 py-2.5 rounded-lg text-sm font-medium hover:bg-blue-600 transition-all cursor-pointer disabled:opacity-50">
              {loading ? 'Creating...' : 'Create Internship'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
