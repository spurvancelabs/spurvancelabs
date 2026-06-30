'use client';

import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useSearchParams } from 'next/navigation';
import ApplicationStatusBadge from '@/components/admin/ApplicationStatusBadge';
import ApplicationDetailModal from '@/components/admin/ApplicationDetailModal';

const statusOptions = ['PENDING', 'REVIEWED', 'SHORTLISTED', 'REJECTED', 'ACCEPTED'];
const tabs = [
  { label: 'All', value: '' },
  { label: 'Job Applications', value: 'job' },
  { label: 'Internship Applications', value: 'internship' },
];

export default function AdminApplicationsPage() {
  const searchParams = useSearchParams();
  const initialType = searchParams.get('type') || '';
  const queryClient = useQueryClient();
  const [typeFilter, setTypeFilter] = useState(initialType);
  const [selectedApp, setSelectedApp] = useState<any>(null);

  const { data, isLoading } = useQuery({
    queryKey: ['admin-applications', typeFilter],
    queryFn: async () => {
      const params = new URLSearchParams();
      if (typeFilter) params.set('type', typeFilter);
      const res = await fetch(`/api/admin/applications?${params}`);
      if (!res.ok) throw new Error('Failed to fetch');
      return res.json();
    },
  });

  const statusMutation = useMutation({
    mutationFn: async ({ appId, status, type }: { appId: string; status: string; type: string }) => {
      const res = await fetch(`/api/admin/applications/${appId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status, type }),
      });
      if (!res.ok) throw new Error('Failed to update status');
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-applications', typeFilter] });
    },
    onError: (err: Error) => {
      alert(err.message);
    },
  });

  const applications = data?.applications || [];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl sm:text-2xl font-bold text-white">Applications</h1>
        <p className="text-gray-400 text-sm mt-0.5">Manage all job and internship applications</p>
      </div>

      <div className="flex gap-1 bg-zinc-900/50 border border-white/[0.06] rounded-lg p-1 w-fit">
        {tabs.map(tab => (
          <button
            key={tab.value}
            onClick={() => setTypeFilter(tab.value)}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-all cursor-pointer ${
              typeFilter === tab.value
                ? 'bg-blue-500/20 text-blue-400'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <div className="bg-zinc-900/50 border border-white/[0.06] rounded-2xl overflow-hidden">
        {isLoading ? (
          <div className="flex items-center justify-center h-64">
            <div className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
          </div>
        ) : applications.length === 0 ? (
          <div className="text-center py-16">
            <p className="text-gray-500">No applications found.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-white/[0.06]">
                  <th className="text-left text-gray-400 text-xs font-medium uppercase tracking-wider px-6 py-4">Applicant</th>
                  <th className="text-left text-gray-400 text-xs font-medium uppercase tracking-wider px-6 py-4">Email</th>
                  <th className="text-left text-gray-400 text-xs font-medium uppercase tracking-wider px-6 py-4">Applied For</th>
                  <th className="text-left text-gray-400 text-xs font-medium uppercase tracking-wider px-6 py-4">Type</th>
                  <th className="text-left text-gray-400 text-xs font-medium uppercase tracking-wider px-6 py-4">Status</th>
                  <th className="text-left text-gray-400 text-xs font-medium uppercase tracking-wider px-6 py-4">Date</th>
                  <th className="text-right text-gray-400 text-xs font-medium uppercase tracking-wider px-6 py-4">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/[0.06]">
                {applications.map((app: any) => (
                  <tr key={app.id} className="hover:bg-white/[0.02] transition-colors">
                    <td className="px-6 py-4">
                      <button
                        onClick={() => setSelectedApp(app)}
                        className="text-white text-sm font-medium hover:text-blue-400 transition-colors text-left cursor-pointer"
                      >
                        {app.name}
                      </button>
                    </td>
                    <td className="px-6 py-4 text-gray-400 text-sm">{app.email}</td>
                    <td className="px-6 py-4 text-gray-400 text-sm">{app.postingTitle || '—'}</td>
                    <td className="px-6 py-4">
                      <span className={`text-xs font-medium px-2 py-0.5 rounded-full border ${
                        app.applicationType === 'job'
                          ? 'bg-blue-500/10 text-blue-400 border-blue-500/20'
                          : 'bg-purple-500/10 text-purple-400 border-purple-500/20'
                      }`}>
                        {app.applicationType === 'job' ? 'Job' : 'Internship'}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <ApplicationStatusBadge status={app.status} />
                    </td>
                    <td className="px-6 py-4 text-gray-400 text-sm">
                      {new Date(app.created_at).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-end gap-2">
                        <select
                          value={app.status}
                          onChange={(e) => statusMutation.mutate({ appId: app.id, status: e.target.value, type: app.applicationType })}
                          className="bg-[#1a1a1a] border border-[#2a2a2a] rounded-lg px-3 py-1.5 text-white text-xs focus:outline-none focus:border-blue-500 cursor-pointer"
                        >
                          {statusOptions.map(s => (
                            <option key={s} value={s}>{s}</option>
                          ))}
                        </select>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <ApplicationDetailModal
        isOpen={!!selectedApp}
        onClose={() => setSelectedApp(null)}
        application={selectedApp || null}
        jobInfo={null}
      />
    </div>
  );
}
