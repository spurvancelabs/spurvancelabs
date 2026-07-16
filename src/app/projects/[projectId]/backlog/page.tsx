'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import ProjectSidebar from '@/components/projects/ProjectSidebar';
import ProjectHeader from '@/components/projects/ProjectHeader';

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

export default function BacklogPage({ params }: { params: Promise<{ projectId: string }> }) {
  const [projectId, setProjectId] = useState('');
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [loading, setLoading] = useState(true);
  const [project, setProject] = useState<{ id: string; name: string; key: string } | null>(null);
  const [selectedTicket, setSelectedTicket] = useState<string | null>(null);
  const [filter, setFilter] = useState('');

  useEffect(() => {
    params.then(p => setProjectId(p.projectId));
  }, [params]);

  useEffect(() => {
    if (!projectId) return;
    Promise.all([
      fetch(`/api/projects/${projectId}`, { credentials: 'include' }).then(r => r.json()),
      fetch(`/api/projects/${projectId}/tickets`, { credentials: 'include' }).then(r => r.json()),
    ]).then(([pData, tData]) => {
      setProject(pData.data);
      const backlog = (tData.data || []).filter((t: Ticket) => !t.sprint);
      setTickets(backlog);
      setLoading(false);
    }).catch(() => setLoading(false));
  }, [projectId]);

  const filteredTickets = tickets.filter(t =>
    !filter || t.title.toLowerCase().includes(filter.toLowerCase()) || t.key.toLowerCase().includes(filter.toLowerCase())
  );

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
        <main className="p-4 sm:p-6 lg:p-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-xl font-bold text-white">Backlog</h1>
              <p className="text-gray-500 text-sm mt-1">{filteredTickets.length} tickets not assigned to any sprint</p>
            </div>
            <input
              type="text"
              value={filter}
              onChange={e => setFilter(e.target.value)}
              placeholder="Filter tickets..."
              className="bg-zinc-800 border border-white/[0.06] rounded-lg px-3 py-2 text-white text-sm outline-none w-64"
            />
          </div>

          <div className="bg-zinc-900 border border-white/[0.06] rounded-xl overflow-hidden">
            <div className="grid grid-cols-[80px_1fr_100px_100px_100px_80px] gap-2 px-4 py-2.5 border-b border-white/[0.06] text-[11px] text-gray-500 uppercase tracking-wider">
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
                  className="grid grid-cols-[80px_1fr_100px_100px_100px_80px] gap-2 px-4 py-3 border-b border-white/[0.03] hover:bg-white/[0.02] transition-colors items-center cursor-pointer"
                  onClick={() => setSelectedTicket(ticket.id)}
                >
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
    </div>
  );
}
