'use client';

import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { ROLES, ROLE_LABELS, getRoleColor, getRoleLabel } from '@/lib/lms/roles';

interface Admin {
  id: string;
  user_id: string;
  email: string;
  name: string | null;
  role: string;
  created_at: string;
}

export default function AdminManagementPage() {
  const queryClient = useQueryClient();
  const [showAddForm, setShowAddForm] = useState(false);
  const [newEmail, setNewEmail] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [newRole, setNewRole] = useState<string>(ROLES.VIEWER);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editRole, setEditRole] = useState<string>('');
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);

  const adminRoles = [ROLES.SUPER_ADMIN, ROLES.ADMIN, ROLES.EDITOR, ROLES.NANO_EDITOR, ROLES.VIEWER];

  const { data, isLoading } = useQuery({
    queryKey: ['admin-management'],
    queryFn: async () => {
      const res = await fetch('/api/admin/admins');
      if (!res.ok) throw new Error('Failed to fetch');
      return res.json();
    },
  });

  const addMutation = useMutation({
    mutationFn: async () => {
      const res = await fetch('/api/admin/admins', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: newEmail, password: newPassword, role: newRole }),
      });
      const result = await res.json();
      if (!res.ok) throw new Error(result.error || 'Failed to add admin');
      return result;
    },
    onSuccess: (data) => {
      toast.success(data.message || 'Admin added');
      queryClient.invalidateQueries({ queryKey: ['admin-management'] });
      setShowAddForm(false);
      setNewEmail('');
      setNewPassword('');
      setNewRole(ROLES.VIEWER);
    },
    onError: (error: Error) => {
      toast.error(error.message);
    },
  });

  const roleMutation = useMutation({
    mutationFn: async ({ id, role }: { id: string; role: string }) => {
      const res = await fetch(`/api/admin/admins/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ role }),
      });
      const result = await res.json();
      if (!res.ok) throw new Error(result.error || 'Failed to update role');
      return result;
    },
    onSuccess: () => {
      toast.success('Role updated');
      queryClient.invalidateQueries({ queryKey: ['admin-management'] });
      setEditingId(null);
    },
    onError: (error: Error) => {
      toast.error(error.message);
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const res = await fetch(`/api/admin/admins/${id}`, { method: 'DELETE' });
      const result = await res.json();
      if (!res.ok) throw new Error(result.error || 'Failed to remove admin');
      return result;
    },
    onSuccess: () => {
      toast.success('Admin removed');
      queryClient.invalidateQueries({ queryKey: ['admin-management'] });
      setConfirmDeleteId(null);
    },
    onError: (error: Error) => {
      toast.error(error.message);
      setConfirmDeleteId(null);
    },
  });

  const admins: Admin[] = data?.admins || [];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-white">Admin Management</h1>
          <p className="text-gray-400 text-sm mt-1">Manage administrator accounts and roles</p>
        </div>
        <button
          onClick={() => setShowAddForm(!showAddForm)}
          className="flex items-center gap-2 px-4 py-2 rounded-lg bg-blue-600 text-white text-sm font-medium hover:bg-blue-500 transition-colors cursor-pointer"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.5v15m7.5-7.5h-15" />
          </svg>
          Add Admin
        </button>
      </div>

      {showAddForm && (
        <div className="bg-zinc-900/50 border border-white/[0.06] rounded-2xl p-6">
          <div className="flex items-end gap-4 flex-wrap">
            <div className="flex-1 min-w-[200px]">
              <label className="block text-xs font-medium text-gray-400 mb-1.5">Email</label>
              <input
                type="email"
                value={newEmail}
                onChange={(e) => setNewEmail(e.target.value)}
                placeholder="user@example.com"
                className="w-full bg-zinc-800 border border-white/[0.08] rounded-lg px-3 py-2 text-sm text-white placeholder:text-gray-600 focus:outline-none focus:border-blue-500/50"
              />
            </div>
            <div className="w-40">
              <label className="block text-xs font-medium text-gray-400 mb-1.5">Role</label>
              <select
                value={newRole}
                onChange={(e) => setNewRole(e.target.value)}
                className="w-full bg-zinc-800 border border-white/[0.08] rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-blue-500/50"
              >
                {adminRoles.map((r) => (
                  <option key={r} value={r}>{ROLE_LABELS[r]}</option>
                ))}
              </select>
            </div>
            <div className="w-40">
              <label className="block text-xs font-medium text-gray-400 mb-1.5">Password</label>
              <input
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="Min 6 chars"
                className="w-full bg-zinc-800 border border-white/[0.08] rounded-lg px-3 py-2 text-sm text-white placeholder:text-gray-600 focus:outline-none focus:border-blue-500/50"
              />
            </div>
            <button
              onClick={() => addMutation.mutate()}
              disabled={!newEmail || addMutation.isPending}
              className="px-4 py-2 rounded-lg bg-emerald-600 text-white text-sm font-medium hover:bg-emerald-500 transition-colors disabled:opacity-50 cursor-pointer"
            >
              {addMutation.isPending ? 'Adding...' : 'Add'}
            </button>
            <button
              onClick={() => { setShowAddForm(false); setNewEmail(''); setNewPassword(''); }}
              className="px-4 py-2 rounded-lg bg-zinc-700 text-white text-sm font-medium hover:bg-zinc-600 transition-colors cursor-pointer"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      <div className="bg-zinc-900/50 border border-white/[0.06] rounded-2xl overflow-hidden">
        {isLoading ? (
          <div className="flex items-center justify-center h-64">
            <div className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
          </div>
        ) : admins.length === 0 ? (
          <div className="text-center py-16">
            <p className="text-gray-500">No admin users found.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-white/[0.06]">
                  <th className="text-left text-gray-400 text-xs font-medium uppercase tracking-wider px-6 py-4">Admin</th>
                  <th className="text-left text-gray-400 text-xs font-medium uppercase tracking-wider px-6 py-4">Email</th>
                  <th className="text-left text-gray-400 text-xs font-medium uppercase tracking-wider px-6 py-4">Role</th>
                  <th className="text-left text-gray-400 text-xs font-medium uppercase tracking-wider px-6 py-4">Added</th>
                  <th className="text-right text-gray-400 text-xs font-medium uppercase tracking-wider px-6 py-4">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/[0.06]">
                {admins.map((admin) => (
                  <tr key={admin.id} className="hover:bg-white/[0.02] transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white text-xs font-semibold shrink-0 uppercase">
                          {(admin.name || admin.email).charAt(0)}
                        </div>
                        <span className="text-white text-sm font-medium">{admin.name || admin.email.split('@')[0]}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-gray-400 text-sm">{admin.email}</td>
                    <td className="px-6 py-4">
                      {editingId === admin.id ? (
                        <div className="flex items-center gap-2">
                          <select
                            value={editRole}
                            onChange={(e) => setEditRole(e.target.value)}
                            className="bg-zinc-800 border border-white/[0.08] rounded-lg px-2 py-1 text-xs text-white focus:outline-none focus:border-blue-500/50"
                          >
                            {adminRoles.map((r) => (
                              <option key={r} value={r}>{ROLE_LABELS[r]}</option>
                            ))}
                          </select>
                          <button
                            onClick={() => roleMutation.mutate({ id: admin.id, role: editRole })}
                            disabled={roleMutation.isPending}
                            className="text-[10px] px-2 py-1 rounded bg-emerald-500/20 text-emerald-400 hover:bg-emerald-500/30 transition-colors disabled:opacity-50 cursor-pointer"
                          >
                            {roleMutation.isPending ? '...' : 'Save'}
                          </button>
                          <button
                            onClick={() => setEditingId(null)}
                            className="text-[10px] px-2 py-1 rounded bg-red-500/20 text-red-400 hover:bg-red-500/30 transition-colors cursor-pointer"
                          >
                            Cancel
                          </button>
                        </div>
                      ) : (
                        <div className="flex items-center gap-2 group">
                          <span className={`inline-flex px-3 py-1 rounded-full text-xs font-medium border ${getRoleColor(admin.role)}`}>
                            {getRoleLabel(admin.role)}
                          </span>
                          <button
                            onClick={() => { setEditingId(admin.id); setEditRole(admin.role); }}
                            className="opacity-0 group-hover:opacity-100 transition-opacity text-[10px] px-1.5 py-0.5 rounded bg-white/5 text-gray-400 hover:text-white hover:bg-white/10 cursor-pointer"
                          >
                            Change
                          </button>
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4 text-gray-400 text-sm">
                      {new Date(admin.created_at).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })}
                    </td>
                    <td className="px-6 py-4 text-right">
                      {confirmDeleteId === admin.id ? (
                        <div className="flex items-center justify-end gap-2">
                          <span className="text-xs text-gray-400">Remove?</span>
                          <button
                            onClick={() => deleteMutation.mutate(admin.id)}
                            disabled={deleteMutation.isPending}
                            className="text-[10px] px-2 py-1 rounded bg-red-500/20 text-red-400 hover:bg-red-500/30 transition-colors disabled:opacity-50 cursor-pointer"
                          >
                            {deleteMutation.isPending ? '...' : 'Yes'}
                          </button>
                          <button
                            onClick={() => setConfirmDeleteId(null)}
                            className="text-[10px] px-2 py-1 rounded bg-white/5 text-gray-400 hover:text-white transition-colors cursor-pointer"
                          >
                            No
                          </button>
                        </div>
                      ) : (
                        <button
                          onClick={() => setConfirmDeleteId(admin.id)}
                          className="opacity-0 group-hover:opacity-100 transition-opacity text-[10px] px-2 py-1 rounded bg-red-500/20 text-red-400 hover:bg-red-500/30 cursor-pointer"
                        >
                          Remove
                        </button>
                      )}
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
