'use client';

import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import ApplicationStatusBadge from '@/components/admin/ApplicationStatusBadge';

const statusOptions = ['PENDING', 'REVIEWED', 'SHORTLISTED', 'REJECTED', 'ACCEPTED'];

const statusMeta: Record<string, { label: string; icon: string; color: string }> = {
  PENDING:    { label: 'Pending',    icon: '⏳', color: 'yellow' },
  REVIEWED:   { label: 'Reviewed',   icon: '👁️', color: 'blue' },
  SHORTLISTED:{ label: 'Shortlisted',icon: '⭐', color: 'purple' },
  REJECTED:   { label: 'Rejected',   icon: '❌', color: 'red' },
  ACCEPTED:   { label: 'Accepted',   icon: '✅', color: 'green' },
};

export default function ApplicationStatusPage() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const [selectedStatus, setSelectedStatus] = useState<string | null>(null);
  const [search, setSearch] = useState('');
  const [interviewerFilter, setInterviewerFilter] = useState('');
  const [positionFilter, setPositionFilter] = useState('');

  const { data, isLoading } = useQuery({
    queryKey: ['admin-all-applications'],
    queryFn: async () => {
      const res = await fetch('/api/admin/applications');
      if (!res.ok) throw new Error('Failed to fetch');
      return res.json();
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

  const interviewMutation = useMutation({
    mutationFn: async ({ appId, interviewer_name, interview_date, type }: { appId: string; interviewer_name?: string; interview_date?: string; type: string }) => {
      const res = await fetch(`/api/admin/applications/${appId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ interviewer_name, interview_date, type }),
      });
      if (!res.ok) throw new Error('Failed to update interview');
    },
    onSuccess: () => {
      toast.success('Interview updated');
      queryClient.invalidateQueries({ queryKey: ['admin-all-applications'] });
    },
    onError: (err: Error) => toast.error(err.message),
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
      queryClient.invalidateQueries({ queryKey: ['admin-all-applications'] });
    },
    onError: (err: Error) => { alert(err.message); },
  });

  const deleteMutation = useMutation({
    mutationFn: async ({ appId, type }: { appId: string; type: string }) => {
      const res = await fetch(`/api/admin/applications/${appId}?type=${type}`, { method: 'DELETE' });
      if (!res.ok) throw new Error('Failed to delete');
    },
    onSuccess: () => {
      toast.success('Application deleted');
      queryClient.invalidateQueries({ queryKey: ['admin-all-applications'] });
    },
    onError: (err: Error) => toast.error(err.message),
  });

  const applications = data?.applications || [];
  const interviewers = interviewersData || [];

  const statusCounts: Record<string, number> = {};
  for (const s of statusOptions) statusCounts[s] = 0;
  for (const app of applications) {
    if (statusCounts[app.status] !== undefined) statusCounts[app.status]++;
  }

  const filteredByStatus = selectedStatus
    ? applications.filter((a: any) => a.status === selectedStatus)
    : applications;

  const filteredApps = filteredByStatus.filter((app: any) => {
    const matchesSearch = !search ||
      app.name?.toLowerCase().includes(search.toLowerCase()) ||
      app.email?.toLowerCase().includes(search.toLowerCase());
    const matchesInterviewer = !interviewerFilter || app.interviewer_name === interviewerFilter;
    const matchesPosition = !positionFilter || app.postingTitle === positionFilter;
    return matchesSearch && matchesInterviewer && matchesPosition;
  });

  const uniquePositions = [...new Set(applications.map((a: any) => a.postingTitle).filter(Boolean))] as string[];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-white">Application Status</h1>
          <p className="text-gray-400 text-sm mt-0.5">Overview of applications grouped by status</p>
        </div>
        <div className="flex items-center gap-2">
          <label className="px-3 py-2 bg-[#1a1a1a] border border-[#2a2a2a] rounded-lg text-sm text-gray-300 hover:text-white hover:border-gray-600 transition-all cursor-pointer flex items-center gap-2">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v2a2 2 0 002 2h12a2 2 0 002-2v-2M7 10l5 5 5-5M12 15V3" /></svg>
            Import CSV
            <input
              type="file"
              accept=".csv"
              className="hidden"
              onChange={async (e) => {
                const file = e.target.files?.[0];
                if (!file) return;
                const formData = new FormData();
                formData.append('file', file);
                try {
                  const res = await fetch('/api/admin/applications/import', { method: 'POST', body: formData });
                  const json = await res.json();
                  if (!res.ok) throw new Error(json.error);
                  toast.success(`Imported: ${json.imported}, Skipped: ${json.skipped}, Errors: ${json.errors}`);
                  queryClient.invalidateQueries({ queryKey: ['admin-all-applications'] });
                } catch (err: any) {
                  toast.error(err.message);
                }
                e.target.value = '';
              }}
            />
          </label>
          <button
            onClick={async () => {
              try {
                const res = await fetch('/api/admin/applications/export');
                if (!res.ok) throw new Error('Export failed');
                const blob = await res.blob();
                const url = URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = `applications-${new Date().toISOString().split('T')[0]}.csv`;
                a.click();
                URL.revokeObjectURL(url);
                toast.success('Exported successfully');
              } catch (err: any) {
                toast.error(err.message);
              }
            }}
            className="px-3 py-2 bg-[#1a1a1a] border border-[#2a2a2a] rounded-lg text-sm text-gray-300 hover:text-white hover:border-gray-600 transition-all flex items-center gap-2 cursor-pointer"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3" /></svg>
            Export CSV
          </button>
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
        {statusOptions.map(status => {
          const meta = statusMeta[status];
          const count = statusCounts[status] || 0;
          const active = selectedStatus === status;
          return (
            <button
              key={status}
              onClick={() => setSelectedStatus(active ? null : status)}
              className={`relative backdrop-blur-xl border rounded-2xl p-4 text-left transition-all cursor-pointer ${
                active
                  ? 'bg-white/10 border-white/20 ring-1 ring-white/20'
                  : 'bg-white/5 border-white/10 hover:bg-white/[0.07]'
              }`}
            >
              <div className="text-2xl mb-2">{meta.icon}</div>
              <div className={`text-2xl font-bold text-white`}>{count}</div>
              <div className="text-sm text-gray-400 mt-0.5">{meta.label}</div>
            </button>
          );
        })}
      </div>

      {selectedStatus && (
        <div className="flex flex-wrap items-center gap-3">
          <div className="relative flex-1 min-w-[200px]">
            <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by name or email..."
              className="w-full bg-[#1a1a1a] border border-[#2a2a2a] rounded-lg pl-10 pr-4 py-2 text-white text-sm focus:outline-none focus:border-blue-500"
            />
          </div>
          <select
            value={interviewerFilter}
            onChange={(e) => setInterviewerFilter(e.target.value)}
            className="bg-[#1a1a1a] border border-[#2a2a2a] rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-blue-500 cursor-pointer"
          >
            <option value="">All Interviewers</option>
            {interviewers.map((iv: any) => (
              <option key={iv.id} value={iv.name}>{iv.name}</option>
            ))}
          </select>
          <select
            value={positionFilter}
            onChange={(e) => setPositionFilter(e.target.value)}
            className="bg-[#1a1a1a] border border-[#2a2a2a] rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-blue-500 cursor-pointer"
          >
            <option value="">All Positions</option>
            {uniquePositions.map(p => (
              <option key={p} value={p}>{p}</option>
            ))}
          </select>
          <button
            onClick={() => setSelectedStatus(null)}
            className="px-3 py-2 text-sm text-gray-400 hover:text-white bg-[#1a1a1a] border border-[#2a2a2a] rounded-lg transition-all cursor-pointer"
          >
            Clear filter
          </button>
        </div>
      )}

      <div className="bg-zinc-900/50 border border-white/[0.06] rounded-2xl overflow-hidden">
        {isLoading ? (
          <div className="flex items-center justify-center h-64">
            <div className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
          </div>
        ) : !selectedStatus ? (
          <div className="text-center py-16">
            <p className="text-gray-500">Select a status above to view applications.</p>
          </div>
        ) : filteredApps.length === 0 ? (
          <div className="text-center py-16">
            <p className="text-gray-500">No applications match your filters.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-white/[0.06]">
                  <th className="text-left text-gray-400 text-xs font-medium uppercase tracking-wider px-6 py-4">Applicant</th>
                  <th className="text-left text-gray-400 text-xs font-medium uppercase tracking-wider px-6 py-4">Email</th>
                  <th className="text-left text-gray-400 text-xs font-medium uppercase tracking-wider px-6 py-4">Interviewer</th>
                  <th className="text-left text-gray-400 text-xs font-medium uppercase tracking-wider px-6 py-4">Interview Date</th>
                  <th className="text-left text-gray-400 text-xs font-medium uppercase tracking-wider px-6 py-4">Applied For</th>
                  <th className="text-left text-gray-400 text-xs font-medium uppercase tracking-wider px-6 py-4">Type</th>
                  <th className="text-left text-gray-400 text-xs font-medium uppercase tracking-wider px-6 py-4">Status</th>
                  <th className="text-left text-gray-400 text-xs font-medium uppercase tracking-wider px-6 py-4">Date</th>
                  <th className="text-right text-gray-400 text-xs font-medium uppercase tracking-wider px-6 py-4">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/[0.06]">
                {filteredApps.map((app: any) => (
                  <tr key={app.id} className="hover:bg-white/[0.02] transition-colors">
                    <td className="px-6 py-4">
                      <button
                        onClick={() => router.push(`/admin/applications/${app.id}?type=${app.applicationType}`)}
                        className="text-white text-sm font-medium hover:text-blue-400 transition-colors text-left cursor-pointer"
                      >
                        {app.name}
                      </button>
                    </td>
                    <td className="px-6 py-4 text-gray-400 text-sm">{app.email}</td>
                    <td className="px-6 py-4">
                      <select
                        value={app.interviewer_name || ''}
                        onChange={(e) => interviewMutation.mutate({ appId: app.id, interviewer_name: e.target.value || undefined, type: app.applicationType })}
                        className="bg-[#1a1a1a] border border-[#2a2a2a] rounded-lg px-3 py-1.5 text-white text-xs focus:outline-none focus:border-blue-500 cursor-pointer w-full min-w-[130px]"
                      >
                        <option value="">—</option>
                        {interviewers.map((iv: any) => (
                          <option key={iv.id} value={iv.name}>{iv.name}</option>
                        ))}
                      </select>
                    </td>
                    <td className="px-6 py-4">
                      <input
                        type="date"
                        value={app.interview_date ? app.interview_date.split('T')[0] : ''}
                        onChange={(e) => interviewMutation.mutate({ appId: app.id, interview_date: e.target.value || undefined, type: app.applicationType })}
                        className="bg-[#1a1a1a] border border-[#2a2a2a] rounded-lg px-3 py-1.5 text-white text-xs focus:outline-none focus:border-blue-500 w-full min-w-[140px]"
                      />
                    </td>
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
                      <div className="flex items-center justify-end gap-1">
                        <button
                          onClick={() => router.push(`/admin/applications/${app.id}?type=${app.applicationType}`)}
                          className="p-2 text-gray-400 hover:text-blue-400 hover:bg-blue-500/10 rounded-lg transition-all cursor-pointer"
                          title="Edit"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>
                        </button>
                        <button
                          onClick={() => { if (confirm('Delete this application?')) deleteMutation.mutate({ appId: app.id, type: app.applicationType }); }}
                          className="p-2 text-gray-400 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-all cursor-pointer"
                          title="Delete"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                        </button>
                        <select
                          value={app.status}
                          onChange={(e) => statusMutation.mutate({ appId: app.id, status: e.target.value, type: app.applicationType })}
                          className="bg-[#1a1a1a] border border-[#2a2a2a] rounded-lg px-2 py-1.5 text-white text-xs focus:outline-none focus:border-blue-500 cursor-pointer"
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
    </div>
  );
}
