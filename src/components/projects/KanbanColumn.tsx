'use client';

import { useDroppable } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { STATUS_LABELS, STATUS_COLORS } from '@/lib/projects/types';
import TicketCard from './TicketCard';
import type { KanbanBoardTicket } from '@/app/projects/[projectId]/board/page';

interface KanbanColumnProps {
  status: string;
  tickets: KanbanBoardTicket[];
  onTicketClick: (ticket: KanbanBoardTicket) => void;
}

export default function KanbanColumn({ status, tickets, onTicketClick }: KanbanColumnProps) {
  const { setNodeRef, isOver } = useDroppable({ id: status });

  return (
    <div className="flex flex-col min-w-[280px] w-[280px] shrink-0">
      <div className={`flex items-center gap-2 px-2 mb-2`}>
        <span className={`text-xs font-medium px-2 py-0.5 rounded border ${STATUS_COLORS[status] || 'bg-gray-500/10 text-gray-400 border-gray-500/20'}`}>
          {STATUS_LABELS[status] || status}
        </span>
        <span className="text-xs text-gray-500 font-medium">{tickets.length}</span>
      </div>

      <div
        ref={setNodeRef}
        className={`flex-1 bg-zinc-900/50 rounded-xl p-2 space-y-2 min-h-[200px] transition-colors ${
          isOver ? 'ring-1 ring-blue-500/40 bg-blue-500/[0.03]' : ''
        }`}
      >
        <SortableContext items={tickets.map((t) => t.id)} strategy={verticalListSortingStrategy}>
          {tickets.map((ticket) => (
            <TicketCard key={ticket.id} ticket={ticket} onClick={onTicketClick} />
          ))}
        </SortableContext>

        {tickets.length === 0 && (
          <div className="flex items-center justify-center h-24 text-xs text-gray-600">
            No tickets
          </div>
        )}
      </div>
    </div>
  );
}
