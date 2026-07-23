'use client';

import { useState } from 'react';
import toast from 'react-hot-toast';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { PRIORITY_COLORS, TYPE_COLORS, PRIORITY_LABELS, TYPE_LABELS } from '@/lib/projects/types';
import type { KanbanBoardTicket } from '@/app/projects/[projectId]/board/page';

interface TicketCardProps {
  ticket: KanbanBoardTicket;
  onClick: (ticket: KanbanBoardTicket) => void;
  projectId: string;
  onSubtaskCreated?: () => void;
}

export default function TicketCard({ ticket, onClick, projectId, onSubtaskCreated }: TicketCardProps) {
  const [showSubtaskForm, setShowSubtaskForm] = useState(false);
  const [subtaskTitle, setSubtaskTitle] = useState('');
  const [creating, setCreating] = useState(false);

  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: ticket.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  const handleCreateSubtask = async () => {
    if (!subtaskTitle.trim()) return;
    setCreating(true);
    try {
      const res = await fetch(`/api/projects/${projectId}/tickets`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          title: subtaskTitle.trim(),
          type: 'SUB_TASK',
          priority: ticket.priority,
          parentId: ticket.id,
          sprintId: ticket.sprint?.id || null,
        }),
      });
      if (res.ok) {
        setSubtaskTitle('');
        setShowSubtaskForm(false);
        toast.success('Sub-task created');
        onSubtaskCreated?.();
      } else {
        toast.error('Failed to create sub-task');
      }
    } catch {
      toast.error('Failed to create sub-task');
    } finally {
      setCreating(false);
    }
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      onClick={() => {
        if (!showSubtaskForm) onClick(ticket);
      }}
      className="group relative bg-zinc-800 border border-white/[0.06] rounded-lg p-3 cursor-grab active:cursor-grabbing hover:border-white/[0.12] transition-colors"
    >
      <button
        onClick={(e) => {
          e.stopPropagation();
          setShowSubtaskForm(!showSubtaskForm);
        }}
        className="absolute -top-1.5 -right-1.5 opacity-0 group-hover:opacity-100 w-5 h-5 bg-blue-600 hover:bg-blue-500 rounded-full flex items-center justify-center transition-all cursor-pointer z-10"
        title="Add sub-task"
      >
        <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
        </svg>
      </button>

      <div className="flex items-center justify-between mb-1.5">
        <span className="text-xs text-gray-500 font-mono">{ticket.key}</span>
        {ticket.storyPoints != null && (
          <span className="text-[10px] font-medium text-gray-400 bg-white/[0.06] rounded px-1.5 py-0.5">
            {ticket.storyPoints}
          </span>
        )}
      </div>

      <p className="text-white text-sm font-medium leading-snug mb-2 line-clamp-2">
        {ticket.title}
      </p>

      {ticket.parent && (
        <div className="flex items-center gap-1.5 mb-2">
          <svg className="w-3 h-3 text-gray-500 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
          </svg>
          <span className="text-[10px] text-gray-500 font-mono">{ticket.parent.key}</span>
        </div>
      )}

      <div className="flex flex-wrap gap-1.5 mb-2">
        <span className={`text-[10px] font-medium px-1.5 py-0.5 rounded border ${TYPE_COLORS[ticket.type] || 'bg-gray-500/10 text-gray-400'}`}>
          {TYPE_LABELS[ticket.type] || ticket.type}
        </span>
        <span className={`text-[10px] font-medium px-1.5 py-0.5 rounded ${PRIORITY_COLORS[ticket.priority] || 'bg-gray-500/10 text-gray-400'}`}>
          {PRIORITY_LABELS[ticket.priority] || ticket.priority}
        </span>
      </div>

      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 text-gray-500">
          {ticket._count.comments > 0 && (
            <span className="flex items-center gap-0.5 text-[10px]">
              <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
              </svg>
              {ticket._count.comments}
            </span>
          )}
          {ticket._count.attachments > 0 && (
            <span className="flex items-center gap-0.5 text-[10px]">
              <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" />
              </svg>
              {ticket._count.attachments}
            </span>
          )}
        </div>

        {ticket.assignee ? (
          ticket.assignee.image ? (
            <img
              src={ticket.assignee.image}
              alt={ticket.assignee.name || ticket.assignee.email}
              className="w-5 h-5 rounded-full border border-white/[0.06]"
            />
          ) : (
            <div className="w-5 h-5 rounded-full bg-blue-500/20 border border-blue-500/30 flex items-center justify-center">
              <span className="text-[9px] font-medium text-blue-400">
                {(ticket.assignee.name || ticket.assignee.email)?.[0]?.toUpperCase()}
              </span>
            </div>
          )
        ) : (
          <div className="w-5 h-5 rounded-full bg-white/[0.06] border border-white/[0.06] flex items-center justify-center">
            <span className="text-[9px] text-gray-500">—</span>
          </div>
        )}
      </div>

      {showSubtaskForm && (
        <div className="mt-2 pt-2 border-t border-white/[0.06]" onClick={(e) => e.stopPropagation()}>
          <div className="flex gap-1.5">
            <input
              value={subtaskTitle}
              onChange={(e) => setSubtaskTitle(e.target.value)}
              placeholder="Sub-task title..."
              className="flex-1 bg-zinc-900 border border-white/[0.06] rounded px-2 py-1 text-white text-[11px] outline-none focus:border-blue-500/50"
              autoFocus
              onKeyDown={(e) => {
                if (e.key === 'Enter') handleCreateSubtask();
                if (e.key === 'Escape') { setShowSubtaskForm(false); setSubtaskTitle(''); }
              }}
            />
            <button
              onClick={handleCreateSubtask}
              disabled={creating || !subtaskTitle.trim()}
              className="bg-blue-600 hover:bg-blue-500 text-white px-2 py-1 rounded text-[11px] font-medium disabled:opacity-50 cursor-pointer shrink-0"
            >
              {creating ? '...' : 'Add'}
            </button>
            <button
              onClick={() => { setShowSubtaskForm(false); setSubtaskTitle(''); }}
              className="text-gray-500 hover:text-white text-[11px] px-1 cursor-pointer"
            >
              x
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
