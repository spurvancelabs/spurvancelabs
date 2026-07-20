'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import ProjectSidebar from '@/components/projects/ProjectSidebar';
import ProjectHeader from '@/components/projects/ProjectHeader';
import type { KanbanBoardTicket } from '@/app/projects/[projectId]/board/page';
import { TICKET_STATUSES } from '@/lib/projects/types';

interface Sprint {
  id: string;
  name: string;
  goal: string | null;
  status: string;
  startDate: string | null;
  endDate: string | null;
  _count: { tickets: number };
}

interface ProjectData {
  id: string;
  name: string;
  key: string;
  description: string | null;
  status: string;
  color: string | null;
  icon: string | null;
  owner: { id: string; name: string | null; email: string; image: string | null };
  _count: { members: number; tickets: number; sprints: number };
}

interface Member {
  id: string;
  user: { id: string; name: string | null; email: string; image: string | null };
  role: string;
}

export default function SprintBoardPage({ params }: { params: Promise<{ projectId: string; sprintId: string }> }) {
  const [projectId, setProjectId] = useState('');
  const [sprintId, setSprintId] = useState('');
  const [sprint, setSprint] = useState<Sprint | null>(null);
  const [tickets, setTickets] = useState<KanbanBoardTicket[]>([]);
  const [members, setMembers] = useState<Member[]>([]);
  const [sprints, setSprints] = useState<Sprint[]>([]);
  const [project, setProject] = useState<ProjectData | null>(null);
  const [loading, setLoading] = useState(true);
  const [currentUserId, setCurrentUserId] = useState('');

  useEffect(() => {
    params.then(p => { setProjectId(p.projectId); setSprintId(p.sprintId); });
  }, [params]);

  useEffect(() => {
    if (!projectId || !sprintId) return;
    Promise.all([
      fetch(`/api/projects/${projectId}`, { credentials: 'include' }).then(r => r.json()),
      fetch(`/api/projects/${projectId}/sprints/${sprintId}`, { credentials: 'include' }).then(r => r.json()),
      fetch(`/api/projects/${projectId}/tickets?sprintId=${sprintId}`, { credentials: 'include' }).then(r => r.json()),
      fetch(`/api/projects/${projectId}/members`, { credentials: 'include' }).then(r => r.json()),
      fetch(`/api/projects/${projectId}/sprints`, { credentials: 'include' }).then(r => r.json()),
      fetch('/api/auth/me', { credentials: 'include' }).then(r => r.json()),
    ]).then(([pData, sData, tData, mData, sList, meData]) => {
      setProject(pData.data);
      setSprint(sData.data);
      setTickets((tData.data || []) as KanbanBoardTicket[]);
      setMembers(mData.data || []);
      setSprints(sList.data || []);
      setCurrentUserId(meData.userId || meData.id || '');
      setLoading(false);
    }).catch(() => setLoading(false));
  }, [projectId, sprintId]);

  const sprintTickets = tickets.filter(t => t.sprint?.id === sprintId);

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
      <div className="flex-1 lg:ml-64 flex flex-col min-h-screen">
        <ProjectHeader projectName={project?.name} projectKey={project?.key} projectId={projectId} />
        <div className="p-4 sm:p-6 border-b border-white/[0.06]">
          <div className="flex items-center gap-3 mb-2">
            <Link href={`/projects/${projectId}/sprints`} className="text-gray-500 hover:text-white text-sm">Sprints</Link>
            <span className="text-gray-600">/</span>
            <h1 className="text-lg font-bold text-white">{sprint?.name}</h1>
            <span className={`text-[10px] px-2 py-0.5 rounded-full ${
              sprint?.status === 'ACTIVE' ? 'bg-green-500/10 text-green-400' :
              sprint?.status === 'COMPLETED' ? 'bg-blue-500/10 text-blue-400' :
              'bg-yellow-500/10 text-yellow-400'
            }`}>{sprint?.status}</span>
          </div>
          {sprint?.goal && <p className="text-gray-500 text-sm">{sprint.goal}</p>}
          <div className="flex gap-4 text-xs text-gray-600 mt-2">
            <span>{sprint?._count.tickets} tickets</span>
            {sprint?.startDate && <span>Start: {new Date(sprint.startDate).toLocaleDateString()}</span>}
            {sprint?.endDate && <span>End: {new Date(sprint.endDate).toLocaleDateString()}</span>}
          </div>
        </div>
        <div className="flex-1 overflow-hidden flex flex-col">
          {project && (
            <div className="p-4 sm:p-6 flex-1 overflow-x-auto">
              <div className="flex gap-4 min-w-max h-full">
                {TICKET_STATUSES.filter(s => s !== 'CANCELLED').map(status => {
                  const colTickets = sprintTickets.filter(t => t.status === status);
                  return (
                    <div key={status} className="w-72 bg-zinc-900/50 rounded-xl p-3 flex flex-col">
                      <h3 className="text-xs font-medium text-gray-400 mb-3 flex items-center gap-2">
                        <span className={`w-2 h-2 rounded-full ${
                          status === 'DONE' ? 'bg-green-500' :
                          status === 'IN_PROGRESS' ? 'bg-yellow-500' :
                          status === 'IN_REVIEW' ? 'bg-purple-500' :
                          'bg-gray-500'
                        }`} />
                        {status.replace('_', ' ')}
                        <span className="text-gray-600 text-[10px] bg-zinc-800 px-1.5 py-0.5 rounded-full">{colTickets.length}</span>
                      </h3>
                      <div className="space-y-2 flex-1 overflow-y-auto">
                        {colTickets.map(ticket => (
                          <div key={ticket.id} className="bg-zinc-800 border border-white/[0.06] rounded-lg p-3">
                            <p className="text-[11px] font-mono text-gray-500 mb-1">{ticket.key}</p>
                            <p className="text-sm text-white mb-2">{ticket.title}</p>
                            <div className="flex items-center justify-between">
                              <span className={`text-[10px] px-1.5 py-0.5 rounded ${
                                ticket.priority === 'HIGHEST' ? 'bg-red-500/10 text-red-400' :
                                ticket.priority === 'HIGH' ? 'bg-orange-500/10 text-orange-400' :
                                ticket.priority === 'MEDIUM' ? 'bg-yellow-500/10 text-yellow-400' :
                                'bg-gray-500/10 text-gray-400'
                              }`}>{ticket.priority}</span>
                              {ticket.storyPoints && (
                                <span className="text-[10px] text-gray-500 bg-zinc-700 px-1.5 py-0.5 rounded">{ticket.storyPoints}</span>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
