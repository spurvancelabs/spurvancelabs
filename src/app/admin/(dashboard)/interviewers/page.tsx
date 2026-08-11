'use client';

import { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { canCreateContent, canEditContent, canDeleteContent } from '@/lib/lms/permissions';

export default function AdminInterviewersPage() {
  const queryClient = useQueryClient();
  const [newName, setNewName] = useState('');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editName, setEditName] = useState('');
  const [myRole, setMyRole] = useState<string>('');
  useEffect(() => {
    fetch('/api/auth/me').then(r => r.json()).then(d => { if (d?.role) setMyRole(d.role); }).catch(() => {});
  }, []);

  const { data, isLoading } = useQuery({
    queryKey: ['admin-interviewers'],
    queryFn: async () => {
      const res = await fetch('/api/admin/interviewers');
      if (!res.ok) throw new Error('Failed to fetch');
      return res.json();
    },
  });

  const addMutation = useMutation({
    mutationFn: async (name: string) => {
      const res = await fetch('/api/admin/interviewers', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name }),
      });
      if (!res.ok) {
        let message = 'Failed to add interviewer';
        try {
          const json = await res.json();
          if (json?.error) message = json.error;
        } catch {}
        throw new Error(message);
      }
      return res.json();
    },
    onSuccess: () => {
      toast.success('Interviewer added');
      setNewName('');
      queryClient.invalidateQueries({ queryKey: ['admin-interviewers'] });
    },
    onError: (err: Error) => toast.error(err.message),
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const res = await fetch(`/api/admin/interviewers/${id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error('Failed to delete');
    },
    onSuccess: () => {
      toast.success('Interviewer deleted');
      queryClient.invalidateQueries({ queryKey: ['admin-interviewers'] });
    },
    onError: (err: Error) => toast.error(err.message),
  });

  const editMutation = useMutation({
    mutationFn: async ({ id, name }: { id: string; name: string }) => {
      const res = await fetch(`/api/admin/interviewers/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name }),
      });
      if (!res.ok) {
        let message = 'Failed to update interviewer';
        try {
          const json = await res.json();
          if (json?.error) message = json.error;
        } catch {}
        throw new Error(message);
      }
      return res.json();
    },
    onSuccess: () => {
      toast.success('Interviewer updated');
      setEditingId(null);
      setEditName('');
      queryClient.invalidateQueries({ queryKey: ['admin-interviewers'] });
    },
    onError: (err: Error) => toast.error(err.message),
  });

  const interviewers = data?.interviewers || [];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-white">Interviewers</h1>
          <p className="text-gray-400 text-sm mt-1">Manage interviewers for job and internship applications</p>
        </div>
      </div>

      {canCreateContent(myRole) && (
        <div className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-2xl p-4 sm:p-6">
          <div className="flex items-center gap-3">
            <input
              type="text"
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              onKeyDown={(e) => { if (e.key === 'Enter' && newName.trim()) addMutation.mutate(newName.trim()); }}
              placeholder="Enter interviewer name..."
              className="flex-1 bg-[#1a1a1a] border border-[#2a2a2a] rounded-lg px-4 py-2.5 text-white text-sm focus:outline-none focus:border-blue-500"
            />
            <button
              onClick={() => { if (newName.trim()) addMutation.mutate(newName.trim()); }}
              disabled={!newName.trim() || addMutation.isPending}
              className="bg-blue-500 text-white px-4 py-2.5 rounded-lg text-sm font-medium hover:bg-blue-600 transition-all disabled:opacity-50 cursor-pointer whitespace-nowrap flex items-center gap-2"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.5v15m7.5-7.5h-15" /></svg>
              Add Interviewer
            </button>
          </div>
        </div>
      )}

      <div className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-2xl overflow-hidden">
        {isLoading ? (
          <div className="flex items-center justify-center h-64">
            <div className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
          </div>
        ) : interviewers.length === 0 ? (
          <div className="text-center py-16">
            <p className="text-gray-500">No interviewers yet. Add your first interviewer above.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-white/5">
                  <th className="text-left text-gray-400 text-xs font-medium uppercase tracking-wider px-6 py-4">Name</th>
                  <th className="text-left text-gray-400 text-xs font-medium uppercase tracking-wider px-6 py-4">Created</th>
                  <th className="text-right text-gray-400 text-xs font-medium uppercase tracking-wider px-6 py-4">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {interviewers.map((interviewer: any) => (
                  <tr key={interviewer.id} className="hover:bg-white/5 transition-colors">
                    <td className="px-6 py-4 text-white text-sm">
                      {editingId === interviewer.id ? (
                        <div className="flex items-center gap-2">
                          <input
                            type="text"
                            value={editName}
                            onChange={(e) => setEditName(e.target.value)}
                            onKeyDown={(e) => {
                              if (e.key === 'Enter' && editName.trim()) editMutation.mutate({ id: interviewer.id, name: editName.trim() });
                              if (e.key === 'Escape') { setEditingId(null); setEditName(''); }
                            }}
                            autoFocus
                            className="flex-1 bg-[#1a1a1a] border border-[#2a2a2a] rounded-lg px-3 py-1.5 text-white text-sm focus:outline-none focus:border-blue-500"
                          />
                          <button
                            onClick={() => { if (editName.trim()) editMutation.mutate({ id: interviewer.id, name: editName.trim() }); }}
                            disabled={!editName.trim() || editMutation.isPending}
                            className="px-3 py-1.5 rounded-lg text-xs font-medium bg-blue-500 text-white hover:bg-blue-600 transition-all disabled:opacity-50 cursor-pointer"
                          >
                            Save
                          </button>
                          <button
                            onClick={() => { setEditingId(null); setEditName(''); }}
                            className="px-3 py-1.5 rounded-lg text-xs font-medium bg-white/10 text-gray-300 hover:bg-white/20 transition-all cursor-pointer"
                          >
                            Cancel
                          </button>
                        </div>
                      ) : (
                        interviewer.name
                      )}
                    </td>
                    <td className="px-6 py-4 text-gray-400 text-sm">
                      {new Date(interviewer.created_at).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-end">
                        {canEditContent(myRole) && (
                          <button
                            onClick={() => { setEditingId(interviewer.id); setEditName(interviewer.name); }}
                            className="p-2 text-gray-400 hover:text-blue-400 hover:bg-blue-500/10 rounded-lg transition-all cursor-pointer"
                            title="Edit"
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10" /></svg>
                          </button>
                        )}
                        {canDeleteContent(myRole) && (
                          <button
                            onClick={() => deleteMutation.mutate(interviewer.id)}
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
    </div>
  );
}
