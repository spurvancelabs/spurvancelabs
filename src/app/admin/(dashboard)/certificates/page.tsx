'use client';

import { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { ROLES, hasMinRole } from '@/lib/lms/roles';
import { buildDownloadUrl } from '@/lib/certificates/url';
import AddCertificateModal from '@/components/admin/AddCertificateModal';

interface IssuedCertificate {
  id: string;
  certificateId: string;
  name: string;
  email: string;
  internshipField: string;
  performance: string;
  startDate: string;
  endDate: string;
  fileType: string;
  fileUrl: string;
  createdAt: string;
}

export default function AdminCertificatesPage() {
  const queryClient = useQueryClient();
  const [isManager, setIsManager] = useState<boolean | null>(null);
  const [showAdd, setShowAdd] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [search, setSearch] = useState('');

  useEffect(() => {
    fetch('/api/auth/me')
      .then((r) => r.json())
      .then((data) => setIsManager(hasMinRole(data?.role, ROLES.ADMIN)))
      .catch(() => setIsManager(false));
  }, []);

  const { data, isLoading } = useQuery({
    queryKey: ['admin-certificates'],
    queryFn: async () => {
      const res = await fetch('/api/admin/certificates');
      if (!res.ok) throw new Error('Failed to fetch certificates');
      return res.json();
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const res = await fetch(`/api/admin/certificates/${id}`, { method: 'DELETE' });
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.error || 'Failed to delete certificate');
      }
      return res.json();
    },
    onSuccess: () => {
      toast.success('Certificate deleted');
      queryClient.invalidateQueries({ queryKey: ['admin-certificates'] });
      setDeleteId(null);
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to delete certificate');
      setDeleteId(null);
    },
  });

  if (isManager === false) {
    return (
      <div className="text-center py-24">
        <div className="w-16 h-16 rounded-full bg-red-500/10 flex items-center justify-center mx-auto mb-4">
          <svg className="w-8 h-8 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" />
          </svg>
        </div>
        <h2 className="text-xl font-semibold text-white">Restricted</h2>
        <p className="text-gray-400 text-sm mt-1">Only Admins and Super Admins can manage certificates.</p>
      </div>
    );
  }

  const certificates: IssuedCertificate[] = data?.certificates || [];
  const total = certificates.length;
  const images = certificates.filter((c) => c.fileType === 'image').length;
  const pdfs = certificates.filter((c) => c.fileType === 'pdf').length;

  const q = search.trim().toLowerCase();
  const filtered = certificates.filter(
    (c) =>
      !q ||
      c.name.toLowerCase().includes(q) ||
      c.email.toLowerCase().includes(q) ||
      c.certificateId.toLowerCase().includes(q) ||
      c.internshipField.toLowerCase().includes(q)
  );

  const stats = [
    { label: 'Total Certificates', value: total, color: 'text-blue-400' },
    { label: 'Images', value: images, color: 'text-emerald-400' },
    { label: 'PDFs', value: pdfs, color: 'text-cyan-400' },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-white">Certificates</h1>
          <p className="text-gray-400 text-sm mt-1">Issue and manage internship certificates</p>
        </div>
        <button
          onClick={() => setShowAdd(true)}
          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors cursor-pointer shrink-0"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.5v15m7.5-7.5h-15" />
          </svg>
          Add Certificate
        </button>
      </div>

      <div className="grid grid-cols-3 gap-3 sm:gap-4">
        {stats.map((stat, i) => (
          <div key={i} className="bg-zinc-900/80 border border-white/[0.06] rounded-2xl p-4">
            <p className="text-gray-400 text-xs font-medium uppercase tracking-wider">{stat.label}</p>
            <p className={`text-xl sm:text-2xl font-bold tracking-tight mt-1 ${stat.color}`}>{stat.value}</p>
          </div>
        ))}
      </div>

      <div className="relative max-w-xs mb-4">
        <svg className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
        </svg>
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search by name, email, or ID..."
          className="w-full bg-zinc-900 border border-white/[0.08] rounded-xl pl-9 pr-4 py-2.5 text-white placeholder-gray-500 focus:outline-none focus:border-blue-500/50 text-sm"
        />
      </div>

      <div className="bg-zinc-900/50 border border-white/[0.06] rounded-2xl overflow-hidden">
        {isLoading || isManager === null ? (
          <div className="flex items-center justify-center h-64">
            <div className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-16">
            <p className="text-gray-500">{search.trim() ? 'No certificates match your search.' : 'No certificates issued yet.'}</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-white/[0.06]">
                  <th className="text-left text-gray-400 text-xs font-medium uppercase tracking-wider px-6 py-4">Certificate ID</th>
                  <th className="text-left text-gray-400 text-xs font-medium uppercase tracking-wider px-6 py-4">Name</th>
                  <th className="text-left text-gray-400 text-xs font-medium uppercase tracking-wider px-6 py-4">Field</th>
                  <th className="text-left text-gray-400 text-xs font-medium uppercase tracking-wider px-6 py-4">Performance</th>
                  <th className="text-left text-gray-400 text-xs font-medium uppercase tracking-wider px-6 py-4">Dates</th>
                  <th className="text-left text-gray-400 text-xs font-medium uppercase tracking-wider px-6 py-4">File</th>
                  <th className="text-right text-gray-400 text-xs font-medium uppercase tracking-wider px-6 py-4">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/[0.06]">
                {filtered.map((cert) => (
                  <tr key={cert.id} className="hover:bg-white/[0.02] transition-colors">
                    <td className="px-6 py-4">
                      <span className="inline-flex px-2.5 py-1 rounded-lg bg-blue-500/10 text-blue-400 text-xs font-mono font-medium">
                        {cert.certificateId}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div>
                        <p className="text-white text-sm font-medium">{cert.name}</p>
                        <p className="text-gray-500 text-xs mt-0.5">{cert.email}</p>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-gray-400 text-sm">{cert.internshipField}</td>
                    <td className="px-6 py-4">
                      <span className="inline-flex px-2.5 py-1 rounded-full text-xs font-medium bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                        {cert.performance}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-gray-400 text-sm whitespace-nowrap">
                      {new Date(cert.startDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                      {' → '}
                      {new Date(cert.endDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                    </td>
                    <td className="px-6 py-4">
                      <a
                        href={buildDownloadUrl(cert.fileUrl)}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 text-xs text-gray-400 hover:text-white"
                      >
                        {cert.fileType === 'pdf' ? (
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m2.25 0H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
                          </svg>
                        ) : (
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 001.5-1.5V6a1.5 1.5 0 00-1.5-1.5H3.75A1.5 1.5 0 002.25 6v12a1.5 1.5 0 001.5 1.5zm10.5-11.25h.008v.008h-.008V8.25z" />
                          </svg>
                        )}
                        {cert.fileType.toUpperCase()}
                      </a>
                    </td>
                    <td className="px-6 py-4">
                      {deleteId === cert.id ? (
                        <div className="flex items-center justify-end gap-2">
                          <span className="text-xs text-gray-400">Delete?</span>
                          <button
                            onClick={() => deleteMutation.mutate(cert.id)}
                            disabled={deleteMutation.isPending}
                            className="text-[10px] px-2 py-1 rounded bg-red-500/20 text-red-400 hover:bg-red-500/30 transition-colors disabled:opacity-50 cursor-pointer"
                          >
                            {deleteMutation.isPending ? '...' : 'Yes'}
                          </button>
                          <button
                            onClick={() => setDeleteId(null)}
                            className="text-[10px] px-2 py-1 rounded bg-white/5 text-gray-400 hover:text-white transition-colors cursor-pointer"
                          >
                            No
                          </button>
                        </div>
                      ) : (
                        <div className="flex items-center justify-end gap-1">
                          <a
                            href={buildDownloadUrl(cert.fileUrl)}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-[10px] px-2 py-1 rounded bg-white/5 text-gray-400 hover:text-white hover:bg-white/10"
                          >
                            Download
                          </a>
                          <button
                            onClick={() => setDeleteId(cert.id)}
                            className="text-[10px] px-2 py-1 rounded bg-red-500/20 text-red-400 hover:bg-red-500/30 cursor-pointer"
                          >
                            Delete
                          </button>
                        </div>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {showAdd && (
        <AddCertificateModal key={data?.nextId || 'pending'} onClose={() => setShowAdd(false)} nextId={data?.nextId} />
      )}
    </div>
  );
}