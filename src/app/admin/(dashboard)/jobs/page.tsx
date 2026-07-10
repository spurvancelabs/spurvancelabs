'use client';

import { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import toast from 'react-hot-toast';
import JobFormModal from '@/components/admin/JobFormModal';
import ConfirmDeleteModal from '@/components/admin/ConfirmDeleteModal';
import { canCreateContent, canEditContent, canDeleteContent } from '@/lib/lms/permissions';

export default function AdminJobsPage() {
  const queryClient = useQueryClient();
  const searchParams = useSearchParams();
  const [showForm, setShowForm] = useState(searchParams.get('add') === 'true');
  const [editingJob, setEditingJob] = useState<any>(null);
  const [deletingJob, setDeletingJob] = useState<any>(null);
  const [myRole, setMyRole] = useState<string>('');
  useEffect(() => {
    fetch('/api/auth/me').then(r => r.json()).then(d => { if (d?.role) setMyRole(d.role); }).catch(() => {});
  }, []);

  useEffect(() => {
    if (searchParams.get('add') === 'true') {
      setShowForm(true);
    }
  }, [searchParams]);

  const { data, isLoading } = useQuery({
    queryKey: ['admin-jobs'],
    queryFn: async () => {
      const res = await fetch('/api/admin/jobs');
      if (!res.ok) throw new Error('Failed to fetch');
      return res.json();
    },
  });

  const createMutation = useMutation({
    mutationFn: async (formData: any) => {
      const payload = {
        ...formData,
        skills: formData.skills ? formData.skills.split(',').map((s: string) => s.trim()) : [],
        salaryMin: formData.salaryMin ? parseInt(formData.salaryMin) : null,
        salaryMax: formData.salaryMax ? parseInt(formData.salaryMax) : null,
      };
      const res = await fetch('/api/admin/jobs', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      if (!res.ok) throw new Error('Failed to create');
      return res.json();
    },
    onSuccess: () => {
      toast.success('Job created successfully');
      queryClient.invalidateQueries({ queryKey: ['admin-jobs'] });
      setShowForm(false);
    },
    onError: (err: Error) => toast.error(err.message),
  });

  const updateMutation = useMutation({
    mutationFn: async ({ id, data: formData }: { id: string; data: any }) => {
      const payload = {
        ...formData,
        skills: formData.skills ? formData.skills.split(',').map((s: string) => s.trim()) : [],
        salaryMin: formData.salaryMin ? parseInt(formData.salaryMin) : null,
        salaryMax: formData.salaryMax ? parseInt(formData.salaryMax) : null,
      };
      const res = await fetch(`/api/admin/jobs/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      if (!res.ok) throw new Error('Failed to update');
      return res.json();
    },
    onSuccess: () => {
      toast.success('Job updated successfully');
      queryClient.invalidateQueries({ queryKey: ['admin-jobs'] });
      setEditingJob(null);
      setShowForm(false);
    },
    onError: (err: Error) => toast.error(err.message),
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const res = await fetch(`/api/admin/jobs/${id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error('Failed to delete');
    },
    onSuccess: () => {
      toast.success('Job deleted');
      queryClient.invalidateQueries({ queryKey: ['admin-jobs'] });
      setDeletingJob(null);
    },
    onError: (err: Error) => toast.error(err.message),
  });

  const jobs = data?.jobs || [];
  const totalApplications = jobs.reduce((sum: number, j: any) => sum + (j.applicationCount || 0), 0);
  const activeJobs = jobs.filter((j: any) => j.status === 'ACTIVE').length;
  const closedJobs = jobs.filter((j: any) => j.status === 'CLOSED').length;

  const stats = [
    { label: 'Total Jobs', value: jobs.length, color: 'bg-blue-500/10 text-blue-400', icon: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20.25 14.15v4.25c0 1.094-.787 2.036-1.872 2.18-2.087.277-4.216.42-6.378.42s-4.291-.143-6.378-.42c-1.085-.144-1.872-1.086-1.872-2.18v-4.25m16.5 0a2.18 2.18 0 00.75-1.661V8.706c0-1.081-.768-2.015-1.837-2.175a48.114 48.114 0 00-3.413-.387m4.5 8.006c-.194.165-.42.295-.673.38A23.978 23.978 0 0112 15.75c-2.648 0-5.195-.429-7.577-1.22a2.016 2.016 0 01-.673-.38m0 0A2.18 2.18 0 013 12.489V8.706c0-1.081.768-2.015 1.837-2.175a48.111 48.111 0 013.413-.387m7.5 0V5.25A2.25 2.25 0 0013.5 3h-3a2.25 2.25 0 00-2.25 2.25v.894m7.5 0a48.667 48.667 0 00-7.5 0M12 12.75h.008v.008H12v-.008z" /></svg> },
    { label: 'Active Jobs', value: activeJobs, color: 'bg-emerald-500/10 text-emerald-400', icon: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg> },
    { label: 'Closed Jobs', value: closedJobs, color: 'bg-red-500/10 text-red-400', icon: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636" /></svg> },
    { label: 'Total Applicants', value: totalApplications, color: 'bg-purple-500/10 text-purple-400', icon: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z" /></svg> },
  ];

  const handleEdit = (job: any) => {
    setEditingJob(job);
    setShowForm(true);
  };

  const handleFormSubmit = (formData: any) => {
    if (editingJob) {
      updateMutation.mutate({ id: editingJob.id, data: formData });
    } else {
      createMutation.mutate(formData);
    }
  };

  const handleCloseForm = () => {
    setShowForm(false);
    setEditingJob(null);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-white">Jobs</h1>
          <p className="text-gray-400 text-sm mt-1">Manage job listings</p>
        </div>
        {canCreateContent(myRole) && (
          <button
            onClick={() => setShowForm(true)}
            className="flex items-center justify-center gap-2 bg-blue-500 text-white px-4 py-2.5 rounded-lg text-sm font-medium hover:bg-blue-600 transition-all cursor-pointer w-full sm:w-auto"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.5v15m7.5-7.5h-15" /></svg>
            Add Job
          </button>
        )}
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        {stats.map((stat, i) => (
          <div key={i} className="relative group">
            <div className="absolute -inset-px bg-gradient-to-br from-white/[0.08] to-white/[0.02] rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity" />
            <div className="relative bg-zinc-900/80 border border-white/[0.06] rounded-2xl p-4 backdrop-blur-xl">
              <div className="flex items-start justify-between">
                <div className="space-y-1.5">
                  <p className="text-gray-400 text-xs font-medium uppercase tracking-wider">{stat.label}</p>
                  <p className="text-white text-xl sm:text-2xl font-bold tracking-tight">{stat.value}</p>
                </div>
                <div className={`p-2.5 rounded-xl ${stat.color}`}>
                  {stat.icon}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-2xl overflow-hidden">
        {isLoading ? (
          <div className="flex items-center justify-center h-64">
            <div className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
          </div>
        ) : jobs.length === 0 ? (
          <div className="text-center py-16">
            <p className="text-gray-500">No jobs found. Create your first job listing.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-white/5">
                  <th className="text-left text-gray-400 text-xs font-medium uppercase tracking-wider px-6 py-4">Title</th>
                  <th className="text-left text-gray-400 text-xs font-medium uppercase tracking-wider px-6 py-4">Department</th>
                  <th className="text-left text-gray-400 text-xs font-medium uppercase tracking-wider px-6 py-4">Type</th>
                  <th className="text-left text-gray-400 text-xs font-medium uppercase tracking-wider px-6 py-4">Location</th>
                  <th className="text-left text-gray-400 text-xs font-medium uppercase tracking-wider px-6 py-4">Status</th>
                  <th className="text-left text-gray-400 text-xs font-medium uppercase tracking-wider px-6 py-4">Applications</th>
                  <th className="text-right text-gray-400 text-xs font-medium uppercase tracking-wider px-6 py-4">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {jobs.map((job: any) => (
                  <tr key={job.id} className="hover:bg-white/5 transition-colors">
                    <td className="px-6 py-4">
                      <Link href={`/admin/jobs/${job.id}`} className="text-white text-sm font-medium hover:text-blue-400 transition-colors">
                        {job.title}
                      </Link>
                    </td>
                    <td className="px-6 py-4 text-gray-400 text-sm">{job.department}</td>
                    <td className="px-6 py-4">
                      <span className="text-gray-400 text-sm">{job.type}</span>
                    </td>
                    <td className="px-6 py-4 text-gray-400 text-sm">{job.location}</td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex px-3 py-1 rounded-full text-xs font-medium border ${
                        job.status === 'ACTIVE' ? 'bg-green-500/10 text-green-400 border-green-500/20' :
                        job.status === 'CLOSED' ? 'bg-red-500/10 text-red-400 border-red-500/20' :
                        'bg-yellow-500/10 text-yellow-400 border-yellow-500/20'
                      }`}>
                        {job.status}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <Link href={`/admin/jobs/${job.id}`} className="text-blue-400 text-sm hover:text-blue-300 transition-colors">
                        {job.applicationCount || 0} applicant{(job.applicationCount || 0) !== 1 ? 's' : ''}
                      </Link>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-end gap-2">
                        {canEditContent(myRole) && (
                          <button
                            onClick={() => handleEdit(job)}
                            className="p-2 text-gray-400 hover:text-blue-400 hover:bg-blue-500/10 rounded-lg transition-all cursor-pointer"
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>
                          </button>
                        )}
                        {canDeleteContent(myRole) && (
                          <button
                            onClick={() => setDeletingJob(job)}
                            className="p-2 text-gray-400 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-all cursor-pointer"
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                          </button>
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

      <JobFormModal
        isOpen={showForm}
        onClose={handleCloseForm}
        onSubmit={handleFormSubmit}
        initialData={editingJob ? {
          title: editingJob.title,
          department: editingJob.department,
          type: editingJob.type,
          location: editingJob.location,
          salary: editingJob.salary || '',
          salaryMin: editingJob.salaryMin?.toString() || '',
          salaryMax: editingJob.salaryMax?.toString() || '',
          skills: editingJob.skills?.join(', ') || '',
          description: editingJob.description,
          icon: editingJob.icon || '',
          status: editingJob.status,
        } : null}
        isLoading={createMutation.isPending || updateMutation.isPending}
      />

      <ConfirmDeleteModal
        isOpen={!!deletingJob}
        title="Delete Job"
        message={`Are you sure you want to delete "${deletingJob?.title}"? This action cannot be undone.`}
        onConfirm={() => {
          if (!deletingJob) return;
          deleteMutation.mutate(deletingJob.id);
        }}
        onCancel={() => setDeletingJob(null)}
        isLoading={deleteMutation.isPending}
      />
    </div>
  );
}
