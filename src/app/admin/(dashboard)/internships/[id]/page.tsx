'use client';

import { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import toast from 'react-hot-toast';
import ApplicationStatusBadge from '@/components/admin/ApplicationStatusBadge';
import { canEditContent, canDeleteContent } from '@/lib/lms/permissions';

const statusOptions = ['PENDING', 'REVIEWED', 'SHORTLISTED', 'REJECTED', 'ACCEPTED'];

export default function AdminInternshipDetailPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;
  const queryClient = useQueryClient();
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [interviewerFilter, setInterviewerFilter] = useState('');
  const [myRole, setMyRole] = useState<string>('');
  useEffect(() => {
    fetch('/api/auth/me').then(r => r.json()).then(d => { if (d?.role) setMyRole(d.role); }).catch(() => {});
  }, []);

  const { data: internshipData, isLoading } = useQuery({
    queryKey: ['admin-internship', id],
    queryFn: async () => {
      const res = await fetch(`/api/admin/internships`);
      if (!res.ok) throw new Error('Failed to fetch');
      const json = await res.json();
      const internship = json.internships?.find((j: any) => j.id === id);
      return internship || null;
    },
  });

  const { data: appsData, isLoading: appsLoading } = useQuery({
    queryKey: ['admin-internship-applications', id],
    queryFn: async () => {
      const res = await fetch(`/api/admin/applications?type=internship&internshipId=${id}`);
      if (!res.ok) throw new Error('Failed to fetch');
      const json = await res.json();
      return json.applications || [];
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
    mutationFn: async ({ appId, status }: { appId: string; status: string }) => {
      const res = await fetch(`/api/admin/applications/${appId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status, type: 'internship' }),
      });
      if (!res.ok) throw new Error('Failed to update status');
    },
    onSuccess: () => {
      toast.success('Status updated');
      queryClient.invalidateQueries({ queryKey: ['admin-internship-applications', id] });
    },
    onError: (err: Error) => toast.error(err.message),
  });

  const interviewMutation = useMutation({
    mutationFn: async ({ appId, interviewer_name, interview_date }: { appId: string; interviewer_name?: string; interview_date?: string }) => {
      const res = await fetch(`/api/admin/applications/${appId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ interviewer_name, interview_date, type: 'internship' }),
      });
      if (!res.ok) throw new Error('Failed to update interview');
    },
    onSuccess: () => {
      toast.success('Interview updated');
      queryClient.invalidateQueries({ queryKey: ['admin-internship-applications', id] });
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
      queryClient.invalidateQueries({ queryKey: ['admin-internship-applications', id] });
    },
    onError: (err: Error) => toast.error(err.message),
  });

  const interviewers = interviewersData || [];

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!internshipData) {
    return (
      <div className="text-center py-16">
        <p className="text-gray-500">Internship not found</p>
        <Link href="/admin/internships" className="text-blue-400 text-sm hover:underline mt-2 inline-block">Back to Internships</Link>
      </div>
    );
  }

  const applications = appsData || [];

  const filteredApps = applications.filter((app: any) => {
    const matchesSearch = !search || 
      app.name?.toLowerCase().includes(search.toLowerCase()) ||
      app.email?.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = !statusFilter || app.status === statusFilter;
    const matchesInterviewer = !interviewerFilter || app.interviewer_name === interviewerFilter;
    return matchesSearch && matchesStatus && matchesInterviewer;
  });

  return (
    <div className="space-y-6">
      <Link href="/admin/internships" className="inline-flex items-center gap-2 text-gray-400 hover:text-white text-sm transition-colors">
        <svg className="w-[16px] h-[16px]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" /></svg>
        Back to Internships
      </Link>

      <div className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-2xl p-4 sm:p-6">
        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
          <div>
            <h1 className="text-xl sm:text-2xl font-bold text-white">{internshipData.title}</h1>
            <p className="text-gray-400 text-sm mt-1">
              {internshipData.department} · {internshipData.duration} · {internshipData.location}
            </p>
          </div>
          <span className={`inline-flex self-start px-3 py-1 rounded-full text-xs font-medium border ${
            internshipData.status === 'ACTIVE' ? 'bg-green-500/10 text-green-400 border-green-500/20' :
            internshipData.status === 'CLOSED' ? 'bg-red-500/10 text-red-400 border-red-500/20' :
            'bg-yellow-500/10 text-yellow-400 border-yellow-500/20'
          }`}>
            {internshipData.status}
          </span>
        </div>
        {internshipData.stipend && <p className="text-gray-300 text-sm mt-3">Stipend: {internshipData.stipend}</p>}
        {internshipData.skills && internshipData.skills.length > 0 && (
          <div className="flex flex-wrap gap-2 mt-3">
            {internshipData.skills.map((skill: string) => (
              <span key={skill} className="px-3 py-1 bg-blue-500/10 text-blue-400 rounded-full text-xs border border-blue-500/20">
                {skill}
              </span>
            ))}
          </div>
        )}
        <p className="text-gray-400 text-sm mt-4 whitespace-pre-wrap">{internshipData.description}</p>
      </div>

      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold text-white">
            Applications ({filteredApps.length})
          </h2>
          <div className="flex items-center gap-2">
            <label className="px-3 py-1.5 bg-[#1a1a1a] border border-[#2a2a2a] rounded-lg text-xs text-gray-300 hover:text-white hover:border-gray-600 transition-all cursor-pointer flex items-center gap-1.5">
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v2a2 2 0 002 2h12a2 2 0 002-2v-2M7 10l5 5 5-5M12 15V3" /></svg>
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
                    queryClient.invalidateQueries({ queryKey: ['admin-internship-applications', id] });
                  } catch (err: any) { toast.error(err.message); }
                  e.target.value = '';
                }}
              />
            </label>
            <button
              onClick={async () => {
                try {
                  const res = await fetch(`/api/admin/applications/export?type=internship&internshipId=${id}`);
                  if (!res.ok) throw new Error('Export failed');
                  const blob = await res.blob();
                  const url = URL.createObjectURL(blob);
                  const a = document.createElement('a');
                  a.href = url;
                  a.download = `applications-internship-${new Date().toISOString().split('T')[0]}.csv`;
                  a.click();
                  URL.revokeObjectURL(url);
                  toast.success('Exported successfully');
                } catch (err: any) { toast.error(err.message); }
              }}
              className="px-3 py-1.5 bg-[#1a1a1a] border border-[#2a2a2a] rounded-lg text-xs text-gray-300 hover:text-white hover:border-gray-600 transition-all flex items-center gap-1.5 cursor-pointer"
            >
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3" /></svg>
              Export CSV
            </button>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-3 mb-4">
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
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="bg-[#1a1a1a] border border-[#2a2a2a] rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-blue-500 cursor-pointer"
          >
            <option value="">All Statuses</option>
            {statusOptions.map(s => (
              <option key={s} value={s}>{s}</option>
            ))}
          </select>
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
        </div>

        <div className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-2xl overflow-hidden">
          {appsLoading ? (
            <div className="flex items-center justify-center h-64">
              <div className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
            </div>
          ) : filteredApps.length === 0 ? (
            <div className="text-center py-16">
              <p className="text-gray-500">No applications match your filters.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-white/5">
                    <th className="text-left text-gray-400 text-xs font-medium uppercase tracking-wider px-6 py-4">Applicant</th>
                    <th className="text-left text-gray-400 text-xs font-medium uppercase tracking-wider px-6 py-4">Email</th>
                    <th className="text-left text-gray-400 text-xs font-medium uppercase tracking-wider px-6 py-4">Interviewer</th>
                    <th className="text-left text-gray-400 text-xs font-medium uppercase tracking-wider px-6 py-4">Interview Date</th>
                    <th className="text-left text-gray-400 text-xs font-medium uppercase tracking-wider px-6 py-4">Status</th>
                    <th className="text-left text-gray-400 text-xs font-medium uppercase tracking-wider px-6 py-4">Date</th>
                    <th className="text-right text-gray-400 text-xs font-medium uppercase tracking-wider px-6 py-4">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {filteredApps.map((app: any) => (
                    <tr key={app.id} className="hover:bg-white/5 transition-colors">
                      <td className="px-6 py-4">
                        <button
                          onClick={() => router.push(`/admin/applications/${app.id}?type=internship`)}
                          className="text-white text-sm font-medium hover:text-blue-400 transition-colors text-left cursor-pointer"
                        >
                          {app.name}
                        </button>
                      </td>
                      <td className="px-6 py-4 text-gray-400 text-sm">{app.email}</td>
                      <td className="px-6 py-4">
                        <select
                          value={app.interviewer_name || ''}
                          onChange={(e) => interviewMutation.mutate({ appId: app.id, interviewer_name: e.target.value || undefined })}
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
                          onChange={(e) => interviewMutation.mutate({ appId: app.id, interview_date: e.target.value || undefined })}
                          className="bg-[#1a1a1a] border border-[#2a2a2a] rounded-lg px-3 py-1.5 text-white text-xs focus:outline-none focus:border-blue-500 w-full min-w-[140px]"
                        />
                      </td>
                      <td className="px-6 py-4">
                        <ApplicationStatusBadge status={app.status} />
                      </td>
                      <td className="px-6 py-4 text-gray-400 text-sm">
                        {new Date(app.created_at).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center justify-end gap-1">
                          {canEditContent(myRole) && (
                            <button
                              onClick={() => router.push(`/admin/applications/${app.id}?type=internship`)}
                              className="p-2 text-gray-400 hover:text-blue-400 hover:bg-blue-500/10 rounded-lg transition-all cursor-pointer"
                              title="Edit"
                            >
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>
                            </button>
                          )}
                          {canDeleteContent(myRole) && (
                            <button
                              onClick={() => { if (confirm('Delete this application?')) deleteMutation.mutate({ appId: app.id, type: 'internship' }); }}
                              className="p-2 text-gray-400 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-all cursor-pointer"
                              title="Delete"
                            >
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                            </button>
                          )}
                          {(canEditContent(myRole) || canDeleteContent(myRole)) && (
                            <select
                              value={app.status}
                              onChange={(e) => statusMutation.mutate({ appId: app.id, status: e.target.value })}
                              className="bg-[#1a1a1a] border border-[#2a2a2a] rounded-lg px-2 py-1.5 text-white text-xs focus:outline-none focus:border-blue-500 cursor-pointer"
                            >
                              {statusOptions.map(s => (
                                <option key={s} value={s}>{s}</option>
                              ))}
                            </select>
                          )}
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
    </div>
  );
}
