'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import ProjectSidebar from '@/components/projects/ProjectSidebar';
import ProjectHeader from '@/components/projects/ProjectHeader';
import toast from 'react-hot-toast';

interface Ticket {
  id: string;
  key: string;
  title: string;
  type: string;
  priority: string;
  status: string;
  storyPoints: number | null;
  order: number;
  assignee: { id: string; name: string | null; email: string } | null;
  sprint: { id: string; name: string } | null;
}

const TYPE_COLORS: Record<string, string> = {
  STORY: 'bg-green-500/10 text-green-400',
  TASK: 'bg-blue-500/10 text-blue-400',
  BUG: 'bg-red-500/10 text-red-400',
  EPIC: 'bg-purple-500/10 text-purple-400',
  SUB_TASK: 'bg-gray-500/10 text-gray-400',
};

const PRIORITY_COLORS: Record<string, string> = {
  LOWEST: 'bg-gray-500/10 text-gray-400',
  LOW: 'bg-blue-500/10 text-blue-400',
  MEDIUM: 'bg-yellow-500/10 text-yellow-400',
  HIGH: 'bg-orange-500/10 text-orange-400',
  HIGHEST: 'bg-red-500/10 text-red-400',
};

const STATUSES = ['TODO', 'IN_PROGRESS', 'IN_REVIEW', 'DONE'];

