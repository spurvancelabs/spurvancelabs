'use client';

import { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useSearchParams, useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
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
  const router = useRouter();
  const typeFromUrl = searchParams.get('type') || '';
  const queryClient = useQueryClient();
  const [typeFilter, setTypeFilter] = useState(typeFromUrl);
  useEffect(() => { setTypeFilter(typeFromUrl); }, [typeFromUrl]);
  const [selectedApp, setSelectedApp] = useState<any>(null);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [interviewerFilter, setInterviewerFilter] = useState('');
  const [positionFilter, setPositionFilter] = useState('');

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

  const { data: interviewersData } = useQuery({
    queryKey: ['admin-interviewers'],
    queryFn: async () => {
      const res = await fetch('/api/admin/interviewers');
      if (!res.ok) throw new Error('Failed to fetch');
      const json = await res.json();
      return json.interviewers || [];
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
      queryClient.invalidateQueries({ queryKey: ['admin-applications', typeFilter] });
    },
    onError: (err: Error) => toast.error(err.message),
  });

  const deleteMutation = useMutation({
    mutationFn: async ({ appId, type }: { appId: string; type: string }) => {
      const res = await fetch(`/api/admin/applications/${appId}?type=${type}`, {
        method: 'DELETE',
      });
      if (!res.ok) throw new Error('Failed to delete');
    },
    onSuccess: () => {
      toast.success('Application deleted');
      queryClient.invalidateQueries({ queryKey: ['admin-applications', typeFilter] });
    },
    onError: (err: Error) => toast.error(err.message),
  });

  const applications = data?.applications || [];
  const interviewers = interviewersData || [];

  const filteredApps = applications.filter((app: any) => {
    const matchesSearch = !search || 
      app.name?.toLowerCase().includes(search.toLowerCase()) ||
      app.email?.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = !statusFilter || app.status === statusFilter;
    const matchesInterviewer = !interviewerFilter || app.interviewer_name === interviewerFilter;
    const matchesPosition = !positionFilter || app.postingTitle === positionFilter;
    return matchesSearch && matchesStatus && matchesInterviewer && matchesPosition;
  });

  const uniquePositions = [...new Set(applications.map((a: any) => a.postingTitle).filter(Boolean))] as string[];

  return (
    <div className=" space-y-4 sm:space-y-5 md:space-y-6 px-2 xs:px-3 sm:px-4 md:px-6 lg:px-8">
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4">
        <div>
          <h1 className="text-lg xs:text-xl sm:text-2xl font-bold text-white">Applications</h1>
          <p className="text-gray-400 text-xs sm:text-sm mt-0.5">Manage all job and internship applications</p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => router.push('/admin/applications/new')}
            className="px-2 py-1.5 sm:px-3 sm:py-2 bg-blue-600 hover:bg-blue-700 rounded-lg text-[10px] sm:text-sm text-white transition-all flex items-center gap-1 sm:gap-2 cursor-pointer whitespace-nowrap"
          >
            <svg className="w-3 h-3 sm:w-4 sm:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>
            Add Application
          </button>
          
          <label className="px-2 py-1.5 sm:px-3 sm:py-2 bg-[#1a1a1a] border border-[#2a2a2a] rounded-lg text-[10px] sm:text-sm text-gray-300 hover:text-white hover:border-gray-600 transition-all cursor-pointer flex items-center gap-1 sm:gap-2 whitespace-nowrap">
            <svg className="w-3 h-3 sm:w-4 sm:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v2a2 2 0 002 2h12a2 2 0 002-2v-2M7 10l5 5 5-5M12 15V3" /></svg>
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
                  queryClient.invalidateQueries({ queryKey: ['admin-applications', typeFilter] });
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
                const params = new URLSearchParams();
                if (typeFilter) params.set('type', typeFilter);
                const res = await fetch(`/api/admin/applications/export?${params}`);
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
            <svg className="w-3 h-3 sm:w-4 sm:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3" /></svg>
            Export CSV
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-0.5 sm:gap-1 bg-zinc-900/50 border border-white/[0.06] rounded-lg p-1 overflow-x-auto">
        {tabs.map(tab => (
          <button
            key={tab.value}
            onClick={() => setTypeFilter(tab.value)}
            className={`px-2 sm:px-4 py-1 sm:py-2 rounded-md text-[10px] sm:text-sm font-medium transition-all cursor-pointer whitespace-nowrap ${
              typeFilter === tab.value
                ? 'bg-blue-500/20 text-blue-400'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Filters */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-3">
        <div className="relative col-span-2 sm:col-span-1">
          <svg className="absolute left-2 sm:left-3 top-1/2 -translate-y-1/2 w-3 h-3 sm:w-4 sm:h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search..."
            className="w-full bg-[#1a1a1a] border border-[#2a2a2a] rounded-lg pl-7 sm:pl-10 pr-2 sm:pr-3 py-1.5 sm:py-2 text-white text-[10px] sm:text-sm focus:outline-none focus:border-blue-500"
          />
        </div>
        
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="bg-[#1a1a1a] border border-[#2a2a2a] rounded-lg px-1.5 sm:px-3 py-1.5 sm:py-2 text-white text-[10px] sm:text-sm focus:outline-none focus:border-blue-500 cursor-pointer w-full truncate"
        >
          <option value="">All Statuses</option>
          {statusOptions.map(s => (
            <option key={s} value={s}>{s}</option>
          ))}
        </select>
        
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
      </div>

      {/* Table - All columns always visible */}
      <div className=" bg-zinc-900/50 border border-white/[0.06] rounded-2xl overflow-hidden">
        {isLoading ? (
          <div className="flex items-center justify-center h-48 sm:h-64">
            <div className="w-6 h-6 sm:w-8 sm:h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
          </div>
        ) : filteredApps.length === 0 ? (
          <div className="text-center py-12 sm:py-16">
            <p className="text-gray-500 text-sm sm:text-base">No applications match your filters.</p>
          </div>
        ) : (
          <div className="overflow-x-auto ">
            <table className="w-full min-w-[1200px]">
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
                        className="text-white text-[10px] sm:text-sm font-medium hover:text-blue-400 transition-colors text-left cursor-pointer block truncate max-w-[80px] sm:max-w-[120px] md:max-w-[150px]"
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
                          <svg className="w-3 h-3 sm:w-3.5 sm:h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>
                        </button>
                        <button
                          onClick={() => { if (confirm('Delete this application?')) deleteMutation.mutate({ appId: app.id, type: app.applicationType }); }}
                          className="p-1 sm:p-1.5 text-gray-400 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-all cursor-pointer"
                          title="Delete"
                        >
                          <svg className="w-3 h-3 sm:w-3.5 sm:h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
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

      <ApplicationDetailModal
        isOpen={!!selectedApp}
        onClose={() => setSelectedApp(null)}
        application={selectedApp || null}
        jobInfo={null}
        onUpdate={() => queryClient.invalidateQueries({ queryKey: ['admin-applications', typeFilter] })}
      />
    </div>
  );
}