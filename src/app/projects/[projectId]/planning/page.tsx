'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import ProjectSidebar from '@/components/projects/ProjectSidebar';
import ProjectHeader from '@/components/projects/ProjectHeader';
import { DndContext, DragOverlay, closestCenter, PointerSensor, useSensor, useSensors } from '@dnd-kit/core';
import { useDroppable } from '@dnd-kit/core';
import { useDraggable } from '@dnd-kit/core';
import toast from 'react-hot-toast';

interface Ticket {
  id: string;
  key: string;
  title: string;
  type: string;
  priority: string;
  storyPoints: number | null;
  assignee: { id: string; name: string | null; email: string } | null;
  sprintId: string | null;
  sprint: { id: string; name: string } | null;
}

interface Sprint {
  id: string;
  name: string;
  status: string;
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

function DraggableTicket({ ticket }: { ticket: Ticket }) {
  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({ id: ticket.id, data: ticket });
  const style = transform ? { transform: `translate(${transform.x}px, ${transform.y}px)` } : undefined;
  return (
    <div
      ref={setNodeRef}
      {...listeners}
      {...attributes}
      style={style}
      className={`bg-zinc-800 border border-white/[0.06] rounded-lg px-3 py-2.5 mb-2 cursor-grab active:cursor-grabbing hover:bg-zinc-750 transition-colors ${isDragging ? 'opacity-40' : ''}`}
    >
      <div className="flex items-center justify-between mb-1">
        <span className="text-[11px] font-mono text-gray-500">{ticket.key}</span>
        <div className="flex gap-1.5 items-center">
          <span className={`text-[9px] px-1.5 py-0.5 rounded ${TYPE_COLORS[ticket.type]}`}>{ticket.type.replace('_', ' ')}</span>
          <span className={`text-[9px] px-1.5 py-0.5 rounded ${PRIORITY_COLORS[ticket.priority]}`}>{ticket.priority}</span>
        </div>
      </div>
      <p className="text-xs text-white truncate">{ticket.title}</p>
      <div className="flex items-center justify-between mt-1.5">
        <span className="text-[10px] text-gray-500 truncate">{ticket.assignee?.name || 'Unassigned'}</span>
        {ticket.storyPoints != null && <span className="text-[10px] bg-white/5 text-gray-400 px-1.5 py-0.5 rounded">{ticket.storyPoints} SP</span>}
      </div>
    </div>
  );
}

function SprintZone({ sprint, tickets }: { sprint: Sprint; tickets: Ticket[] }) {
  const { setNodeRef, isOver } = useDroppable({ id: `sprint-${sprint.id}`, data: { sprintId: sprint.id } });
  const totalPoints = tickets.reduce((s, t) => s + (t.storyPoints || 0), 0);
  return (
    <div
      ref={setNodeRef}
      className={`border rounded-xl p-4 transition-all ${
        isOver ? 'border-blue-500 bg-blue-500/5 ring-1 ring-blue-500/30' : 'border-white/[0.06] bg-zinc-900/50'
      }`}
    >
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <span className="text-sm font-semibold text-white">{sprint.name}</span>
          <span className={`text-[10px] px-2 py-0.5 rounded ${
            sprint.status === 'ACTIVE' ? 'bg-green-500/10 text-green-400' :
            sprint.status === 'PLANNING' ? 'bg-blue-500/10 text-blue-400' :
            'bg-gray-500/10 text-gray-400'
          }`}>{sprint.status}</span>
        </div>
        <span className="text-[11px] text-gray-500">{tickets.length} tickets · {totalPoints} pts</span>
      </div>
      <div className="min-h-[60px] space-y-0">
        {tickets.length === 0 && (
          <div className="text-center py-6 text-gray-600 text-[11px] border border-dashed border-white/[0.06] rounded-lg">
            Drop tickets here
          </div>
        )}
        {tickets.map(t => <DraggableTicket key={t.id} ticket={t} />)}
      </div>
    </div>
  );
}

export default function SprintPlanningPage({ params }: { params: Promise<{ projectId: string }> }) {
  const [projectId, setProjectId] = useState('');
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [sprints, setSprints] = useState<Sprint[]>([]);
  const [loading, setLoading] = useState(true);
  const [project, setProject] = useState<{ id: string; name: string; key: string } | null>(null);
  const [activeTicket, setActiveTicket] = useState<Ticket | null>(null);
  const [filter, setFilter] = useState('');

  const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 5 } }));

  useEffect(() => { params.then(p => setProjectId(p.projectId)); }, [params]);

  useEffect(() => {
    if (!projectId) return;
    Promise.all([
      fetch(`/api/projects/${projectId}`, { credentials: 'include' }).then(r => r.json()),
      fetch(`/api/projects/${projectId}/tickets`, { credentials: 'include' }).then(r => r.json()),
      fetch(`/api/projects/${projectId}/sprints`, { credentials: 'include' }).then(r => r.json()),
    ]).then(([pData, tData, sData]) => {
      setProject(pData.data);
      setTickets(tData.data || []);
      setSprints((sData.data || []).filter((s: Sprint) => s.status !== 'COMPLETED'));
      setLoading(false);
    }).catch(() => setLoading(false));
  }, [projectId]);

  const refresh = () => {
    Promise.all([
      fetch(`/api/projects/${projectId}/tickets`, { credentials: 'include' }).then(r => r.json()),
      fetch(`/api/projects/${projectId}/sprints`, { credentials: 'include' }).then(r => r.json()),
    ]).then(([tData, sData]) => {
      setTickets(tData.data || []);
      setSprints((sData.data || []).filter((s: Sprint) => s.status !== 'COMPLETED'));
    });
  };

  const backlogTickets = tickets.filter(t => !t.sprintId && (!filter || t.title.toLowerCase().includes(filter.toLowerCase()) || t.key.toLowerCase().includes(filter.toLowerCase())));
  const sprintsMap = Object.fromEntries(sprints.map(s => [s.id, s]));

  const handleDragStart = (e: any) => setActiveTicket(e.active.data.current);
  const handleDragEnd = async (e: any) => {
    setActiveTicket(null);
    const { active, over } = e;
    if (!over) return;
    const sprintId = over.data.current?.sprintId;
    const ticketId = active.id;
    const ticket = tickets.find(t => t.id === ticketId);
    if (!ticket || ticket.sprintId === sprintId) return;
    try {
      await fetch(`/api/projects/${projectId}/tickets/${ticketId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ sprintId }),
      });
      setTickets(prev => prev.map(t => t.id === ticketId ? { ...t, sprintId, sprint: { id: sprintId, name: sprintsMap[sprintId]?.name || '' } } : t));
      toast.success(`Moved to ${sprintsMap[sprintId]?.name || 'sprint'}`);
    } catch { toast.error('Failed to move ticket'); }
  };

  const handleRemoveFromSprint = async (ticketId: string) => {
    try {
      await fetch(`/api/projects/${projectId}/tickets/${ticketId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ sprintId: null }),
      });
      setTickets(prev => prev.map(t => t.id === ticketId ? { ...t, sprintId: null, sprint: null } : t));
      toast.success('Moved to backlog');
    } catch { toast.error('Failed to move ticket'); }
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
              <h1 className="text-xl font-bold text-white">Sprint Planning</h1>
              <p className="text-gray-500 text-sm mt-1">Drag tickets from the backlog into sprints</p>
            </div>
            <input
              type="text"
              value={filter}
              onChange={e => setFilter(e.target.value)}
              placeholder="Search backlog..."
              className="bg-zinc-800 border border-white/[0.06] rounded-lg px-3 py-2 text-white text-sm outline-none w-56"
            />
          </div>

          <DndContext sensors={sensors} collisionDetection={closestCenter} onDragStart={handleDragStart} onDragEnd={handleDragEnd}>
            <div className="grid grid-cols-1 xl:grid-cols-[400px_1fr] gap-6">
              <div className="bg-zinc-900 border border-white/[0.06] rounded-xl p-4 max-h-[75vh] overflow-y-auto">
                <div className="flex items-center justify-between mb-3">
                  <h2 className="text-sm font-semibold text-white">Backlog</h2>
                  <span className="text-[11px] text-gray-500">{backlogTickets.length} tickets</span>
                </div>
                {backlogTickets.length === 0 ? (
                  <div className="text-center py-12 text-gray-600 text-sm">No tickets in backlog</div>
                ) : (
                  <div className="space-y-0">
                    {backlogTickets.map(t => <DraggableTicket key={t.id} ticket={t} />)}
                  </div>
                )}
              </div>
              <div className="space-y-4 max-h-[75vh] overflow-y-auto">
                {sprints.length === 0 ? (
                  <div className="bg-zinc-900 border border-white/[0.06] rounded-xl p-8 text-center text-gray-600 text-sm">
                    No active sprints. Create one from the Sprints page.
                  </div>
                ) : (
                  sprints.map(s => {
                    const sprintTickets = tickets.filter(t => t.sprintId === s.id);
                    return (
                      <div key={s.id}>
                        <SprintZone sprint={s} tickets={sprintTickets} />
                        {sprintTickets.length > 0 && (
                          <div className="flex justify-end mt-1">
                            <button
                              onClick={() => sprintTickets.forEach(t => handleRemoveFromSprint(t.id))}
                              className="text-[10px] text-gray-500 hover:text-red-400 cursor-pointer px-2"
                            >
                              Move all back to backlog
                            </button>
                          </div>
                        )}
                      </div>
                    );
                  })
                )}
              </div>
            </div>

            <DragOverlay>
              {activeTicket && (
                <div className="bg-zinc-800 border border-blue-500/50 rounded-lg px-3 py-2 shadow-lg shadow-black/30 max-w-[360px]">
                  <span className="text-[10px] font-mono text-gray-500">{activeTicket.key}</span>
                  <p className="text-xs text-white truncate">{activeTicket.title}</p>
                </div>
              )}
            </DragOverlay>
          </DndContext>
        </main>
      </div>
    </div>
  );
}