export default function BacklogPage({ params }: { params: Promise<{ projectId: string }> }) {
  const [projectId, setProjectId] = useState('');
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [loading, setLoading] = useState(true);
  const [project, setProject] = useState<{ id: string; name: string; key: string } | null>(null);
  const [selectedTicket, setSelectedTicket] = useState<string | null>(null);
  const [filter, setFilter] = useState('');
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [members, setMembers] = useState<Array<{ id: string; name: string | null; email: string }>>([]);
  const [bulkStatus, setBulkStatus] = useState('');
  const [bulkAssignee, setBulkAssignee] = useState('');
  const [bulkLoading, setBulkLoading] = useState(false);
  const [currentUserRole, setCurrentUserRole] = useState<string | null>(null);

  const canManageSprints = currentUserRole === 'PROJECT_OWNER' || currentUserRole === 'PROJECT_MANAGER';

  useEffect(() => {
    params.then(p => setProjectId(p.projectId));
  }, [params]);

  useEffect(() => {
    if (!projectId) return;
    let cancelled = false;
    const run = async () => {
      try {
        const [pData, tData, mData, me] = await Promise.all([
          fetch(`/api/projects/${projectId}`, { credentials: 'include' }).then(r => r.json()),
          fetch(`/api/projects/${projectId}/tickets`, { credentials: 'include' }).then(r => r.json()),
          fetch(`/api/projects/${projectId}/members`, { credentials: 'include' }).then(r => r.json()),
          fetch(`/api/auth/me`, { credentials: 'include' }).then(r => r.json()),
        ]);
        if (cancelled) return;
        setProject(pData.data);
        const backlog = (tData.data || []).filter((t: Ticket) => !t.sprint);
        setTickets(backlog);
        const memberList = (mData.data || []).map((m: any) => ({ id: m.user?.id || m.userId, name: m.user?.name || m.name, email: m.user?.email || m.email, role: m.role }));
        setMembers(memberList);
        setCurrentUserRole(
          me?.id === pData.data?.owner?.id
            ? 'PROJECT_OWNER'
            : (memberList.find((m: any) => m.id === me?.id)?.role ?? null)
        );
      } catch {} finally {
        if (!cancelled) setLoading(false);
      }
    };
    void run();
    const interval = setInterval(run, 10000);
    const onFocus = () => void run();
    window.addEventListener('focus', onFocus);
    return () => {
      cancelled = true;
      clearInterval(interval);
      window.removeEventListener('focus', onFocus);
    };
  }, [projectId]);

  const filteredTickets = tickets.filter(t =>
    !filter || t.title.toLowerCase().includes(filter.toLowerCase()) || t.key.toLowerCase().includes(filter.toLowerCase())
  );

  const handleToggleSelect = (id: string) => {
    setSelectedIds(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const handleBulkUpdate = async () => {
    if (selectedIds.size === 0) return;
    const updates: Record<string, any> = {};
    if (bulkStatus) updates.status = bulkStatus;
    if (bulkAssignee) updates.assigneeId = bulkAssignee === '__unassigned' ? null : bulkAssignee;
    if (Object.keys(updates).length === 0) return;

    setBulkLoading(true);
    try {
      const res = await fetch(`/api/projects/${projectId}/tickets/bulk`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ ticketIds: Array.from(selectedIds), updates }),
      });
      if (res.ok) {
        toast.success(`Updated ${selectedIds.size} ticket${selectedIds.size > 1 ? 's' : ''}`);
        setSelectedIds(new Set());
        setBulkStatus('');
        setBulkAssignee('');
        window.location.reload();
      } else {
        toast.error('Bulk update failed');
      }
    } catch {
      toast.error('Bulk update failed');
    } finally {
      setBulkLoading(false);
    }
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

  if (!project) {
    return (
      <div className="flex min-h-screen bg-zinc-950">
        <ProjectSidebar />
        <div className="flex-1 lg:ml-64 flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-xl font-bold text-white mb-2">Project not found</h1>
            <p className="text-gray-400 text-sm mb-4">This project may have been deleted or you may not have access.</p>
            <Link href="/projects" className="text-blue-400 hover:text-blue-300 text-sm">Go back to projects</Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-zinc-950">
      <ProjectSidebar project={project || undefined} />
      <div className="flex-1 lg:ml-64">
        <ProjectHeader projectName={project?.name} projectKey={project?.key} projectId={projectId} />
        <main className="p-4 sm:p-6 lg:p-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-xl font-bold text-white">Backlog</h1>
              <p className="text-gray-500 text-sm mt-1">{filteredTickets.length} tickets not assigned to any sprint</p>
            </div>
            <div className="flex items-center gap-3">
              {canManageSprints && (selectedIds.size > 0 ? (
                <button
                  onClick={() => setSelectedIds(new Set())}
                  className="text-xs text-blue-400 hover:text-blue-300 cursor-pointer"
                >
                  Clear ({selectedIds.size})
                </button>
              ) : (
                <button
                  onClick={() => setSelectedIds(new Set(filteredTickets.map(t => t.id)))}
                  className="text-xs text-gray-500 hover:text-gray-300 cursor-pointer"
                >
                  Select all
                </button>
              ))}
              <input
                type="text"
                value={filter}
                onChange={e => setFilter(e.target.value)}
                placeholder="Filter tickets..."
                className="bg-zinc-800 border border-white/[0.06] rounded-lg px-3 py-2 text-white text-sm outline-none w-64"
              />
            </div>
          </div>

          <div className="bg-zinc-900 border border-white/[0.06] rounded-xl overflow-hidden">
            <div className="grid grid-cols-[32px_80px_1fr_100px_100px_100px_80px] gap-2 px-4 py-2.5 border-b border-white/[0.06] text-[11px] text-gray-500 uppercase tracking-wider items-center">
              <div
                onClick={canManageSprints ? () => {
                  if (selectedIds.size === filteredTickets.length) setSelectedIds(new Set());
                  else setSelectedIds(new Set(filteredTickets.map(t => t.id)));
                } : undefined}
                className={`w-4 h-4 rounded border flex items-center justify-center ${
                  canManageSprints ? 'cursor-pointer' : 'cursor-default opacity-40'
                } ${
                  selectedIds.size === filteredTickets.length && filteredTickets.length > 0
                    ? 'bg-blue-600 border-blue-500'
                    : 'border-white/20 bg-zinc-800'
                }`}
              >
                {selectedIds.size === filteredTickets.length && filteredTickets.length > 0 && (
                  <svg className="w-2.5 h-2.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                )}
              </div>
              <span>Key</span>
              <span>Title</span>
              <span>Type</span>
              <span>Priority</span>
              <span>Assignee</span>
              <span className="text-right">Points</span>
            </div>
            {filteredTickets.length === 0 ? (
              <div className="py-12 text-center text-gray-600 text-sm">No tickets in backlog</div>
            ) : (
              filteredTickets.map(ticket => (
                <div
                  key={ticket.id}
                  className={`grid grid-cols-[32px_80px_1fr_100px_100px_100px_80px] gap-2 px-4 py-3 border-b border-white/[0.03] hover:bg-white/[0.02] transition-colors items-center cursor-pointer ${
                    selectedIds.has(ticket.id) ? 'bg-blue-500/[0.04]' : ''
                  }`}
                  onClick={() => setSelectedTicket(ticket.id)}
                >
                  <div
                    onClick={canManageSprints ? (e) => { e.stopPropagation(); handleToggleSelect(ticket.id); } : undefined}
                    className={`w-4 h-4 rounded border flex items-center justify-center ${
                      canManageSprints ? 'cursor-pointer' : 'cursor-default opacity-40'
                    } ${
                      selectedIds.has(ticket.id)
                        ? 'bg-blue-600 border-blue-500'
                        : 'border-white/20 bg-zinc-800'
                    }`}
                  >
                    {selectedIds.has(ticket.id) && (
                      <svg className="w-2.5 h-2.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                      </svg>
                    )}
                  </div>
                  <span className="text-xs font-mono text-gray-500">{ticket.key}</span>
                  <span className="text-sm text-white truncate">{ticket.title}</span>
                  <span className={`text-[10px] px-2 py-0.5 rounded w-fit ${TYPE_COLORS[ticket.type] || ''}`}>{ticket.type.replace('_', ' ')}</span>
                  <span className={`text-[10px] px-2 py-0.5 rounded w-fit ${PRIORITY_COLORS[ticket.priority] || ''}`}>{ticket.priority}</span>
                  <span className="text-xs text-gray-400 truncate">{ticket.assignee?.name || 'Unassigned'}</span>
                  <span className="text-xs text-gray-500 text-right">{ticket.storyPoints ?? '-'}</span>
                </div>
              ))
            )}
          </div>
        </main>
      </div>

      {selectedTicket && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-zinc-900 border border-white/[0.06] rounded-xl p-6 max-w-lg w-full">
            <h3 className="text-white font-medium mb-2">Ticket Detail</h3>
            <p className="text-gray-400 text-sm mb-4">Open the Board view to see full ticket details with drag-and-drop.</p>
            <Link
              href={`/projects/${projectId}/board`}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm inline-block"
            >
              Go to Board
            </Link>
            <button
              onClick={() => setSelectedTicket(null)}
              className="ml-3 text-gray-400 hover:text-white text-sm cursor-pointer"
            >
              Close
            </button>
          </div>
        </div>
      )}

      {selectedIds.size > 0 && canManageSprints && (
        <div className="fixed bottom-0 left-0 right-0 bg-zinc-900 border-t border-white/[0.06] px-6 py-3 z-50 flex items-center gap-4 shadow-[0_-4px_20px_rgba(0,0,0,0.4)]">
          <span className="text-sm text-white font-medium">{selectedIds.size} selected</span>

          <select
            value={bulkStatus}
            onChange={e => setBulkStatus(e.target.value)}
            className="bg-zinc-800 border border-white/[0.06] rounded-lg px-3 py-1.5 text-gray-300 text-xs focus:outline-none focus:border-blue-500/50 cursor-pointer"
          >
            <option value="">Change status...</option>
            {STATUSES.map(s => (
              <option key={s} value={s}>{s.replace('_', ' ')}</option>
            ))}
          </select>

          <select
            value={bulkAssignee}
            onChange={e => setBulkAssignee(e.target.value)}
            className="bg-zinc-800 border border-white/[0.06] rounded-lg px-3 py-1.5 text-gray-300 text-xs focus:outline-none focus:border-blue-500/50 cursor-pointer"
          >
            <option value="">Change assignee...</option>
            <option value="__unassigned">Unassigned</option>
            {members.map(m => (
              <option key={m.id} value={m.id}>{m.name || m.email}</option>
            ))}
          </select>

          <button
            onClick={handleBulkUpdate}
            disabled={bulkLoading || (!bulkStatus && !bulkAssignee)}
            className="bg-blue-600 hover:bg-blue-500 disabled:opacity-40 disabled:cursor-not-allowed text-white text-xs font-medium px-4 py-1.5 rounded-lg transition-colors cursor-pointer"
          >
            {bulkLoading ? 'Updating...' : 'Apply'}
          </button>

          <button
            onClick={() => { setSelectedIds(new Set()); setBulkStatus(''); setBulkAssignee(''); }}
            className="text-gray-500 hover:text-white text-xs cursor-pointer ml-1"
          >
            Cancel
          </button>
        </div>
      )}
    </div>
  );
}
