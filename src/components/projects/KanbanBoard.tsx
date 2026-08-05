'use client';

import { useState, useCallback, useMemo } from 'react';
import toast from 'react-hot-toast';
import {
  DndContext,
  DragOverlay,
  closestCorners,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  type DragStartEvent,
  type DragEndEvent,
  type DragOverEvent,
} from '@dnd-kit/core';
import { sortableKeyboardCoordinates } from '@dnd-kit/sortable';
import KanbanColumn from './KanbanColumn';
import TicketCard from './TicketCard';
import TicketForm from './TicketForm';
import TicketDetailModal from './TicketDetailModal';
import {
  TICKET_STATUSES,
  PRIORITY_LABELS,
  TYPE_LABELS,
} from '@/lib/projects/types';
import type { KanbanBoardTicket } from '@/app/projects/[projectId]/board/page';

interface KanbanBoardProps {
  project: {
    id: string;
    name: string;
    key: string;
    description: string | null;
    status: string;
    color: string | null;
    icon: string | null;
    owner: { id: string; name: string | null; email: string; image: string | null };
    _count: { members: number; tickets: number; sprints: number };
  };
  initialTickets: KanbanBoardTicket[];
  members: Array<{ id: string; name: string | null; email: string; image: string | null; role: string }>;
  sprints: Array<{ id: string; name: string; status: string; startDate: Date | null; endDate: Date | null; _count: { tickets: number } }>;
  currentUserId: string;
}

const BOARD_STATUSES = TICKET_STATUSES.filter((s) => s !== 'CANCELLED') as readonly string[];

