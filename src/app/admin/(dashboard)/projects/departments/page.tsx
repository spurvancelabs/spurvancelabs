'use client';

import { useState, useEffect } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';

interface Project {
  id: string;
  name: string;
  key: string;
  color: string | null;
}

interface DepartmentMember {
  user: { id: string; name: string | null; email: string; image: string | null };
}

interface Department {
  id: string;
  projectId: string;
  name: string;
  description: string | null;
  color: string | null;
  _count: { members: number; tickets: number };
  members: DepartmentMember[];
}

interface User {
  id: string;
  name: string | null;
  email: string;
  image?: string | null;
}

const DEFAULT_COLORS = ['#6366f1', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#06b6d4', '#ec4899', '#84cc16'];

export default function AdminDepartmentsPage() {
  const queryClient = useQueryClient();
  const [projectId, setProjectId] = useState('');
  const [projects, setProjects] = useState<Project[]>([]);
  const [selectedDept, setSelectedDept] = useState<Department | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [formName, setFormName] = useState('');
  const [formDesc, setFormDesc] = useState('');
  const [formColor, setFormColor] = useState(DEFAULT_COLORS[0]);
  const [saving, setSaving] = useState(false);
  const [expandedDept, setExpandedDept] = useState<string | null>(null);
  const [userSearch, setUserSearch] = useState('');
  const [addingUserId, setAddingUserId] = useState('');

  useEffect(() => {
    fetch('/api/admin/projects')
      .then(r => r.json())
      .then(data => {
        const list = data?.projects || [];
        setProjects(list);
        if (list.length > 0) setProjectId(list[0].id);
      })
      .catch(() => {});
  }, []);

  const { data, isLoading } = useQuery({
    queryKey: ['admin-departments', projectId],
    queryFn: async () => {
      const res = await fetch(`/api/admin/departments?projectId=${projectId}`);
      if (!res.ok) throw new Error('Failed to fetch departments');
      return res.json();
    },
    enabled: !!projectId,
  });

  const departments: Department[] = data?.departments || [];

  const selectedProject = projects.find(p => p.id === projectId);

  const invalidate = () => {
    queryClient.invalidateQueries({ queryKey: ['admin-departments', projectId] });
  };

  const openCreate = () => {
    setSelectedDept(null);
    setFormName('');
    setFormDesc('');
    setFormColor(DEFAULT_COLORS[0]);
    setShowForm(true);
  };

  const openEdit = (d: Department) => {
    setSelectedDept(d);
    setFormName(d.name);
    setFormDesc(d.description || '');
    setFormColor(d.color || DEFAULT_COLORS[0]);
    setShowForm(true);
  };

  const handleSave = async () => {
    if (!formName.trim()) return;
    setSaving(true);
    try {
      if (selectedDept) {
        const res = await fetch(`/api/admin/departments/${selectedDept.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ name: formName, description: formDesc, color: formColor }),
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || 'Update failed');
        toast.success('Department updated');
      } else {
        const res = await fetch('/api/admin/departments', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ projectId, name: formName, description: formDesc, color: formColor }),
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || 'Create failed');
        toast.success('Department created');
      }
      setShowForm(false);
      invalidate();
    } catch (e: any) {
      toast.error(e.message);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (d: Department) => {
    if (!confirm(`Delete department "${d.name}"? Tickets will keep their department removed.`)) return;
    try {
      const res = await fetch(`/api/admin/departments/${d.id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error('Delete failed');
      toast.success('Department deleted');
      invalidate();
    } catch {
      toast.error('Delete failed');
    }
  };

  const addMember = async (userId: string) => {
    if (!expandedDept) return;
    try {
      const res = await fetch(`/api/admin/departments/${expandedDept}/members`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Add failed');
      toast.success('Member added');
      setUserSearch('');
      setAddingUserId('');
      invalidate();
    } catch (e: any) {
      toast.error(e.message);
    }
  };

  const removeMember = async (userId: string) => {
    if (!expandedDept) return;
    try {
      const res = await fetch(`/api/admin/departments/${expandedDept}/members/${userId}`, { method: 'DELETE' });
      if (!res.ok) throw new Error('Remove failed');
      toast.success('Member removed');
      invalidate();
    } catch {
      toast.error('Remove failed');
    }
  };

  const expanded = departments.find(d => d.id === expandedDept) || null;
  const existingMemberIds = new Set((expanded?.members || []).map(m => m.user.id));

  const { data: usersData } = useQuery({
    queryKey: ['admin-users'],
    queryFn: async () => {
      const res = await fetch('/api/admin/users');
      if (!res.ok) throw new Error('Failed to fetch users');
      return res.json();
    },
    enabled: !!expandedDept,
  });

  const users: User[] = usersData?.users || [];
  const availableUsers = users
    .filter(u => !existingMemberIds.has(u.id))
    .filter(u =>
      !userSearch ||
      (u.name || '').toLowerCase().includes(userSearch.toLowerCase()) ||
      (u.email || '').toLowerCase().includes(userSearch.toLowerCase())
    );

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-white">Departments</h1>
          <p className="text-gray-400 text-sm mt-1">Manage Jira departments and their members per project</p>
        </div>
      </div>

      <div className="rounded-xl bg-zinc-900 border border-white/[0.06] p-4 mb-6">
        <label className="block text-xs text-gray-500 mb-2">Select Project</label>
        <select
          value={projectId}
          onChange={e => { setProjectId(e.target.value); setExpandedDept(null); }}
          className="w-full sm:w-96 bg-zinc-800 border border-white/[0.06] rounded-lg px-3 py-2 text-white text-sm outline-none focus:border-blue-500/50"
        >
          {projects.map(p => (
            <option key={p.id} value={p.id}>{p.name} ({p.key})</option>
          ))}
        </select>
      </div>

      {isLoading ? (
        <div className="p-6 space-y-3">
          {[1, 2, 3].map(i => (
            <div key={i} className="h-20 bg-zinc-800/50 rounded-xl animate-pulse" />
          ))}
        </div>
      ) : departments.length === 0 ? (
        <div className="rounded-xl bg-zinc-900 border border-white/[0.06] p-12 text-center">
          <p className="text-gray-500 text-sm mb-4">No departments in {selectedProject?.name || 'this project'} yet</p>
          <button
            onClick={openCreate}
            className="bg-blue-500 hover:bg-blue-600 text-white text-sm px-4 py-2 rounded-lg font-medium transition-colors cursor-pointer"
          >
            + Create Department
          </button>
        </div>
      ) : (
        <div className="space-y-3">
          <div className="flex justify-end">
            <button
              onClick={openCreate}
              className="bg-blue-500 hover:bg-blue-600 text-white text-sm px-4 py-2 rounded-lg font-medium transition-colors cursor-pointer"
            >
              + New Department
            </button>
          </div>
          {departments.map(d => (
            <div key={d.id} className="rounded-xl bg-zinc-900 border border-white/[0.06] overflow-hidden">
              <div className="flex items-center gap-4 p-4">
                <div className="w-3 h-3 rounded-full shrink-0" style={{ backgroundColor: d.color || '#6366f1' }} />
                <div className="flex-1 min-w-0">
                  <p className="text-white font-medium">{d.name}</p>
                  {d.description && <p className="text-gray-500 text-xs mt-0.5 truncate">{d.description}</p>}
                </div>
                <div className="text-right shrink-0">
                  <p className="text-sm text-gray-300">{d._count.members} members</p>
                  <p className="text-[11px] text-gray-500">{d._count.tickets} tickets</p>
                </div>
                <button
                  onClick={() => setExpandedDept(expandedDept === d.id ? null : d.id)}
                  className="px-3 py-1.5 text-xs text-blue-400 hover:text-blue-300 border border-blue-500/20 bg-blue-500/10 rounded-lg transition-colors cursor-pointer shrink-0"
                >
                  {expandedDept === d.id ? 'Close Members' : 'Members'}
                </button>
                <div className="flex items-center gap-2 shrink-0">
                  <button
                    onClick={() => openEdit(d)}
                    className="text-gray-400 hover:text-white transition-colors cursor-pointer"
                    title="Edit"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L6.832 19.82a4.5 4.5 0 01-1.897 1.13l-2.685.8.8-2.685a4.5 4.5 0 011.13-1.897L16.862 4.487z" /></svg>
                  </button>
                  <button
                    onClick={() => handleDelete(d)}
                    className="text-gray-400 hover:text-red-400 transition-colors cursor-pointer"
                    title="Delete"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" /></svg>
                  </button>
                </div>
              </div>

              {expandedDept === d.id && (
                <div className="border-t border-white/[0.06] p-4 bg-black/20">
                  <div className="flex flex-col sm:flex-row gap-3 mb-4">
                    <input
                      type="text"
                      value={userSearch}
                      onChange={e => setUserSearch(e.target.value)}
                      placeholder="Search users by name or email..."
                      className="flex-1 bg-zinc-800 border border-white/[0.06] rounded-lg px-3 py-2 text-white text-sm outline-none focus:border-blue-500/50"
                    />
                    <select
                      value={addingUserId}
                      onChange={e => setAddingUserId(e.target.value)}
                      className="bg-zinc-800 border border-white/[0.06] rounded-lg px-3 py-2 text-white text-sm outline-none focus:border-blue-500/50 flex-1"
                    >
                      <option value="">Select a user...</option>
                      {availableUsers.map(u => (
                        <option key={u.id} value={u.id}>{u.name || u.email}</option>
                      ))}
                    </select>
                    <button
                      onClick={() => addingUserId && addMember(addingUserId)}
                      disabled={!addingUserId}
                      className="bg-blue-500 hover:bg-blue-600 text-white text-sm px-4 py-2 rounded-lg font-medium transition-colors cursor-pointer disabled:opacity-40"
                    >
                      Add
                    </button>
                  </div>

                  <div className="space-y-2">
                    {d.members.length === 0 && (
                      <p className="text-gray-600 text-xs">No members yet</p>
                    )}
                    {d.members.map(m => (
                      <div key={m.user.id} className="flex items-center gap-3 py-2 px-3 rounded-lg bg-white/[0.02]">
                        <div className="w-7 h-7 rounded-full bg-zinc-800 flex items-center justify-center text-xs text-gray-300 font-medium shrink-0">
                          {m.user.image ? (
                            <img src={m.user.image} alt="" className="w-7 h-7 rounded-full object-cover" />
                          ) : (
                            (m.user.name || m.user.email).charAt(0).toUpperCase()
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-white text-sm truncate">{m.user.name || '—'}</p>
                          <p className="text-gray-500 text-[11px] truncate">{m.user.email}</p>
                        </div>
                        <button
                          onClick={() => removeMember(m.user.id)}
                          className="text-gray-500 hover:text-red-400 text-xs transition-colors cursor-pointer shrink-0"
                        >
                          Remove
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {showForm && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
          <div className="bg-zinc-950 border border-white/[0.06] rounded-xl max-w-md w-full p-6">
            <h2 className="text-white text-lg font-semibold mb-4">
              {selectedDept ? 'Edit Department' : 'Create Department'}
            </h2>
            <div className="space-y-4">
              <div>
                <label className="block text-gray-400 text-xs font-medium mb-1">Name *</label>
                <input
                  type="text"
                  value={formName}
                  onChange={e => setFormName(e.target.value)}
                  className="w-full bg-zinc-900 border border-white/[0.06] rounded-lg px-3 py-2 text-white text-sm outline-none focus:border-blue-500/50"
                  placeholder="e.g., Testing"
                  autoFocus
                />
              </div>
              <div>
                <label className="block text-gray-400 text-xs font-medium mb-1">Description</label>
                <textarea
                  rows={2}
                  value={formDesc}
                  onChange={e => setFormDesc(e.target.value)}
                  className="w-full bg-zinc-900 border border-white/[0.06] rounded-lg px-3 py-2 text-white text-sm outline-none focus:border-blue-500/50 resize-none"
                  placeholder="What does this department do?"
                />
              </div>
              <div>
                <label className="block text-gray-400 text-xs font-medium mb-1">Color</label>
                <div className="flex flex-wrap gap-2">
                  {DEFAULT_COLORS.map(c => (
                    <button
                      key={c}
                      onClick={() => setFormColor(c)}
                      className={`w-7 h-7 rounded-full transition-transform cursor-pointer ${formColor === c ? 'ring-2 ring-white scale-110' : 'hover:scale-110'}`}
                      style={{ backgroundColor: c }}
                    />
                  ))}
                </div>
              </div>
            </div>
            <div className="flex gap-3 mt-6">
              <button
                onClick={() => setShowForm(false)}
                className="flex-1 bg-white/[0.06] text-gray-400 border border-white/[0.06] px-4 py-2.5 rounded-lg text-sm font-medium hover:bg-white/[0.1] hover:text-white transition-all cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                disabled={saving || !formName.trim()}
                className="flex-1 bg-blue-500 text-white px-4 py-2.5 rounded-lg text-sm font-medium hover:bg-blue-600 transition-all cursor-pointer disabled:opacity-40"
              >
                {saving ? 'Saving...' : selectedDept ? 'Update' : 'Create'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
