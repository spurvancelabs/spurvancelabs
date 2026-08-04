'use client';

import { useState, useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import Link from 'next/link';

interface Project {
  id: string;
  name: string;
  key: string;
  description: string | null;
  status: string;
  color: string | null;
  createdAt: string;
  owner: { id: string; name: string | null; email: string; image: string | null };
  _count: { members: number; tickets: number; sprints: number };
}

const STATUS_BADGES: Record<string, string> = {
  ACTIVE: 'text-green-400 border-green-500/20 bg-green-500/10',
  ON_HOLD: 'text-yellow-400 border-yellow-500/20 bg-yellow-500/10',
  COMPLETED: 'text-blue-400 border-blue-500/20 bg-blue-500/10',
  ARCHIVED: 'text-gray-400 border-gray-500/20 bg-gray-500/10',
};

const STATUSES = ['ACTIVE', 'ON_HOLD', 'COMPLETED', 'ARCHIVED'];

export default function AdminProjectsPage() {
  const [query, setQuery] = useState('');
  const [status, setStatus] = useState('ALL');

  const { data, isLoading } = useQuery({
    queryKey: ['admin-projects'],
    queryFn: async () => {
      const res = await fetch('/api/admin/projects');
      if (!res.ok) throw new Error('Failed to fetch projects');
      return res.json();
    },
  });

  const projects: Project[] = data?.projects || [];

  const filtered = useMemo(() => {
    return projects.filter((p) => {
      const matchesQuery =
        !query ||
        p.name.toLowerCase().includes(query.toLowerCase()) ||
        p.key.toLowerCase().includes(query.toLowerCase()) ||
        (p.owner?.name || '').toLowerCase().includes(query.toLowerCase()) ||
        (p.owner?.email || '').toLowerCase().includes(query.toLowerCase());
      const matchesStatus = status === 'ALL' || p.status === status;
      return matchesQuery && matchesStatus;
    });
  }, [projects, query, status]);

  const totalTickets = projects.reduce((s, p) => s + p._count.tickets, 0);
  const activeCount = projects.filter((p) => p.status === 'ACTIVE').length;

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-white">Projects</h1>
          <p className="text-gray-400 text-sm mt-1">All projects across the platform</p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {[
          { label: 'Total Projects', value: projects.length, color: 'text-white' },
          { label: 'Active Projects', value: activeCount, color: 'text-emerald-400' },
          { label: 'Total Tickets', value: totalTickets, color: 'text-blue-400' },
          { label: 'Total Members', value: projects.reduce((s, p) => s + p._count.members, 0), color: 'text-violet-400' },
        ].map((card) => (
          <div key={card.label} className="rounded-xl bg-zinc-900 border border-white/[0.06] p-5">
            <p className="text-sm text-gray-400 mb-1">{card.label}</p>
            <p className={`text-3xl font-bold ${card.color}`}>
              {isLoading ? (
                <span className="inline-block w-8 h-8 rounded bg-zinc-800 animate-pulse" />
              ) : (
                card.value.toLocaleString()
              )}
            </p>
          </div>
        ))}
      </div>

      <div className="rounded-xl bg-zinc-900 border border-white/[0.06] overflow-hidden">
        <div className="p-4 border-b border-white/[0.06] flex flex-col sm:flex-row gap-3 sm:items-center">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search by name, key, or owner..."
            className="bg-zinc-800 border border-white/[0.06] rounded-lg px-3 py-2 text-white text-sm outline-none focus:border-blue-500/50 flex-1 min-w-0"
          />
          <div className="flex gap-1 bg-white/[0.04] rounded-md p-0.5 self-start">
            {['ALL', ...STATUSES].map((s) => (
              <button
                key={s}
                onClick={() => setStatus(s)}
                className={`text-[10px] px-3 py-1 rounded-md transition-colors whitespace-nowrap cursor-pointer ${
                  status === s ? 'bg-zinc-700 text-white' : 'text-gray-500 hover:text-gray-300'
                }`}
              >
                {s === 'ALL' ? 'All' : s.replace('_', ' ')}
              </button>
            ))}
          </div>
        </div>

        {isLoading ? (
          <div className="p-6 space-y-3">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="h-14 bg-zinc-800/50 rounded-lg animate-pulse" />
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-16">
            <p className="text-gray-500">No projects found</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="text-[11px] text-gray-500 uppercase tracking-wider border-b border-white/[0.06]">
                  <th className="px-5 py-3 font-medium">Project</th>
                  <th className="px-5 py-3 font-medium">Owner</th>
                  <th className="px-5 py-3 font-medium">Status</th>
                  <th className="px-5 py-3 font-medium text-center">Members</th>
                  <th className="px-5 py-3 font-medium text-center">Tickets</th>
                  <th className="px-5 py-3 font-medium text-center">Sprints</th>
                  <th className="px-5 py-3 font-medium">Created</th>
                  <th className="px-5 py-3 font-medium text-right">Action</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((p) => (
                  <tr key={p.id} className="border-b border-white/[0.03] hover:bg-white/[0.02] transition-colors">
                    <td className="px-5 py-3">
                      <div className="flex items-center gap-3">
                        <div
                          className="w-8 h-8 rounded-lg flex items-center justify-center text-white text-xs font-bold shrink-0"
                          style={{ backgroundColor: p.color || '#6366f1' }}
                        >
                          {p.key.slice(0, 2).toUpperCase()}
                        </div>
                        <div className="min-w-0">
                          <p className="text-white text-sm font-medium truncate max-w-[240px]">{p.name}</p>
                          <p className="text-gray-500 text-[11px] font-mono">{p.key}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-5 py-3">
                      <p className="text-sm text-gray-300 truncate max-w-[180px]">{p.owner?.name || '—'}</p>
                      <p className="text-gray-500 text-[11px] truncate max-w-[180px]">{p.owner?.email}</p>
                    </td>
                    <td className="px-5 py-3">
                      <span className={`text-[10px] px-2 py-0.5 rounded-full border whitespace-nowrap ${STATUS_BADGES[p.status] || STATUS_BADGES.ACTIVE}`}>
                        {p.status.replace('_', ' ')}
                      </span>
                    </td>
                    <td className="px-5 py-3 text-center text-sm text-gray-300">{p._count.members}</td>
                    <td className="px-5 py-3 text-center text-sm text-gray-300">{p._count.tickets}</td>
                    <td className="px-5 py-3 text-center text-sm text-gray-300">{p._count.sprints}</td>
                    <td className="px-5 py-3 text-sm text-gray-400 whitespace-nowrap">
                      {new Date(p.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })}
                    </td>
                    <td className="px-5 py-3 text-right">
                      <Link
                        href={`/projects/${p.id}/board`}
                        className="text-blue-400 hover:text-blue-300 text-sm inline-flex items-center gap-1"
                      >
                        Open
                        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.5 6H5.25A2.25 2.25 0 003 8.25v10.5A2.25 2.25 0 005.25 21h10.5A2.25 2.25 0 0018 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25" />
                        </svg>
                      </Link>
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
