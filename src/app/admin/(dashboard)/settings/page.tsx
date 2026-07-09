'use client';

import { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import { useMutation } from '@tanstack/react-query';
import { ROLE_LABELS, getRoleColor } from '@/lib/lms/roles';

export default function SettingsPage() {
  const [profile, setProfile] = useState({ name: '', email: '', role: '' });
  const [name, setName] = useState('');
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  useEffect(() => {
    fetch('/api/admin/settings')
      .then((r) => r.json())
      .then((data) => {
        if (data?.email) {
          setProfile(data);
          setName(data.name || '');
        }
      })
      .catch(() => {});
  }, []);

  const profileMutation = useMutation({
    mutationFn: async () => {
      const res = await fetch('/api/admin/settings', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to update');
      return data;
    },
    onSuccess: () => {
      toast.success('Name updated');
      setProfile((p) => ({ ...p, name }));
    },
    onError: (error: Error) => toast.error(error.message),
  });

  const passwordMutation = useMutation({
    mutationFn: async () => {
      if (newPassword !== confirmPassword) throw new Error('Passwords do not match');
      if (newPassword.length < 6) throw new Error('Password must be at least 6 characters');

      const res = await fetch('/api/admin/settings', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ currentPassword, newPassword }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to update password');
      return data;
    },
    onSuccess: () => {
      toast.success('Password updated');
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
    },
    onError: (error: Error) => toast.error(error.message),
  });

  return (
    <div className="space-y-6 max-w-2xl">
      <div>
        <h1 className="text-xl sm:text-2xl font-bold text-white">Settings</h1>
        <p className="text-gray-400 text-sm mt-1">Manage your account settings</p>
      </div>

      <div className="bg-zinc-900/50 border border-white/[0.06] rounded-2xl p-6 space-y-4">
        <h2 className="text-white text-sm font-semibold">Profile</h2>

        <div className="space-y-1.5">
          <label className="text-xs font-medium text-gray-400">Email</label>
          <input
            type="email"
            value={profile.email}
            disabled
            className="w-full bg-zinc-800/50 border border-white/[0.06] rounded-lg px-3 py-2 text-sm text-gray-500 cursor-not-allowed"
          />
        </div>

        <div className="space-y-1.5">
          <label className="text-xs font-medium text-gray-400">Role</label>
          <div>
            {profile.role && (
              <span className={`inline-flex px-3 py-1 rounded-full text-xs font-medium border ${getRoleColor(profile.role)}`}>
                {ROLE_LABELS[profile.role] || profile.role}
              </span>
            )}
          </div>
        </div>

        <div className="space-y-1.5">
          <label className="text-xs font-medium text-gray-400">Name</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full bg-zinc-800 border border-white/[0.08] rounded-lg px-3 py-2 text-sm text-white placeholder:text-gray-600 focus:outline-none focus:border-blue-500/50"
          />
        </div>

        <button
          onClick={() => profileMutation.mutate()}
          disabled={!name || profileMutation.isPending || name === profile.name}
          className="px-4 py-2 rounded-lg bg-blue-600 text-white text-sm font-medium hover:bg-blue-500 transition-colors disabled:opacity-50 cursor-pointer"
        >
          {profileMutation.isPending ? 'Saving...' : 'Save'}
        </button>
      </div>

      <div className="bg-zinc-900/50 border border-white/[0.06] rounded-2xl p-6 space-y-4">
        <h2 className="text-white text-sm font-semibold">Change Password</h2>

        <div className="space-y-1.5">
          <label className="text-xs font-medium text-gray-400">Current Password</label>
          <input
            type="password"
            value={currentPassword}
            onChange={(e) => setCurrentPassword(e.target.value)}
            className="w-full bg-zinc-800 border border-white/[0.08] rounded-lg px-3 py-2 text-sm text-white placeholder:text-gray-600 focus:outline-none focus:border-blue-500/50"
          />
        </div>

        <div className="space-y-1.5">
          <label className="text-xs font-medium text-gray-400">New Password</label>
          <input
            type="password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            className="w-full bg-zinc-800 border border-white/[0.08] rounded-lg px-3 py-2 text-sm text-white placeholder:text-gray-600 focus:outline-none focus:border-blue-500/50"
          />
        </div>

        <div className="space-y-1.5">
          <label className="text-xs font-medium text-gray-400">Confirm New Password</label>
          <input
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            className="w-full bg-zinc-800 border border-white/[0.08] rounded-lg px-3 py-2 text-sm text-white placeholder:text-gray-600 focus:outline-none focus:border-blue-500/50"
          />
        </div>

        <button
          onClick={() => passwordMutation.mutate()}
          disabled={!currentPassword || !newPassword || !confirmPassword || passwordMutation.isPending}
          className="px-4 py-2 rounded-lg bg-blue-600 text-white text-sm font-medium hover:bg-blue-500 transition-colors disabled:opacity-50 cursor-pointer"
        >
          {passwordMutation.isPending ? 'Updating...' : 'Update Password'}
        </button>
      </div>
    </div>
  );
}
