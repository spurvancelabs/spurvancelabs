'use client';

import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import toast from 'react-hot-toast';
import ApplicationStatusBadge from '@/components/admin/ApplicationStatusBadge';
import ApplicationDetailModal from '@/components/admin/ApplicationDetailModal';

const statusOptions = ['PENDING', 'REVIEWED', 'SHORTLISTED', 'REJECTED', 'ACCEPTED'];

export default function AdminInternshipDetailPage() {
  const params = useParams();
  const id = params.id as string;
  const queryClient = useQueryClient();
  const [selectedApp, setSelectedApp] = useState<any>(null);

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

  return (
    <div className="space-y-6">
      <Link href="/admin/internships" className="inline-flex items-center gap-2 text-gray-400 hover:text-white text-sm transition-colors">
        <img src="https://img.icons8.com/3d-fluency/16/back.png" alt="" className="w-[16px] h-[16px]" />
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
        <h2 className="text-xl font-semibold text-white mb-4">
          Applications ({applications.length})
        </h2>

        <div className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-2xl overflow-hidden">
          {appsLoading ? (
            <div className="flex items-center justify-center h-64">
              <div className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
            </div>
          ) : applications.length === 0 ? (
            <div className="text-center py-16">
              <p className="text-gray-500">No applications yet for this internship.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-white/5">
                    <th className="text-left text-gray-400 text-xs font-medium uppercase tracking-wider px-6 py-4">Applicant</th>
                    <th className="text-left text-gray-400 text-xs font-medium uppercase tracking-wider px-6 py-4">Email</th>
                    <th className="text-left text-gray-400 text-xs font-medium uppercase tracking-wider px-6 py-4">Status</th>
                    <th className="text-left text-gray-400 text-xs font-medium uppercase tracking-wider px-6 py-4">Date</th>
                    <th className="text-right text-gray-400 text-xs font-medium uppercase tracking-wider px-6 py-4">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {applications.map((app: any) => (
                    <tr key={app.id} className="hover:bg-white/5 transition-colors">
                      <td className="px-6 py-4">
                        <button
                          onClick={() => setSelectedApp(app)}
                          className="text-white text-sm font-medium hover:text-blue-400 transition-colors text-left cursor-pointer"
                        >
                          {app.name}
                        </button>
                      </td>
                      <td className="px-6 py-4 text-gray-400 text-sm">{app.email}</td>
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
                            onChange={(e) => statusMutation.mutate({ appId: app.id, status: e.target.value })}
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
      </div>

      <ApplicationDetailModal
        isOpen={!!selectedApp}
        onClose={() => setSelectedApp(null)}
        application={selectedApp ? { ...selectedApp, applicationType: 'internship' } : null}
        jobInfo={internshipData ? { id: internshipData.id, title: internshipData.title, department: internshipData.department, type: internshipData.duration, location: internshipData.location } : null}
      />
    </div>
  );
}
