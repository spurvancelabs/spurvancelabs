'use client';

import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { ROLES, ROLE_COLORS, ROLE_LABELS, getRoleColor, getRoleLabel, type Role } from '@/lib/lms/roles';

const roleOptions: { value: Role; label: string }[] = [
  { value: ROLES.USER, label: ROLE_LABELS.USER },
  { value: ROLES.INSTRUCTOR, label: ROLE_LABELS.INSTRUCTOR },
  { value: ROLES.ADMIN, label: ROLE_LABELS.ADMIN },
];

interface User {
  id: string;
  email: string;
  name: string | null;
  role: string;
  created_at: string | null;
}

export default function AdminUsersPage() {
  const queryClient = useQueryClient();
  const [editingUserId, setEditingUserId] = useState<string | null>(null);
  const [confirmUserId, setConfirmUserId] = useState<string | null>(null);
  const [confirmRole, setConfirmRole] = useState<string | null>(null);

  const { data, isLoading } = useQuery({
    queryKey: ['admin-users'],
    queryFn: async () => {
      const res = await fetch('/api/admin/users');
      if (!res.ok) throw new Error('Failed to fetch');
      return res.json();
    },
  });

  const roleMutation = useMutation({
    mutationFn: async ({ userId, role }: { userId: string; role: string }) => {
      const res = await fetch(`/api/admin/users/${userId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ role }),
      });
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || 'Failed to update role');
      }
      return res.json();
    },
    onSuccess: () => {
      toast.success('Role updated successfully');
      queryClient.invalidateQueries({ queryKey: ['admin-users'] });
      setEditingUserId(null);
      setConfirmUserId(null);
      setConfirmRole(null);
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to update role');
      setConfirmUserId(null);
      setConfirmRole(null);
    },
  });

  const users: User[] = data?.users || [];
  const total = users.length;
  const admins = users.filter((u) => u.role === ROLES.ADMIN).length;
  const instructors = users.filter((u) => u.role === ROLES.INSTRUCTOR).length;
  const students = users.filter((u) => u.role === ROLES.USER).length;

  const stats = [
    {
      label: 'Total Users', value: total,
      color: 'bg-blue-500/10 text-blue-400',
      icon: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16.5 18.75a6 6 0 11-9 0 6 6 0 019 0zM12 3a4.5 4.5 0 100 9 4.5 4.5 0 000-9z" /></svg>,
    },
    {
      label: 'Admins', value: admins,
      color: 'bg-blue-500/10 text-blue-400',
      icon: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.5 6h9.75M10.5 6a1.5 1.5 0 11-3 0m3 0a1.5 1.5 0 10-3 0M3.75 6H7.5m3 12h9.75m-9.75 0a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m-3.75 0H7.5m9-6h3.75m-3.75 0a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m-9.75 0h9.75" /></svg>,
    },
    {
      label: 'Instructors', value: instructors,
      color: 'bg-amber-500/10 text-amber-400',
      icon: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.26 10.147a60.438 60.438 0 0 0-.491 6.347A48.62 48.62 0 0 1 12 20.904a48.62 48.62 0 0 1 8.232-4.41 60.46 60.46 0 0 0-.491-6.347m-15.482 0a50.636 50.636 0 0 0-2.658-.813A59.906 59.906 0 0 1 12 3.493a59.903 59.903 0 0 1 10.399 5.84c-.896.248-1.783.52-2.658.814m-15.482 0A50.717 50.717 0 0 1 12 13.489a50.702 50.702 0 0 1 7.74-3.342M6.75 15a.75.75 0 1 0 0-1.5.75.75 0 0 0 0 1.5Zm0 0v-3.675A55.378 55.378 0 0 1 12 8.443m-7.007 11.55A5.981 5.981 0 0 0 6.75 15.75v-1.5" /></svg>,
    },
    {
      label: 'Students', value: students,
      color: 'bg-emerald-500/10 text-emerald-400',
      icon: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z" /></svg>,
    },
  ];

  const handleRoleChange = (userId: string, newRole: string) => {
    setConfirmUserId(userId);
    setConfirmRole(newRole);
  };

  const confirmChange = () => {
    const targetId = confirmUserId || editingUserId;
    if (targetId && confirmRole) {
      roleMutation.mutate({ userId: targetId, role: confirmRole });
    }
  };

  const cancelConfirm = () => {
    setConfirmUserId(null);
    setConfirmRole(null);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl sm:text-2xl font-bold text-white">Users</h1>
        <p className="text-gray-400 text-sm mt-1">Manage platform users and roles</p>
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

      <div className="bg-zinc-900/50 border border-white/[0.06] rounded-2xl overflow-hidden">
        {isLoading ? (
          <div className="flex items-center justify-center h-64">
            <div className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
          </div>
        ) : users.length === 0 ? (
          <div className="text-center py-16">
            <p className="text-gray-500">No users found.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-white/[0.06]">
                  <th className="text-left text-gray-400 text-xs font-medium uppercase tracking-wider px-6 py-4">User</th>
                  <th className="text-left text-gray-400 text-xs font-medium uppercase tracking-wider px-6 py-4">Email</th>
                  <th className="text-left text-gray-400 text-xs font-medium uppercase tracking-wider px-6 py-4">Role</th>
                  <th className="text-right text-gray-400 text-xs font-medium uppercase tracking-wider px-6 py-4">Joined</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/[0.06]">
                {users.map((user) => (
                  <tr key={user.id} className="hover:bg-white/[0.02] transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white text-xs font-semibold shrink-0 uppercase">
                          {(user.name || user.email).charAt(0)}
                        </div>
                        <span className="text-white text-sm font-medium">{user.name || user.email.split('@')[0]}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-gray-400 text-sm">{user.email}</td>
                    <td className="px-6 py-4">
                      {editingUserId === user.id ? (
                        <div className="flex items-center gap-2">
                          <select
                            value={confirmRole || user.role}
                            onChange={(e) => setConfirmRole(e.target.value)}
                            className="bg-zinc-800 border border-white/[0.08] rounded-lg px-2 py-1 text-xs text-white focus:outline-none focus:border-blue-500/50"
                          >
                            {roleOptions.map((opt) => (
                              <option key={opt.value} value={opt.value}>{opt.label}</option>
                            ))}
                          </select>
                          <button
                            onClick={confirmChange}
                            disabled={roleMutation.isPending}
                            className="text-[10px] px-2 py-1 rounded bg-emerald-500/20 text-emerald-400 hover:bg-emerald-500/30 transition-colors disabled:opacity-50"
                          >
                            {roleMutation.isPending ? '...' : 'Save'}
                          </button>
                          <button
                            onClick={() => { setEditingUserId(null); setConfirmRole(null); }}
                            className="text-[10px] px-2 py-1 rounded bg-red-500/20 text-red-400 hover:bg-red-500/30 transition-colors"
                          >
                            Cancel
                          </button>
                        </div>
                      ) : confirmUserId === user.id ? (
                        <div className="flex items-center gap-2">
                          <span className="text-xs text-gray-400">Set to</span>
                          <span className={`inline-flex px-2 py-0.5 rounded-full text-[10px] font-medium border ${getRoleColor(confirmRole!)}`}>
                            {getRoleLabel(confirmRole!)}
                          </span>
                          <span className="text-xs text-gray-500">?</span>
                          <button
                            onClick={confirmChange}
                            disabled={roleMutation.isPending}
                            className="text-[10px] px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400 hover:bg-emerald-500/30 transition-colors disabled:opacity-50"
                          >
                            {roleMutation.isPending ? '...' : 'Yes'}
                          </button>
                          <button
                            onClick={cancelConfirm}
                            className="text-[10px] px-2 py-0.5 rounded bg-red-500/20 text-red-400 hover:bg-red-500/30 transition-colors"
                          >
                            No
                          </button>
                        </div>
                      ) : (
                        <div className="flex items-center gap-2 group">
                          <span className={`inline-flex px-3 py-1 rounded-full text-xs font-medium border ${getRoleColor(user.role)}`}>
                            {getRoleLabel(user.role)}
                          </span>
                          <button
                            onClick={() => { setEditingUserId(user.id); setConfirmRole(user.role); }}
                            className="opacity-0 group-hover:opacity-100 transition-opacity text-[10px] px-1.5 py-0.5 rounded bg-white/5 text-gray-400 hover:text-white hover:bg-white/10"
                          >
                            Change
                          </button>
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4 text-gray-400 text-sm text-right">
                      {user.created_at ? new Date(user.created_at).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' }) : '-'}
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
