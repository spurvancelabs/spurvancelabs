'use client';

import { useState, useEffect } from 'react';

interface InternshipFormData {
  title: string;
  department: string;
  duration: string;
  location: string;
  stipend: string;
  stipendAmount: string;
  skills: string;
  description: string;
  icon: string;
  status: string;
}

interface InternshipFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: InternshipFormData) => void;
  initialData?: InternshipFormData | null;
  isLoading?: boolean;
}

const defaultForm: InternshipFormData = {
  title: '', department: '', duration: '3 months', location: '',
  stipend: '', stipendAmount: '', skills: '',
  description: '', icon: '', status: 'ACTIVE',
};

type FormErrors = Partial<Record<keyof InternshipFormData, string>>;

function validateForm(form: InternshipFormData): FormErrors {
  const errors: FormErrors = {};
  if (!form.title.trim()) errors.title = 'Title is required';
  if (!form.department.trim()) errors.department = 'Department is required';
  if (!form.location.trim()) errors.location = 'Location is required';
  if (!form.description.trim()) errors.description = 'Description is required';
  return errors;
}

export default function InternshipFormModal({ isOpen, onClose, onSubmit, initialData, isLoading }: InternshipFormModalProps) {
  const [form, setForm] = useState<InternshipFormData>(defaultForm);
  const [errors, setErrors] = useState<FormErrors>({});

  useEffect(() => {
    if (initialData) {
      setForm(initialData);
    } else {
      setForm(defaultForm);
    }
    setErrors({});
  }, [initialData, isOpen]);

  if (!isOpen) return null;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
    if (errors[name as keyof InternshipFormData]) {
      setErrors(prev => ({ ...prev, [name]: undefined }));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const validationErrors = validateForm(form);
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }
    setErrors({});
    onSubmit(form);
  };

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
      <style>{`.modal-scroll::-webkit-scrollbar{width:4px}.modal-scroll::-webkit-scrollbar-track{background:transparent}.modal-scroll::-webkit-scrollbar-thumb{background:#1a1a1a;border-radius:4px}.modal-scroll::-webkit-scrollbar-thumb:hover{background:#2a2a2a}`}</style>
      <div className="bg-[#0a0a0a] border border-[#1a1a1a] rounded-xl max-w-2xl w-full flex flex-col max-h-[90vh]">
        <div className="sticky top-0 bg-[#0a0a0a] border-b border-[#1a1a1a] px-6 py-4 flex items-center justify-between z-10 shrink-0">
          <h2 className="text-white text-lg font-semibold">
            {initialData ? 'Edit Internship' : 'Add New Internship'}
          </h2>
          <button onClick={onClose} className="text-gray-400 hover:text-white text-xl cursor-pointer">✕</button>
        </div>
        <form className="flex-1 overflow-y-auto modal-scroll p-6 space-y-4">
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
        </form>
        <div className="sticky bottom-0 bg-[#0a0a0a] border-t border-[#1a1a1a] px-6 py-4 shrink-0">
          <div className="flex gap-3">
            <button type="button" onClick={onClose}
              className="flex-1 bg-[#1a1a1a] text-gray-400 border border-[#2a2a2a] px-4 py-2.5 rounded-lg text-sm font-medium hover:bg-[#2a2a2a] hover:text-white transition-all cursor-pointer">
              Cancel
            </button>
            <button type="button" disabled={isLoading} onClick={handleSubmit}
              className="flex-1 bg-blue-500 text-white px-4 py-2.5 rounded-lg text-sm font-medium hover:bg-blue-600 transition-all cursor-pointer disabled:opacity-50">
              {isLoading ? 'Saving...' : initialData ? 'Update Internship' : 'Create Internship'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