export default function KanbanBoard({
  project,
  initialTickets,
  members,
  sprints,
  currentUserId,
}: KanbanBoardProps) {
  const [tickets, setTickets] = useState<KanbanBoardTicket[]>(initialTickets);
  const [activeTicket, setActiveTicket] = useState<KanbanBoardTicket | null>(null);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterPriority, setFilterPriority] = useState('');
  const [filterType, setFilterType] = useState('');
  const [filterAssignee, setFilterAssignee] = useState('');
  const [selectedTicketId, setSelectedTicketId] = useState<string | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 8 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates }),
  );

  const filteredTickets = useMemo(() => {
    return tickets.filter((t) => {
      if (searchQuery && !t.title.toLowerCase().includes(searchQuery.toLowerCase()) && !t.key.toLowerCase().includes(searchQuery.toLowerCase())) {
        return false;
      }
      if (filterPriority && t.priority !== filterPriority) return false;
      if (filterType && t.type !== filterType) return false;
      if (filterAssignee) {
        if (filterAssignee === '__unassigned' && t.assignee) return false;
        if (filterAssignee !== '__unassigned' && t.assignee?.id !== filterAssignee) return false;
      }
      return true;
    });
  }, [tickets, searchQuery, filterPriority, filterType, filterAssignee]);

  const ticketsByStatus = useMemo(() => {
    const grouped: Record<string, KanbanBoardTicket[]> = {};
    for (const status of BOARD_STATUSES) {
      grouped[status] = filteredTickets
        .filter((t) => t.status === status)
        .sort((a, b) => a.order - b.order);
    }
    return grouped;
  }, [filteredTickets]);

  const handleDragStart = useCallback(
    (event: DragStartEvent) => {
      const ticket = tickets.find((t) => t.id === event.active.id);
      if (ticket) setActiveTicket(ticket);
    },
    [tickets],
  );

  const handleDragOver = useCallback(
    (event: DragOverEvent) => {
      const { active, over } = event;
      if (!over) return;

      const activeId = active.id as string;
      const overId = over.id as string;

      const activeTicket = tickets.find((t) => t.id === activeId);
      if (!activeTicket) return;

      let newStatus: string | null = null;

      if (BOARD_STATUSES.includes(overId as string)) {
        newStatus = overId;
      } else {
        const overTicket = tickets.find((t) => t.id === overId);
        if (overTicket && overTicket.status !== activeTicket.status) {
          newStatus = overTicket.status;
        }
      }

      if (newStatus && newStatus !== activeTicket.status) {
        setTickets((prev) =>
          prev.map((t) =>
            t.id === activeId ? { ...t, status: newStatus! } : t,
          ),
        );
      }
    },
    [tickets],
  );

  const handleDragEnd = useCallback(
    async (event: DragEndEvent) => {
      const { active, over } = event;
      setActiveTicket(null);

      if (!over) return;

      const activeId = active.id as string;
      const overId = over.id as string;

      const ticket = tickets.find((t) => t.id === activeId);
      if (!ticket) return;

      let newStatus = ticket.status;
      let newOrder = ticket.order;

      if (BOARD_STATUSES.includes(overId as string)) {
        newStatus = overId;
        const columnTickets = tickets
          .filter((t) => t.status === newStatus && t.id !== activeId)
          .sort((a, b) => a.order - b.order);
        newOrder = columnTickets.length > 0 ? columnTickets[columnTickets.length - 1].order + 1 : 0;
      } else {
        const overTicket = tickets.find((t) => t.id === overId);
        if (overTicket) {
          newStatus = overTicket.status;
          const columnTickets = tickets
            .filter((t) => t.status === newStatus && t.id !== activeId)
            .sort((a, b) => a.order - b.order);
          const overIndex = columnTickets.findIndex((t) => t.id === overId);
          newOrder = overIndex >= 0 ? overIndex : columnTickets.length;
        }
      }

      setTickets((prev) =>
        prev.map((t) =>
          t.id === activeId ? { ...t, status: newStatus, order: newOrder } : t,
        ),
      );

      try {
        const res = await fetch(`/api/projects/${project.id}/tickets/${activeId}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          credentials: 'include',
          body: JSON.stringify({ status: newStatus, order: newOrder }),
        });

        if (!res.ok) {
          toast.error('Failed to move ticket');
          setTickets((prev) =>
            prev.map((t) =>
              t.id === activeId ? { ...t, status: ticket.status, order: ticket.order } : t,
            ),
          );
        }
      } catch {
        toast.error('Failed to move ticket');
        setTickets((prev) =>
          prev.map((t) =>
            t.id === activeId ? { ...t, status: ticket.status, order: ticket.order } : t,
          ),
        );
      }
    },
    [tickets, project.id],
  );

  const handleTicketCreated = useCallback(() => {
    window.location.reload();
  }, []);

  return (
    <div className="h-screen flex flex-col bg-zinc-950">
      <div className="shrink-0 border-b border-white/[0.06] px-6 py-4">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div
              className="w-8 h-8 rounded-lg flex items-center justify-center text-sm font-bold"
              style={{ backgroundColor: project.color || '#3b82f6' + '20', color: project.color || '#3b82f6' }}
            >
              {project.icon || project.key}
            </div>
            <div>
              <h1 className="text-white text-lg font-semibold">{project.name}</h1>
              <p className="text-gray-500 text-xs">Board view</p>
            </div>
          </div>
          <button
            onClick={() => setShowCreateForm(true)}
            className="flex items-center gap-2 bg-blue-500 text-white text-sm font-medium px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors cursor-pointer"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
            </svg>
            Create Ticket
          </button>
        </div>

        <div className="flex items-center gap-3 flex-wrap">
          <div className="relative">
            <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search tickets..."
              className="bg-zinc-900 border border-white/[0.06] rounded-lg pl-9 pr-3 py-1.5 text-white text-xs focus:outline-none focus:border-blue-500/50 w-52"
            />
          </div>

          <select
            value={filterPriority}
            onChange={(e) => setFilterPriority(e.target.value)}
            className="bg-zinc-900 border border-white/[0.06] rounded-lg px-3 py-1.5 text-gray-300 text-xs focus:outline-none focus:border-blue-500/50 cursor-pointer"
          >
            <option value="">All priorities</option>
            {Object.entries(PRIORITY_LABELS).map(([k, v]) => (
              <option key={k} value={k}>{v}</option>
            ))}
          </select>

          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
            className="bg-zinc-900 border border-white/[0.06] rounded-lg px-3 py-1.5 text-gray-300 text-xs focus:outline-none focus:border-blue-500/50 cursor-pointer"
          >
            <option value="">All types</option>
            {Object.entries(TYPE_LABELS).map(([k, v]) => (
              <option key={k} value={k}>{v}</option>
            ))}
          </select>

          <select
            value={filterAssignee}
            onChange={(e) => setFilterAssignee(e.target.value)}
            className="bg-zinc-900 border border-white/[0.06] rounded-lg px-3 py-1.5 text-gray-300 text-xs focus:outline-none focus:border-blue-500/50 cursor-pointer"
          >
            <option value="">All assignees</option>
            <option value="__unassigned">Unassigned</option>
            {members.map((m) => (
              <option key={m.id} value={m.id}>{m.name || m.email}</option>
            ))}
          </select>

          {(searchQuery || filterPriority || filterType || filterAssignee) && (
            <button
              onClick={() => {
                setSearchQuery('');
                setFilterPriority('');
                setFilterType('');
                setFilterAssignee('');
              }}
              className="text-xs text-gray-500 hover:text-gray-300 transition-colors cursor-pointer"
            >
              Clear filters
            </button>
          )}
        </div>
      </div>

      <div className="flex-1 overflow-x-auto overflow-y-hidden px-6 py-4">
        <DndContext
          sensors={sensors}
          collisionDetection={closestCorners}
          onDragStart={handleDragStart}
          onDragOver={handleDragOver}
          onDragEnd={handleDragEnd}
        >
          <div className="flex gap-4 h-full">
            {BOARD_STATUSES.map((status) => (
              <KanbanColumn
                key={status}
                status={status}
                tickets={ticketsByStatus[status] || []}
                onTicketClick={(ticket: KanbanBoardTicket) => setSelectedTicketId(ticket.id)}
              />
            ))}
          </div>

          <DragOverlay>
            {activeTicket ? (
              <div className="rotate-2 opacity-90">
                <TicketCard ticket={activeTicket} onClick={() => {}} />
              </div>
            ) : null}
          </DragOverlay>
        </DndContext>
      </div>

      {showCreateForm && (
        <TicketForm
          isOpen={showCreateForm}
          onClose={() => setShowCreateForm(false)}
          onSuccess={handleTicketCreated}
          projectId={project.id}
          projectKey={project.key}
          members={members}
          sprints={sprints}
        />
      )}

      {selectedTicketId && (
        <TicketDetailModal
          projectId={project.id}
          ticketId={selectedTicketId}
          onClose={() => setSelectedTicketId(null)}
        />
      )}
    </div>
  );
}
