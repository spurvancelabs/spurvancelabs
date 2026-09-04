'use client';

import { useState, useEffect } from 'react';

interface JobFormData {
  title: string;
  department: string;
  type: string;
  location: string;
  salary: string;
  salaryMin: string;
  salaryMax: string;
  skills: string;
  description: string;
  icon: string;
  status: string;
}

interface JobFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: JobFormData) => void;
  initialData?: JobFormData | null;
  isLoading?: boolean;
}

const defaultForm: JobFormData = {
  title: '', department: '', type: 'Full-time', location: '',
  salary: '', salaryMin: '', salaryMax: '', skills: '',
  description: '', icon: '', status: 'ACTIVE',
};

export default function JobFormModal({ isOpen, onClose, onSubmit, initialData, isLoading }: JobFormModalProps) {
  const [form, setForm] = useState<JobFormData>(defaultForm);
  const [errors, setErrors] = useState<Partial<Record<keyof JobFormData, string>>>({});

  useEffect(() => {
    if (initialData) {
      setForm(initialData);
    } else {
      setForm(defaultForm);
    }
    setErrors({});
  }, [initialData, isOpen]);

  if (!isOpen) return null;

  const validate = (): boolean => {
    const newErrors: Partial<Record<keyof JobFormData, string>> = {};
    if (!form.title.trim()) newErrors.title = 'Title is required';
    if (!form.department.trim()) newErrors.department = 'Department is required';
    if (!form.type.trim()) newErrors.type = 'Type is required';
    if (!form.location.trim()) newErrors.location = 'Location is required';
    if (!form.description.trim()) newErrors.description = 'Description is required';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
    if (errors[name as keyof JobFormData]) {
      setErrors(prev => ({ ...prev, [name]: undefined }));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    onSubmit(form);
  };

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
      <style>{`.modal-scroll::-webkit-scrollbar{width:4px}.modal-scroll::-webkit-scrollbar-track{background:transparent}.modal-scroll::-webkit-scrollbar-thumb{background:#1a1a1a;border-radius:4px}.modal-scroll::-webkit-scrollbar-thumb:hover{background:#2a2a2a}`}</style>
      <div className="bg-[#0a0a0a] border border-[#1a1a1a] rounded-xl max-w-2xl w-full flex flex-col max-h-[90vh]">
        <div className="sticky top-0 bg-[#0a0a0a] border-b border-[#1a1a1a] px-6 py-4 flex items-center justify-between z-10 shrink-0">
          <h2 className="text-white text-lg font-semibold">
            {initialData ? 'Edit Job' : 'Add New Job'}
          </h2>
          <button onClick={onClose} className="text-gray-400 hover:text-white text-xl cursor-pointer">✕</button>
        </div>
        <form id="job-form" onSubmit={handleSubmit} className="flex-1 overflow-y-auto modal-scroll p-6 space-y-4" noValidate>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="md:col-span-2">
              <label className="block text-gray-400 text-sm mb-1">Title *</label>
              <input type="text" name="title" value={form.title} onChange={handleChange}
                className={`w-full bg-[#1a1a1a] border rounded-lg px-4 py-2.5 text-white text-sm focus:outline-none focus:border-blue-500 ${errors.title ? 'border-red-500/60' : 'border-[#2a2a2a]'}`} />
              {errors.title && <p className="text-red-400 text-xs mt-1">{errors.title}</p>}
            </div>
            <div>
              <label className="block text-gray-400 text-sm mb-1">Department *</label>
              <input type="text" name="department" value={form.department} onChange={handleChange}
                className={`w-full bg-[#1a1a1a] border rounded-lg px-4 py-2.5 text-white text-sm focus:outline-none focus:border-blue-500 ${errors.department ? 'border-red-500/60' : 'border-[#2a2a2a]'}`} />
              {errors.department && <p className="text-red-400 text-xs mt-1">{errors.department}</p>}
            </div>
            <div>
              <label className="block text-gray-400 text-sm mb-1">Type *</label>
              <select name="type" value={form.type} onChange={handleChange}
                className="w-full bg-[#1a1a1a] border border-[#2a2a2a] rounded-lg px-4 py-2.5 text-white text-sm focus:outline-none focus:border-blue-500">
                {['Full-time', 'Part-time', 'Contract', 'Freelance', 'Remote'].map(t => (
                  <option key={t} value={t}>{t}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-gray-400 text-sm mb-1">Location *</label>
              <input type="text" name="location" value={form.location} onChange={handleChange}
                className={`w-full bg-[#1a1a1a] border rounded-lg px-4 py-2.5 text-white text-sm focus:outline-none focus:border-blue-500 ${errors.location ? 'border-red-500/60' : 'border-[#2a2a2a]'}`} />
              {errors.location && <p className="text-red-400 text-xs mt-1">{errors.location}</p>}
            </div>
            <div>
              <label className="block text-gray-400 text-sm mb-1">Salary (display)</label>
              <input type="text" name="salary" value={form.salary} onChange={handleChange}
                className="w-full bg-[#1a1a1a] border border-[#2a2a2a] rounded-lg px-4 py-2.5 text-white text-sm focus:outline-none focus:border-blue-500" placeholder="$80,000 - $100,000" />
            </div>
            <div>
              <label className="block text-gray-400 text-sm mb-1">Salary Min</label>
              <input type="number" name="salaryMin" value={form.salaryMin} onChange={handleChange}
                className="w-full bg-[#1a1a1a] border border-[#2a2a2a] rounded-lg px-4 py-2.5 text-white text-sm focus:outline-none focus:border-blue-500" />
            </div>
            <div>
              <label className="block text-gray-400 text-sm mb-1">Salary Max</label>
              <input type="number" name="salaryMax" value={form.salaryMax} onChange={handleChange}
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
              <textarea name="description" rows={4} value={form.description} onChange={handleChange}
                className={`w-full bg-[#1a1a1a] border rounded-lg px-4 py-2.5 text-white text-sm focus:outline-none focus:border-blue-500 resize-vertical ${errors.description ? 'border-red-500/60' : 'border-[#2a2a2a]'}`} />
              {errors.description && <p className="text-red-400 text-xs mt-1">{errors.description}</p>}
            </div>
            <div className="md:col-span-2">
              <label className="block text-gray-400 text-sm mb-1">Icon URL</label>
              <input type="url" name="icon" value={form.icon} onChange={handleChange}
                className="w-full bg-[#1a1a1a] border border-[#2a2a2a] rounded-lg px-4 py-2.5 text-white text-sm focus:outline-none focus:border-blue-500" />
            </div>
          </div>
        </form>
        <div className="sticky bottom-0 bg-[#0a0a0a] border-t border-[#1a1a1a] px-6 py-4 shrink-0">
          <div className="flex gap-3">
            <button type="button" onClick={onClose}
              className="flex-1 bg-[#1a1a1a] text-gray-400 border border-[#2a2a2a] px-4 py-2.5 rounded-lg text-sm font-medium hover:bg-[#2a2a2a] hover:text-white transition-all cursor-pointer">
              Cancel
            </button>
            <button type="submit" form="job-form" disabled={isLoading}
              className="flex-1 bg-blue-500 text-white px-4 py-2.5 rounded-lg text-sm font-medium hover:bg-blue-600 transition-all cursor-pointer disabled:opacity-50">
              {isLoading ? 'Saving...' : initialData ? 'Update Job' : 'Create Job'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
