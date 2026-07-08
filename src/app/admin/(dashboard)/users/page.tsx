'use client';

import { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { ROLES, ROLE_COLORS, ROLE_LABELS, getRoleColor, getRoleLabel, isAdminRole } from '@/lib/lms/roles';
import { getAssignableRoles } from '@/lib/lms/permissions';

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
  const [myRole, setMyRole] = useState<string>(ROLES.ADMIN);

  useEffect(() => {
    fetch('/api/auth/me')
      .then((r) => r.json())
      .then((data) => {
        if (data?.role) setMyRole(data.role);
      })
      .catch(() => {});
  }, []);

  const assignableRoles = getAssignableRoles(myRole);

  const roleOptions = assignableRoles.map((r) => ({
    value: r,
    label: ROLE_LABELS[r] || r,
  }));

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
  const superAdmins = users.filter((u) => u.role === ROLES.SUPER_ADMIN).length;
  const admins = users.filter((u) => u.role === ROLES.ADMIN).length;
  const editors = users.filter((u) => u.role === ROLES.EDITOR).length;
  const nanoEditors = users.filter((u) => u.role === ROLES.NANO_EDITOR).length;
  const viewers = users.filter((u) => u.role === ROLES.VIEWER).length;
  const instructors = users.filter((u) => u.role === ROLES.INSTRUCTOR).length;
  const students = users.filter((u) => u.role === ROLES.USER).length;

  const stats = [
    { label: 'Total Users', value: total, color: 'bg-blue-500/10 text-blue-400' },
    { label: 'Super Admins', value: superAdmins, color: 'bg-red-500/10 text-red-400' },
    { label: 'Admins', value: admins, color: 'bg-blue-500/10 text-blue-400' },
    { label: 'Editors', value: editors, color: 'bg-amber-500/10 text-amber-400' },
    { label: 'Nano Editors', value: nanoEditors, color: 'bg-purple-500/10 text-purple-400' },
    { label: 'Viewers', value: viewers, color: 'bg-gray-500/10 text-gray-400' },
    { label: 'Instructors', value: instructors, color: 'bg-cyan-500/10 text-cyan-400' },
    { label: 'Students', value: students, color: 'bg-emerald-500/10 text-emerald-400' },
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
              <div className="space-y-1.5">
                <p className="text-gray-400 text-xs font-medium uppercase tracking-wider">{stat.label}</p>
                <p className={`text-xl sm:text-2xl font-bold tracking-tight ${stat.color.split(' ')[1]}`}>{stat.value}</p>
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
                          {assignableRoles.length > 0 && (
                            <button
                              onClick={() => { setEditingUserId(user.id); setConfirmRole(user.role); }}
                              className="opacity-0 group-hover:opacity-100 transition-opacity text-[10px] px-1.5 py-0.5 rounded bg-white/5 text-gray-400 hover:text-white hover:bg-white/10"
                            >
                              Change
                            </button>
                          )}
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
