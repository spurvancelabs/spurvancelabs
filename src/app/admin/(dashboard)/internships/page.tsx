'use client';

import { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import toast from 'react-hot-toast';
import InternshipFormModal from '@/components/admin/InternshipFormModal';
import ConfirmDeleteModal from '@/components/admin/ConfirmDeleteModal';
import { canCreateContent, canEditContent, canDeleteContent } from '@/lib/lms/permissions';

export default function AdminInternshipsPage() {
  const queryClient = useQueryClient();
  const searchParams = useSearchParams();
  const [showForm, setShowForm] = useState(searchParams.get('add') === 'true');
  const [editingInternship, setEditingInternship] = useState<any>(null);
  const [deletingInternship, setDeletingInternship] = useState<any>(null);
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
    queryKey: ['admin-internships'],
    queryFn: async () => {
      const res = await fetch('/api/admin/internships');
      if (!res.ok) throw new Error('Failed to fetch');
      return res.json();
    },
  });

  const createMutation = useMutation({
    mutationFn: async (formData: any) => {
      const payload = {
        ...formData,
        skills: formData.skills ? formData.skills.split(',').map((s: string) => s.trim()) : [],
        stipendAmount: formData.stipendAmount ? parseInt(formData.stipendAmount) : null,
      };
      const res = await fetch('/api/admin/internships', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      if (!res.ok) throw new Error('Failed to create');
      return res.json();
    },
    onSuccess: () => {
      toast.success('Internship created successfully');
      queryClient.invalidateQueries({ queryKey: ['admin-internships'] });
      setShowForm(false);
    },
    onError: (err: Error) => toast.error(err.message),
  });

  const updateMutation = useMutation({
    mutationFn: async ({ id, data: formData }: { id: string; data: any }) => {
      const payload = {
        ...formData,
        skills: formData.skills ? formData.skills.split(',').map((s: string) => s.trim()) : [],
        stipendAmount: formData.stipendAmount ? parseInt(formData.stipendAmount) : null,
      };
      const res = await fetch(`/api/admin/internships/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      if (!res.ok) throw new Error('Failed to update');
      return res.json();
    },
    onSuccess: () => {
      toast.success('Internship updated successfully');
      queryClient.invalidateQueries({ queryKey: ['admin-internships'] });
      setEditingInternship(null);
      setShowForm(false);
    },
    onError: (err: Error) => toast.error(err.message),
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const res = await fetch(`/api/admin/internships/${id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error('Failed to delete');
    },
    onSuccess: () => {
      toast.success('Internship deleted');
      queryClient.invalidateQueries({ queryKey: ['admin-internships'] });
      setDeletingInternship(null);
    },
    onError: (err: Error) => toast.error(err.message),
  });

  const internships = data?.internships || [];
  const totalApplications = internships.reduce((sum: number, j: any) => sum + (j.applicationCount || 0), 0);
  const activeInternships = internships.filter((j: any) => j.status === 'ACTIVE').length;
  const closedInternships = internships.filter((j: any) => j.status === 'CLOSED').length;

  const stats = [
    { label: 'Total Internships', value: internships.length, color: 'bg-purple-500/10 text-purple-400', icon: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4.26 10.147a60.438 60.438 0 0 0-.491 6.347A48.62 48.62 0 0 1 12 20.904a48.62 48.62 0 0 1 8.232-4.41 60.46 60.46 0 0 0-.491-6.347m-15.482 0a50.636 50.636 0 0 0-2.658-.813A59.906 59.906 0 0 1 12 3.493a59.903 59.903 0 0 1 10.399 5.84c-.896.248-1.783.52-2.658.814m-15.482 0A50.717 50.717 0 0 1 12 13.489a50.702 50.702 0 0 1 7.74-3.342" /></svg> },
    { label: 'Active', value: activeInternships, color: 'bg-emerald-500/10 text-emerald-400', icon: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg> },
    { label: 'Closed', value: closedInternships, color: 'bg-red-500/10 text-red-400', icon: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636" /></svg> },
    { label: 'Total Applicants', value: totalApplications, color: 'bg-blue-500/10 text-blue-400', icon: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z" /></svg> },
  ];

  const handleEdit = (internship: any) => {
    setEditingInternship(internship);
    setShowForm(true);
  };

  const handleFormSubmit = (formData: any) => {
    if (editingInternship) {
      updateMutation.mutate({ id: editingInternship.id, data: formData });
    } else {
      createMutation.mutate(formData);
    }
  };

  const handleCloseForm = () => {
    setShowForm(false);
    setEditingInternship(null);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-white">Internships</h1>
          <p className="text-gray-400 text-sm mt-1">Manage internship listings</p>
        </div>
        {canCreateContent(myRole) && (
          <button
            onClick={() => setShowForm(true)}
            className="flex items-center justify-center gap-2 bg-blue-500 text-white px-4 py-2.5 rounded-lg text-sm font-medium hover:bg-blue-600 transition-all cursor-pointer w-full sm:w-auto"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.5v15m7.5-7.5h-15" /></svg>
            Add Internship
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
        ) : internships.length === 0 ? (
          <div className="text-center py-16">
            <p className="text-gray-500">No internships found. Create your first internship listing.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-white/5">
                  <th className="text-left text-gray-400 text-xs font-medium uppercase tracking-wider px-6 py-4">Title</th>
                  <th className="text-left text-gray-400 text-xs font-medium uppercase tracking-wider px-6 py-4">Department</th>
                  <th className="text-left text-gray-400 text-xs font-medium uppercase tracking-wider px-6 py-4">Duration</th>
                  <th className="text-left text-gray-400 text-xs font-medium uppercase tracking-wider px-6 py-4">Location</th>
                  <th className="text-left text-gray-400 text-xs font-medium uppercase tracking-wider px-6 py-4">Status</th>
                  <th className="text-left text-gray-400 text-xs font-medium uppercase tracking-wider px-6 py-4">Applications</th>
                  <th className="text-right text-gray-400 text-xs font-medium uppercase tracking-wider px-6 py-4">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {internships.map((internship: any) => (
                  <tr key={internship.id} className="hover:bg-white/5 transition-colors">
                    <td className="px-6 py-4">
                      <Link href={`/admin/internships/${internship.id}`} className="text-white text-sm font-medium hover:text-blue-400 transition-colors">
                        {internship.title}
                      </Link>
                    </td>
                    <td className="px-6 py-4 text-gray-400 text-sm">{internship.department}</td>
                    <td className="px-6 py-4 text-gray-400 text-sm">{internship.duration}</td>
                    <td className="px-6 py-4 text-gray-400 text-sm">{internship.location}</td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex px-3 py-1 rounded-full text-xs font-medium border ${
                        internship.status === 'ACTIVE' ? 'bg-green-500/10 text-green-400 border-green-500/20' :
                        internship.status === 'CLOSED' ? 'bg-red-500/10 text-red-400 border-red-500/20' :
                        'bg-yellow-500/10 text-yellow-400 border-yellow-500/20'
                      }`}>
                        {internship.status}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <Link href={`/admin/internships/${internship.id}`} className="text-blue-400 text-sm hover:text-blue-300 transition-colors">
                        {internship.applicationCount || 0} applicant{(internship.applicationCount || 0) !== 1 ? 's' : ''}
                      </Link>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-end gap-2">
                        {canEditContent(myRole) && (
                          <button
                            onClick={() => handleEdit(internship)}
                            className="p-2 text-gray-400 hover:text-blue-400 hover:bg-blue-500/10 rounded-lg transition-all cursor-pointer"
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>
                          </button>
                        )}
                        {canDeleteContent(myRole) && (
                          <button
                            onClick={() => setDeletingInternship(internship)}
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

      <InternshipFormModal
        isOpen={showForm}
        onClose={handleCloseForm}
        onSubmit={handleFormSubmit}
        initialData={editingInternship ? {
          title: editingInternship.title,
          department: editingInternship.department,
          duration: editingInternship.duration,
          location: editingInternship.location,
          stipend: editingInternship.stipend || '',
          stipendAmount: editingInternship.stipendAmount?.toString() || '',
          skills: editingInternship.skills?.join(', ') || '',
          description: editingInternship.description,
          icon: editingInternship.icon || '',
          status: editingInternship.status,
        } : null}
        isLoading={createMutation.isPending || updateMutation.isPending}
      />

      <ConfirmDeleteModal
        isOpen={!!deletingInternship}
        title="Delete Internship"
        message={`Are you sure you want to delete "${deletingInternship?.title}"? This action cannot be undone.`}
        onConfirm={() => {
          if (!deletingInternship) return;
          deleteMutation.mutate(deletingInternship.id);
        }}
        onCancel={() => setDeletingInternship(null)}
        isLoading={deleteMutation.isPending}
      />
    </div>
  );
}
