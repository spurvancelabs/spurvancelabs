'use client';

import { useState } from 'react';
import {
  TICKET_TYPES,
  TICKET_PRIORITIES,
  TYPE_LABELS,
  PRIORITY_LABELS,
} from '@/lib/projects/types';

interface TicketFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  projectId: string;
  projectKey: string;
  members: Array<{ id: string; name: string | null; email: string; image: string | null; role: string }>;
  sprints: Array<{ id: string; name: string; status: string }>;
  initialData?: {
    id?: string;
    title?: string;
    description?: string;
    type?: string;
    priority?: string;
    assigneeId?: string | null;
    sprintId?: string | null;
    storyPoints?: number | null;
    labels?: string[];
    dueDate?: string | null;
  } | null;
  parentId?: string | null;
}

export default function TicketForm({
  isOpen,
  onClose,
  onSuccess,
  projectId,
  projectKey,
  members,
  sprints,
  initialData,
  parentId,
}: TicketFormProps) {
  const [title, setTitle] = useState(initialData?.title || '');
  const [description, setDescription] = useState(initialData?.description || '');
  const [type, setType] = useState(initialData?.type || 'TASK');
  const [priority, setPriority] = useState(initialData?.priority || 'MEDIUM');
  const [assigneeId, setAssigneeId] = useState(initialData?.assigneeId || '');
  const [sprintId, setSprintId] = useState(initialData?.sprintId || '');
  const [storyPoints, setStoryPoints] = useState(initialData?.storyPoints?.toString() || '');
  const [labelsInput, setLabelsInput] = useState((initialData?.labels || []).join(', '));
  const [dueDate, setDueDate] = useState(initialData?.dueDate || '');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const isEditing = !!initialData?.id;

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setIsSubmitting(true);
    setError('');

    const payload = {
      title,
      description: description || null,
      type,
      priority,
      assigneeId: assigneeId || null,
      sprintId: sprintId || null,
      storyPoints: storyPoints ? parseInt(storyPoints, 10) : null,
      labels: labelsInput
        .split(',')
        .map((l) => l.trim())
        .filter(Boolean),
      dueDate: dueDate || null,
      parentId: parentId || null,
    };

    try {
      const url = isEditing
        ? `/api/projects/${projectId}/tickets/${initialData.id}`
        : `/api/projects/${projectId}/tickets`;
      const method = isEditing ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => null);
        throw new Error(data?.error || `Failed to ${isEditing ? 'update' : 'create'} ticket`);
      }

      onSuccess();
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setIsSubmitting(false);
    }
  }

  const inputClass =
    'w-full bg-zinc-900 border border-white/[0.06] rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-blue-500/50 transition-colors';
  const labelClass = 'block text-gray-400 text-xs font-medium mb-1';

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
      <div className="bg-zinc-950 border border-white/[0.06] rounded-xl max-w-lg w-full flex flex-col max-h-[90vh]">
        <div className="sticky top-0 bg-zinc-950 border-b border-white/[0.06] px-6 py-4 flex items-center justify-between z-10 shrink-0">
          <h2 className="text-white text-lg font-semibold">
            {isEditing ? `${projectKey}-${initialData.id?.slice(0, 4)}` : 'Create Ticket'}
          </h2>
          <button onClick={onClose} className="text-gray-400 hover:text-white text-xl cursor-pointer">
            ✕
          </button>
        </div>

        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto px-6 py-4 space-y-4">
          {error && (
            <div className="bg-red-500/10 border border-red-500/20 text-red-400 text-sm rounded-lg px-4 py-2">
              {error}
            </div>
          )}

          <div>
            <label className={labelClass}>Title *</label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className={inputClass}
              placeholder="e.g., Implement user authentication"
              autoFocus
            />
          </div>

          <div>
            <label className={labelClass}>Description</label>
            <textarea
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className={`${inputClass} resize-none`}
              placeholder="Describe the ticket..."
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className={labelClass}>Type</label>
              <select value={type} onChange={(e) => setType(e.target.value)} className={inputClass}>
                {TICKET_TYPES.map((t) => (
                  <option key={t} value={t}>
                    {TYPE_LABELS[t]}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className={labelClass}>Priority</label>
              <select value={priority} onChange={(e) => setPriority(e.target.value)} className={inputClass}>
                {TICKET_PRIORITIES.map((p) => (
                  <option key={p} value={p}>
                    {PRIORITY_LABELS[p]}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className={labelClass}>Assignee</label>
              <select value={assigneeId} onChange={(e) => setAssigneeId(e.target.value)} className={inputClass}>
                <option value="">Unassigned</option>
                {members.map((m) => (
                  <option key={m.id} value={m.id}>
                    {m.name || m.email}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className={labelClass}>Sprint</label>
              <select value={sprintId} onChange={(e) => setSprintId(e.target.value)} className={inputClass}>
                <option value="">No sprint</option>
                {sprints.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className={labelClass}>Story Points</label>
              <input
                type="number"
                min={0}
                max={100}
                value={storyPoints}
                onChange={(e) => setStoryPoints(e.target.value)}
                className={inputClass}
                placeholder="0"
              />
            </div>
            <div>
              <label className={labelClass}>Due Date</label>
              <input
                type="date"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
                className={inputClass}
              />
            </div>
          </div>

          <div>
            <label className={labelClass}>Labels (comma separated)</label>
            <input
              type="text"
              value={labelsInput}
              onChange={(e) => setLabelsInput(e.target.value)}
              className={inputClass}
              placeholder="frontend, design, api"
            />
          </div>

        <div className="sticky bottom-0 bg-zinc-950 border-t border-white/[0.06] px-6 py-4 shrink-0">
          <div className="flex gap-3">
            <button
              type="button"
              onClick={onClose}
              disabled={isSubmitting}
              className="flex-1 bg-white/[0.06] text-gray-400 border border-white/[0.06] px-4 py-2.5 rounded-lg text-sm font-medium hover:bg-white/[0.1] hover:text-white transition-all cursor-pointer disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting || !title.trim()}
              className="flex-1 bg-blue-500 text-white px-4 py-2.5 rounded-lg text-sm font-medium hover:bg-blue-600 transition-all cursor-pointer disabled:opacity-50"
            >
              {isSubmitting ? 'Saving...' : isEditing ? 'Update Ticket' : 'Create Ticket'}
            </button>
          </div>
        </div>
        </form>
      </div>
    </div>
  );
}
