'use client';

import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import ApplicationStatusBadge from '@/components/admin/ApplicationStatusBadge';

const statusOptions = ['PENDING', 'REVIEWED', 'SHORTLISTED', 'REJECTED', 'ACCEPTED'];

const statusMeta: Record<string, { label: string; icon: React.ReactNode; color: string }> = {
  PENDING: {
    label: 'Pending',
    icon: (
      <svg className="w-6 h-6 sm:w-7 sm:h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
    color: 'yellow'
  },
  REVIEWED: {
    label: 'Reviewed',
    icon: (
      <svg className="w-6 h-6 sm:w-7 sm:h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
      </svg>
    ),
    color: 'blue'
  },
  SHORTLISTED: {
    label: 'Shortlisted',
    icon: (
      <svg className="w-6 h-6 sm:w-7 sm:h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 00-.182.557l1.285 5.385a.562.562 0 01-.84.61l-4.725-2.885a.563.563 0 00-.586 0l-4.725 2.885a.562.562 0 01-.84-.61l1.285-5.385a.562.562 0 00-.182-.557l-4.204-3.602a.563.563 0 01.321-.988l5.518-.442a.563.563 0 00.475-.345L11.48 3.5z" />
      </svg>
    ),
    color: 'purple'
  },
  REJECTED: {
    label: 'Rejected',
    icon: (
      <svg className="w-6 h-6 sm:w-7 sm:h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636" />
      </svg>
    ),
    color: 'red'
  },
  ACCEPTED: {
    label: 'Accepted',
    icon: (
      <svg className="w-6 h-6 sm:w-7 sm:h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
    color: 'green'
  },
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

  // Color mapping for status cards
  const getStatusColor = (status: string) => {
    const colors = {
      PENDING: 'border-yellow-500/20 bg-yellow-500/5 hover:bg-yellow-500/10',
      REVIEWED: 'border-blue-500/20 bg-blue-500/5 hover:bg-blue-500/10',
      SHORTLISTED: 'border-purple-500/20 bg-purple-500/5 hover:bg-purple-500/10',
      REJECTED: 'border-red-500/20 bg-red-500/5 hover:bg-red-500/10',
      ACCEPTED: 'border-green-500/20 bg-green-500/5 hover:bg-green-500/10',
    };
    return colors[status as keyof typeof colors] || '';
  };

  const getStatusTextColor = (status: string) => {
    const colors = {
      PENDING: 'text-yellow-400',
      REVIEWED: 'text-blue-400',
      SHORTLISTED: 'text-purple-400',
      REJECTED: 'text-red-400',
      ACCEPTED: 'text-green-400',
    };
    return colors[status as keyof typeof colors] || '';
  };

  return (
    <div className="space-y-4 sm:space-y-5 md:space-y-6 px-2 xs:px-3 sm:px-4 md:px-6 lg:px-8">
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4">
        <div>
          <h1 className="text-lg xs:text-xl sm:text-2xl font-bold text-white">Application Status</h1>
          <p className="text-gray-400 text-xs sm:text-sm mt-0.5">Overview of applications grouped by status</p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <label className="px-2 py-1.5 sm:px-3 sm:py-2 bg-[#1a1a1a] border border-[#2a2a2a] rounded-lg text-[10px] sm:text-sm text-gray-300 hover:text-white hover:border-gray-600 transition-all cursor-pointer flex items-center gap-1 sm:gap-2 whitespace-nowrap">
            <svg className="w-3 h-3 sm:w-4 sm:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v2a2 2 0 002 2h12a2 2 0 002-2v-2M7 10l5 5 5-5M12 15V3" />
            </svg>
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
            className="px-2 py-1.5 sm:px-3 sm:py-2 bg-[#1a1a1a] border border-[#2a2a2a] rounded-lg text-[10px] sm:text-sm text-gray-300 hover:text-white hover:border-gray-600 transition-all flex items-center gap-1 sm:gap-2 cursor-pointer whitespace-nowrap"
          >
            <svg className="w-3 h-3 sm:w-4 sm:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3" />
            </svg>
            Export CSV
          </button>
        </div>
      </div>

      {/* Status Cards with Professional Icons */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2 sm:gap-3">
        {statusOptions.map(status => {
          const meta = statusMeta[status];
          const count = statusCounts[status] || 0;
          const active = selectedStatus === status;
          return (
            <button
              key={status}
              onClick={() => setSelectedStatus(active ? null : status)}
              className={`relative backdrop-blur-xl border rounded-2xl p-3 sm:p-4 text-left transition-all cursor-pointer ${
                active
                  ? `bg-white/10 border-white/20 ring-1 ring-white/20`
                  : `${getStatusColor(status)} border-white/10`
              }`}
            >
              <div className={`${getStatusTextColor(status)} mb-1 sm:mb-2`}>
                {meta.icon}
              </div>
              <div className={`text-xl sm:text-2xl font-bold text-white`}>{count}</div>
              <div className="text-[10px] sm:text-sm text-gray-400 mt-0.5">{meta.label}</div>
            </button>
          );
        })}
      </div>

      {/* Filters - Only show when status is selected */}
      {selectedStatus && (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-3">
          <div className="relative col-span-2 sm:col-span-1">
            <svg className="absolute left-2 sm:left-3 top-1/2 -translate-y-1/2 w-3 h-3 sm:w-4 sm:h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search..."
              className="w-full bg-[#1a1a1a] border border-[#2a2a2a] rounded-lg pl-7 sm:pl-10 pr-2 sm:pr-3 py-1.5 sm:py-2 text-white text-[10px] sm:text-sm focus:outline-none focus:border-blue-500"
            />
          </div>
          
          <select
            value={interviewerFilter}
            onChange={(e) => setInterviewerFilter(e.target.value)}
            className="bg-[#1a1a1a] border border-[#2a2a2a] rounded-lg px-1.5 sm:px-3 py-1.5 sm:py-2 text-white text-[10px] sm:text-sm focus:outline-none focus:border-blue-500 cursor-pointer w-full truncate"
          >
            <option value="">All Interviewers</option>
            {interviewers.map((iv: any) => (
              <option key={iv.id} value={iv.name}>{iv.name}</option>
            ))}
          </select>
          
          <select
            value={positionFilter}
            onChange={(e) => setPositionFilter(e.target.value)}
            className="bg-[#1a1a1a] border border-[#2a2a2a] rounded-lg px-1.5 sm:px-3 py-1.5 sm:py-2 text-white text-[10px] sm:text-sm focus:outline-none focus:border-blue-500 cursor-pointer w-full truncate"
          >
            <option value="">All Positions</option>
            {uniquePositions.map(p => (
              <option key={p} value={p}>{p}</option>
            ))}
          </select>
          
          <button
            onClick={() => {
              setSelectedStatus(null);
              setSearch('');
              setInterviewerFilter('');
              setPositionFilter('');
            }}
            className="px-2 py-1.5 sm:px-3 sm:py-2 text-[10px] sm:text-sm text-gray-400 hover:text-white bg-[#1a1a1a] border border-[#2a2a2a] rounded-lg transition-all cursor-pointer whitespace-nowrap"
          >
            Clear filter
          </button>
        </div>
      )}

      {/* Table - All columns always visible */}
      <div className="bg-zinc-900/50 border border-white/[0.06] rounded-2xl overflow-hidden">
        {isLoading ? (
          <div className="flex items-center justify-center h-48 sm:h-64">
            <div className="w-6 h-6 sm:w-8 sm:h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
          </div>
        ) : !selectedStatus ? (
          <div className="text-center py-12 sm:py-16">
            <p className="text-gray-500 text-sm sm:text-base">Select a status above to view applications.</p>
          </div>
        ) : filteredApps.length === 0 ? (
          <div className="text-center py-12 sm:py-16">
            <p className="text-gray-500 text-sm sm:text-base">No applications match your filters.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[1100px]">
              <thead>
                <tr className="border-b border-white/[0.06]">
                  <th className="text-left text-gray-400 text-[10px] sm:text-xs font-medium uppercase tracking-wider px-2 sm:px-4 py-2 sm:py-3">Applicant</th>
                  <th className="text-left text-gray-400 text-[10px] sm:text-xs font-medium uppercase tracking-wider px-2 sm:px-4 py-2 sm:py-3">Email</th>
                  <th className="text-left text-gray-400 text-[10px] sm:text-xs font-medium uppercase tracking-wider px-2 sm:px-4 py-2 sm:py-3">Interviewer</th>
                  <th className="text-left text-gray-400 text-[10px] sm:text-xs font-medium uppercase tracking-wider px-2 sm:px-4 py-2 sm:py-3">Interview Date</th>
                  <th className="text-left text-gray-400 text-[10px] sm:text-xs font-medium uppercase tracking-wider px-2 sm:px-4 py-2 sm:py-3">Applied For</th>
                  <th className="text-left text-gray-400 text-[10px] sm:text-xs font-medium uppercase tracking-wider px-2 sm:px-4 py-2 sm:py-3">Type</th>
                  <th className="text-left text-gray-400 text-[10px] sm:text-xs font-medium uppercase tracking-wider px-2 sm:px-4 py-2 sm:py-3">Status</th>
                  <th className="text-left text-gray-400 text-[10px] sm:text-xs font-medium uppercase tracking-wider px-2 sm:px-4 py-2 sm:py-3">Date</th>
                  <th className="text-right text-gray-400 text-[10px] sm:text-xs font-medium uppercase tracking-wider px-2 sm:px-4 py-2 sm:py-3">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/[0.06]">
                {filteredApps.map((app: any) => (
                  <tr key={app.id} className="hover:bg-white/[0.02] transition-colors">
                    <td className="px-2 sm:px-4 py-2 sm:py-3">
                      <button
                        onClick={() => router.push(`/admin/applications/${app.id}?type=${app.applicationType}`)}
                        className="text-white text-[10px] sm:text-sm font-medium hover:text-blue-400 transition-colors text-left cursor-pointer block truncate max-w-[80px] sm:max-w-[120px]"
                      >
                        {app.name}
                      </button>
                    </td>
                    <td className="px-2 sm:px-4 py-2 sm:py-3 text-gray-400 text-[10px] sm:text-sm truncate max-w-[100px] sm:max-w-[150px]">
                      {app.email}
                    </td>
                    <td className="px-2 sm:px-4 py-2 sm:py-3">
                      <select
                        value={app.interviewer_name || ''}
                        onChange={(e) => interviewMutation.mutate({ appId: app.id, interviewer_name: e.target.value || undefined, type: app.applicationType })}
                        className="bg-[#1a1a1a] border border-[#2a2a2a] rounded-lg px-1 sm:px-2 py-0.5 sm:py-1 text-white text-[9px] sm:text-xs focus:outline-none focus:border-blue-500 cursor-pointer w-full min-w-[80px] sm:min-w-[100px]"
                      >
                        <option value="">—</option>
                        {interviewers.map((iv: any) => (
                          <option key={iv.id} value={iv.name}>{iv.name}</option>
                        ))}
                      </select>
                    </td>
                    <td className="px-2 sm:px-4 py-2 sm:py-3">
                      <input
                        type="date"
                        value={app.interview_date ? app.interview_date.split('T')[0] : ''}
                        onChange={(e) => interviewMutation.mutate({ appId: app.id, interview_date: e.target.value || undefined, type: app.applicationType })}
                        className="bg-[#1a1a1a] border border-[#2a2a2a] rounded-lg px-1 sm:px-2 py-0.5 sm:py-1 text-white text-[9px] sm:text-xs focus:outline-none focus:border-blue-500 w-full min-w-[100px] sm:min-w-[120px]"
                      />
                    </td>
                    <td className="px-2 sm:px-4 py-2 sm:py-3 text-gray-400 text-[10px] sm:text-sm truncate max-w-[80px] sm:max-w-[120px]">
                      {app.postingTitle || '—'}
                    </td>
                    <td className="px-2 sm:px-4 py-2 sm:py-3">
                      <span className={`text-[8px] sm:text-[10px] font-medium px-1 sm:px-1.5 py-0.5 rounded-full border whitespace-nowrap ${
                        app.applicationType === 'job'
                          ? 'bg-blue-500/10 text-blue-400 border-blue-500/20'
                          : 'bg-purple-500/10 text-purple-400 border-purple-500/20'
                      }`}>
                        {app.applicationType === 'job' ? 'Job' : 'Internship'}
                      </span>
                    </td>
                    <td className="px-2 sm:px-4 py-2 sm:py-3">
                      <ApplicationStatusBadge status={app.status} />
                    </td>
                    <td className="px-2 sm:px-4 py-2 sm:py-3 text-gray-400 text-[9px] sm:text-sm whitespace-nowrap">
                      {new Date(app.created_at).toLocaleDateString()}
                    </td>
                    <td className="px-2 sm:px-4 py-2 sm:py-3">
                      <div className="flex flex-wrap items-center justify-end gap-0.5 sm:gap-1">
                        <button
                          onClick={() => router.push(`/admin/applications/${app.id}?type=${app.applicationType}`)}
                          className="p-1 sm:p-1.5 text-gray-400 hover:text-blue-400 hover:bg-blue-500/10 rounded-lg transition-all cursor-pointer"
                          title="Edit"
                        >
                          <svg className="w-3 h-3 sm:w-3.5 sm:h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                          </svg>
                        </button>
                        <button
                          onClick={() => { if (confirm('Delete this application?')) deleteMutation.mutate({ appId: app.id, type: app.applicationType }); }}
                          className="p-1 sm:p-1.5 text-gray-400 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-all cursor-pointer"
                          title="Delete"
                        >
                          <svg className="w-3 h-3 sm:w-3.5 sm:h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                        </button>
                        <select
                          value={app.status}
                          onChange={(e) => statusMutation.mutate({ appId: app.id, status: e.target.value, type: app.applicationType })}
                          className="bg-[#1a1a1a] border border-[#2a2a2a] rounded-lg px-1 sm:px-1.5 py-0.5 sm:py-1 text-white text-[8px] sm:text-[10px] focus:outline-none focus:border-blue-500 cursor-pointer min-w-[60px] sm:min-w-[70px]"
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