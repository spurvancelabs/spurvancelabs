'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import ProjectSidebar from '@/components/projects/ProjectSidebar';
import ProjectHeader from '@/components/projects/ProjectHeader';

interface ProjectData {
  id: string;
  name: string;
  description: string | null;
  key: string;
  status: string;
  color: string | null;
  startDate: string | null;
  endDate: string | null;
  owner: { id: string; name: string | null; email: string };
}

interface Member {
  id: string;
  userId: string;
  role: string;
  user: { id: string; name: string | null; email: string; image: string | null };
  createdAt: string;
}

const PROJECT_ROLES = ['PROJECT_OWNER', 'PROJECT_MANAGER', 'DEVELOPER', 'CLIENT', 'VIEWER'];
const PROJECT_STATUSES = ['ACTIVE', 'ON_HOLD', 'COMPLETED', 'ARCHIVED'];

export default function SettingsPage({ params }: { params: Promise<{ projectId: string }> }) {
  const router = useRouter();
  const [projectId, setProjectId] = useState('');
  const [project, setProject] = useState<ProjectData | null>(null);
  const [members, setMembers] = useState<Member[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [addEmail, setAddEmail] = useState('');
  const [addRole, setAddRole] = useState('DEVELOPER');
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  useEffect(() => { params.then(p => setProjectId(p.projectId)); }, [params]);

  const fetchData = useCallback(() => {
    if (!projectId) return;
    Promise.all([
      fetch(`/api/projects/${projectId}`, { credentials: 'include' }).then(r => r.json()),
      fetch(`/api/projects/${projectId}/members`, { credentials: 'include' }).then(r => r.json()),
    ]).then(([pData, mData]) => {
      setProject(pData.data);
      setMembers(mData.data || []);
      setLoading(false);
    }).catch(() => setLoading(false));
  }, [projectId]);

  useEffect(() => { fetchData(); }, [fetchData]);

  const handleUpdate = async (updates: Partial<ProjectData>) => {
    setSaving(true);
    try {
      const res = await fetch(`/api/projects/${projectId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(updates),
      });
      if (res.ok) fetchData();
    } finally { setSaving(false); }
  };

  const handleAddMember = async () => {
    if (!addEmail.trim()) return;
    try {
      const res = await fetch(`/api/projects/${projectId}/members`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ email: addEmail.trim(), role: addRole }),
      });
      if (res.ok) {
        setAddEmail('');
        fetchData();
      }
    } catch { toast.error('Failed to add member'); }
  };

  const handleRemoveMember = async (userId: string) => {
    try {
      await fetch(`/api/projects/${projectId}/members`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ userId }),
      });
      fetchData();
    } catch { toast.error('Failed to remove member'); }
  };

  const handleDelete = async () => {
    try {
      const res = await fetch(`/api/projects/${projectId}`, { method: 'DELETE', credentials: 'include' });
      if (res.ok) { router.push('/projects'); }
      else { toast.error('Failed to delete project'); }
    } catch { toast.error('Failed to delete project'); }
  };

  if (loading) {
    return (
      <div className="flex min-h-screen bg-zinc-950">
        <ProjectSidebar />
        <div className="flex-1 lg:ml-64 flex items-center justify-center">
          <div className="animate-spin w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full" />
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-zinc-950">
      <ProjectSidebar project={project || undefined} />
      <div className="flex-1 lg:ml-64">
        <ProjectHeader projectName={project?.name} projectKey={project?.key} projectId={projectId} />
        <main className="p-4 sm:p-6 lg:p-8 max-w-3xl">
          <h1 className="text-xl font-bold text-white mb-6">Project Settings</h1>

          <div className="bg-zinc-900 border border-white/[0.06] rounded-xl p-6 mb-6">
            <h2 className="text-lg font-semibold text-white mb-4">General</h2>
            <div className="space-y-4">
              <div>
                <label className="text-sm text-gray-400 mb-1 block">Project Name</label>
                <input
                  type="text"
                  defaultValue={project?.name}
                  onBlur={e => handleUpdate({ name: e.target.value })}
                  className="w-full bg-zinc-800 border border-white/[0.06] rounded-lg px-3 py-2 text-white text-sm outline-none focus:border-blue-500/50"
                />
              </div>
              <div>
                <label className="text-sm text-gray-400 mb-1 block">Description</label>
                <textarea
                  defaultValue={project?.description || ''}
                  onBlur={e => handleUpdate({ description: e.target.value })}
                  className="w-full bg-zinc-800 border border-white/[0.06] rounded-lg px-3 py-2 text-white text-sm outline-none resize-none focus:border-blue-500/50"
                  rows={3}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm text-gray-400 mb-1 block">Status</label>
                  <select
                    defaultValue={project?.status}
                    onChange={e => handleUpdate({ status: e.target.value })}
                    className="w-full bg-zinc-800 border border-white/[0.06] rounded-lg px-3 py-2 text-white text-sm outline-none"
                  >
                    {PROJECT_STATUSES.map(s => <option key={s} value={s}>{s.replace('_', ' ')}</option>)}
                  </select>
                </div>
                <div>
                  <label className="text-sm text-gray-400 mb-1 block">Color</label>
                  <input
                    type="color"
                    defaultValue={project?.color || '#6366f1'}
                    onBlur={e => handleUpdate({ color: e.target.value })}
                    className="w-10 h-10 rounded-lg border border-white/[0.06] cursor-pointer bg-transparent"
                  />
                </div>
              </div>
              {saving && <p className="text-xs text-gray-500">Saving...</p>}
            </div>
          </div>

          <div className="bg-zinc-900 border border-white/[0.06] rounded-xl p-6 mb-6">
            <h2 className="text-lg font-semibold text-white mb-4">Members ({members.length})</h2>
            <div className="space-y-2 mb-4">
              {members.map(m => (
                <div key={m.id} className="flex items-center justify-between bg-zinc-800 rounded-lg px-4 py-3">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center text-white text-xs">
                      {(m.user.name || m.user.email)[0].toUpperCase()}
                    </div>
                    <div>
                      <p className="text-sm text-white">{m.user.name || 'Unknown'}</p>
                      <p className="text-[11px] text-gray-500">{m.user.email}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <select
                      defaultValue={m.role}
                      onChange={async (e) => {
                        const newRole = e.target.value;
                        try {
                          const delRes = await fetch(`/api/projects/${projectId}/members`, {
                            method: 'DELETE',
                            headers: { 'Content-Type': 'application/json' },
                            credentials: 'include',
                            body: JSON.stringify({ userId: m.userId }),
                          });
                          if (!delRes.ok) { toast.error('Failed to update role'); return; }
                          const addRes = await fetch(`/api/projects/${projectId}/members`, {
                            method: 'POST',
                            headers: { 'Content-Type': 'application/json' },
                            credentials: 'include',
                            body: JSON.stringify({ email: m.user.email, role: newRole }),
                          });
                          if (!addRes.ok) {
                            toast.error('Failed to re-add member. Reverting...');
                            await fetch(`/api/projects/${projectId}/members`, {
                              method: 'POST',
                              headers: { 'Content-Type': 'application/json' },
                              credentials: 'include',
                              body: JSON.stringify({ email: m.user.email, role: m.role }),
                            });
                          }
                          fetchData();
                        } catch { toast.error('Failed to update role'); }
                      }}
                      className="bg-zinc-700 border border-white/[0.06] rounded-lg px-2 py-1 text-xs text-white outline-none"
                    >
                      {PROJECT_ROLES.map(r => <option key={r} value={r}>{r.replace('_', ' ')}</option>)}
                    </select>
                    <button
                      onClick={() => handleRemoveMember(m.userId)}
                      className="text-gray-600 hover:text-red-400 cursor-pointer"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>
                </div>
              ))}
            </div>
            <div className="flex gap-2">
              <input
                type="email"
                value={addEmail}
                onChange={e => setAddEmail(e.target.value)}
                placeholder="Email address"
                className="flex-1 bg-zinc-800 border border-white/[0.06] rounded-lg px-3 py-2 text-white text-sm outline-none focus:border-blue-500/50"
              />
              <select
                value={addRole}
                onChange={e => setAddRole(e.target.value)}
                className="bg-zinc-800 border border-white/[0.06] rounded-lg px-3 py-2 text-white text-sm outline-none"
              >
                {PROJECT_ROLES.map(r => <option key={r} value={r}>{r.replace('_', ' ')}</option>)}
              </select>
              <button
                onClick={handleAddMember}
                disabled={!addEmail.trim()}
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm disabled:opacity-50 cursor-pointer"
              >
                Add
              </button>
            </div>
          </div>

          <div className="bg-red-500/5 border border-red-500/20 rounded-xl p-6">
            <h2 className="text-lg font-semibold text-red-400 mb-2">Danger Zone</h2>
            <p className="text-gray-400 text-sm mb-4">Permanently delete this project and all associated data. This cannot be undone.</p>
            {!showDeleteConfirm ? (
              <button
                onClick={() => setShowDeleteConfirm(true)}
                className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg text-sm cursor-pointer"
              >
                Delete Project
              </button>
            ) : (
              <div className="flex items-center gap-3">
                <span className="text-sm text-red-400">Type the project key to confirm:</span>
                <input
                  type="text"
                  placeholder={project?.key}
                  className="bg-zinc-800 border border-red-500/30 rounded-lg px-3 py-2 text-white text-sm outline-none w-32"
                  onKeyDown={e => {
                    if (e.key === 'Enter' && e.currentTarget.value === project?.key) handleDelete();
                  }}
                />
                <button onClick={() => setShowDeleteConfirm(false)} className="text-gray-400 hover:text-white text-sm cursor-pointer">Cancel</button>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}
