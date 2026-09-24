'use client';

import { useState, useRef, useCallback } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';

interface AddCertificateModalProps {
  onClose: () => void;
  nextId?: string;
}

const ALLOWED = ['image/jpeg', 'image/png', 'image/webp', 'application/pdf'];

export default function AddCertificateModal({ onClose, nextId }: AddCertificateModalProps) {
  const queryClient = useQueryClient();
  const [certificateId, setCertificateId] = useState(nextId || '');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [internshipField, setInternshipField] = useState('');
  const [performance, setPerformance] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [formError, setFormError] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFile = useCallback((selected: File | undefined | null) => {
    setFormError('');
    if (!selected) return;
    if (!ALLOWED.includes(selected.type)) {
      setFormError('Invalid file type. Use JPG, PNG, WebP, or PDF.');
      return;
    }
    if (selected.size > 15 * 1024 * 1024) {
      setFormError('File is too large. Maximum size is 15MB.');
      return;
    }
    setFile(selected);
    if (previewUrl) URL.revokeObjectURL(previewUrl);
    setPreviewUrl(URL.createObjectURL(selected));
  }, [previewUrl]);

  const createMutation = useMutation({
    mutationFn: async () => {
      const formData = new FormData();
      formData.append('certificateId', certificateId.trim());
      formData.append('name', name.trim());
      formData.append('email', email.trim());
      formData.append('internshipField', internshipField.trim());
      formData.append('performance', performance.trim());
      formData.append('startDate', startDate);
      formData.append('endDate', endDate);
      if (file) formData.append('file', file);

      const res = await fetch('/api/admin/certificates', {
        method: 'POST',
        body: formData,
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.error || 'Failed to create certificate');
      return data;
    },
    onSuccess: () => {
      toast.success('Certificate created successfully');
      queryClient.invalidateQueries({ queryKey: ['admin-certificates'] });
      onClose();
    },
    onError: (error: any) => {
      setFormError(error.message || 'Failed to create certificate');
    },
  });

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    setFormError('');
    const certId = certificateId.trim().toUpperCase();
    if (!certId) return setFormError('Certificate ID is required');
    if (!/^SPR-CERT-\d+$/.test(certId)) return setFormError('Certificate ID must look like SPR-CERT-0001');
    if (!name.trim()) return setFormError('Name is required');
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) return setFormError('A valid email is required');
    if (!internshipField.trim()) return setFormError('Internship field is required');
    if (!performance.trim()) return setFormError('Performance is required');
    if (!startDate) return setFormError('Start date is required');
    if (!endDate) return setFormError('End date is required');
    if (startDate > endDate) return setFormError('Start date cannot be after end date');
    if (!file) return setFormError('Please attach the certificate file (image or PDF)');
    createMutation.mutate();
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-zinc-900 border border-white/[0.06] rounded-2xl w-full max-w-2xl shadow-2xl max-h-[90vh] flex flex-col">
        <div className="flex items-center justify-between p-5 border-b border-white/[0.06]">
          <div>
            <h2 className="text-lg font-semibold text-white">Add Certificate</h2>
            <p className="text-sm text-gray-500 mt-0.5">Issues a new internship certificate</p>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-white cursor-pointer">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <form onSubmit={submit} className="p-5 space-y-4 overflow-y-auto">
          {formError && (
            <div className="bg-red-500/10 border border-red-500/20 text-red-400 text-sm px-4 py-2 rounded-lg">{formError}</div>
          )}

          <div>
            <label className="block text-sm text-gray-400 mb-1.5">Certificate ID *</label>
            <input
              type="text"
              value={certificateId}
              onChange={(e) => setCertificateId(e.target.value.toUpperCase())}
              className="w-full bg-zinc-800 border border-white/[0.06] rounded-lg px-3 py-2 text-white text-sm font-mono tracking-wide outline-none focus:border-blue-500/50"
              placeholder="SPR-CERT-0001"
              maxLength={30}
            />
            <p className="text-xs text-gray-500 mt-1">
              {nextId ? `Suggested next ID: ${nextId} — you can change it.` : 'Must look like SPR-CERT-0001'}
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm text-gray-400 mb-1.5">Name *</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full bg-zinc-800 border border-white/[0.06] rounded-lg px-3 py-2 text-white text-sm outline-none focus:border-blue-500/50"
                placeholder="Jane Doe"
                autoFocus
              />
            </div>
            <div>
              <label className="block text-sm text-gray-400 mb-1.5">Email *</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-zinc-800 border border-white/[0.06] rounded-lg px-3 py-2 text-white text-sm outline-none focus:border-blue-500/50"
                placeholder="jane@example.com"
              />
            </div>
            <div>
              <label className="block text-sm text-gray-400 mb-1.5">Internship Field *</label>
              <input
                type="text"
                value={internshipField}
                onChange={(e) => setInternshipField(e.target.value)}
                className="w-full bg-zinc-800 border border-white/[0.06] rounded-lg px-3 py-2 text-white text-sm outline-none focus:border-blue-500/50"
                placeholder="Software Development"
              />
            </div>
            <div>
              <label className="block text-sm text-gray-400 mb-1.5">Performance *</label>
              <input
                type="text"
                value={performance}
                onChange={(e) => setPerformance(e.target.value)}
                className="w-full bg-zinc-800 border border-white/[0.06] rounded-lg px-3 py-2 text-white text-sm outline-none focus:border-blue-500/50"
                placeholder="Outstanding"
              />
            </div>
            <div>
              <label className="block text-sm text-gray-400 mb-1.5">Start Date *</label>
              <input
                type="date"
                value={startDate}
                max={endDate || undefined}
                onChange={(e) => setStartDate(e.target.value)}
                className="w-full bg-zinc-800 border border-white/[0.06] rounded-lg px-3 py-2 text-white text-sm outline-none focus:border-blue-500/50"
              />
            </div>
            <div>
              <label className="block text-sm text-gray-400 mb-1.5">End Date *</label>
              <input
                type="date"
                value={endDate}
                min={startDate || undefined}
                onChange={(e) => setEndDate(e.target.value)}
                className="w-full bg-zinc-800 border border-white/[0.06] rounded-lg px-3 py-2 text-white text-sm outline-none focus:border-blue-500/50"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm text-gray-400 mb-1.5">Certificate File *</label>
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              onDragOver={(e) => e.preventDefault()}
              onDrop={(e) => {
                e.preventDefault();
                handleFile(e.dataTransfer.files?.[0]);
              }}
              className="w-full border-2 border-dashed border-white/10 hover:border-blue-500/40 rounded-xl p-6 text-center transition-colors cursor-pointer bg-white/[0.02]"
            >
              {previewUrl && file ? (
                <div className="flex flex-col items-center gap-3">
                  {file.type === 'application/pdf' ? (
                    <div className="w-12 h-12 rounded-xl bg-red-500/10 flex items-center justify-center">
                      <svg className="w-6 h-6 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m2.25 0H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
                      </svg>
                    </div>
                  ) : (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={previewUrl}
                      alt="Certificate preview"
                      className="max-h-40 rounded-lg object-contain shadow-lg"
                    />
                  )}
                  <span className="text-xs text-gray-300 truncate max-w-full">{file.name}</span>
                  <span className="text-[10px] text-gray-500">Click or drop to replace</span>
                </div>
              ) : (
                <div className="flex flex-col items-center gap-2">
                  <div className="w-12 h-12 rounded-xl bg-blue-500/10 flex items-center justify-center">
                    <svg className="w-6 h-6 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5" />
                    </svg>
                  </div>
                  <span className="text-sm text-gray-300">Click to upload or drag & drop</span>
                  <span className="text-xs text-gray-500">JPG, PNG, WebP, or PDF · up to 15MB</span>
                </div>
              )}
              <input
                ref={fileInputRef}
                type="file"
                accept="image/jpeg,image/png,image/webp,application/pdf,.jpg,.jpeg,.png,.webp,.pdf"
                className="hidden"
                onChange={(e) => handleFile(e.target.files?.[0])}
              />
            </button>
          </div>

          <div className="flex justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm text-gray-400 hover:text-white transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={createMutation.isPending}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-lg transition-colors disabled:opacity-50 cursor-pointer"
            >
              {createMutation.isPending ? 'Issuing...' : 'Issue Certificate'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}