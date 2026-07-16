'use client';

import { useState, useEffect, useCallback } from 'react';
import toast from 'react-hot-toast';
import { STATUS_COLORS, PRIORITY_COLORS, TYPE_COLORS, STATUS_LABELS, PRIORITY_LABELS, TYPE_LABELS } from '@/lib/projects/types';

interface TicketDetail {
  id: string;
  key: string;
  title: string;
  description: string | null;
  status: string;
  priority: string;
  type: string;
  storyPoints: number | null;
  estimatedHours: number | null;
  startDate: string | null;
  dueDate: string | null;
  labels: string[];
  createdAt: string;
  updatedAt: string;
  assignee: { id: string; name: string | null; email: string; image: string | null } | null;
  reporter: { id: string; name: string | null; email: string; image: string | null };
  sprint: { id: string; name: string } | null;
  parent: { id: string; key: string; title: string } | null;
  comments: Array<{ id: string; content: string; createdAt: string; user: { id: string; name: string | null; email: string; image: string | null } }>;
  attachments: Array<{ id: string; fileName: string; fileUrl: string; fileSize: number; createdAt: string; user: { name: string | null } }>;
  timeLogs: Array<{ id: string; hours: number; description: string | null; date: string; user: { name: string | null } }>;
  activities: Array<{ id: string; action: string; field: string | null; oldValue: string | null; newValue: string | null; createdAt: string; user: { name: string | null } }>;
  _count: { comments: number; attachments: number; timeLogs: number };
}

interface Member {
  id: string;
  user: { id: string; name: string | null; email: string };
  role: string;
}

interface Sprint {
  id: string;
  name: string;
  status: string;
}

type Tab = 'comments' | 'activity' | 'time' | 'attachments';

export default function TicketDetailModal({
  ticketId,
  projectId,
  onClose,
  onUpdate,
  members = [],
  sprints = [],
}: {
  ticketId: string;
  projectId: string;
  onClose: () => void;
  onUpdate?: () => void;
  members?: Member[];
  sprints?: Sprint[];
}) {
  const [ticket, setTicket] = useState<TicketDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState<Tab>('comments');
  const [editing, setEditing] = useState(false);
  const [editData, setEditData] = useState<Partial<TicketDetail>>({});
  const [newComment, setNewComment] = useState('');
  const [timeHours, setTimeHours] = useState('');
  const [timeDesc, setTimeDesc] = useState('');
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);

  const fetchTicket = useCallback(async () => {
    try {
      const res = await fetch(`/api/projects/${projectId}/tickets/${ticketId}`, { credentials: 'include' });
      const data = await res.json();
      setTicket(data.data);
    } catch { toast.error('Failed to load ticket'); } finally {
      setLoading(false);
    }
  }, [projectId, ticketId]);

  useEffect(() => { fetchTicket(); }, [fetchTicket]);

  const updateField = async (field: string, value: string) => {
    setSaving(true);
    try {
      const res = await fetch(`/api/projects/${projectId}/tickets/${ticketId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ [field]: value }),
      });
      if (res.ok) {
        setTicket(prev => prev ? { ...prev, [field]: value } as TicketDetail : prev);
        onUpdate?.();
      } else {
        toast.error('Failed to update field');
      }
    } catch { toast.error('Failed to update field'); } finally { setSaving(false); }
  };

  const addComment = async () => {
    if (!newComment.trim()) return;
    try {
      await fetch(`/api/projects/${projectId}/tickets/${ticketId}/comments`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ content: newComment.trim() }),
      });
      setNewComment('');
      fetchTicket();
    } catch { toast.error('Failed to add comment'); }
  };

  const addTimeLog = async () => {
    if (!timeHours) return;
    try {
      await fetch(`/api/projects/${projectId}/tickets/${ticketId}/time-logs`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ hours: parseFloat(timeHours), description: timeDesc.trim() || undefined }),
      });
      setTimeHours('');
      setTimeDesc('');
      fetchTicket();
    } catch { toast.error('Failed to log time'); }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) {
      toast.error('File too large (max 5MB)');
      return;
    }
    setUploading(true);
    try {
      const formData = new FormData();
      formData.append('file', file);
      await fetch(`/api/projects/${projectId}/tickets/${ticketId}/attachments`, {
        method: 'POST',
        credentials: 'include',
        body: formData,
      });
      toast.success('File uploaded');
      fetchTicket();
    } catch { toast.error('Failed to upload file'); } finally {
      setUploading(false);
      e.target.value = '';
    }
  };

  if (loading) {
    return (
      <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center">
        <div className="bg-zinc-900 rounded-2xl w-full max-w-3xl h-[80vh] flex items-center justify-center">
          <div className="animate-spin w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full" />
        </div>
      </div>
    );
  }

  if (!ticket) return null;

  const totalHours = ticket.timeLogs.reduce((sum, l) => sum + l.hours, 0);

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-start justify-end">
      <div className="bg-zinc-950 border-l border-white/[0.06] w-full max-w-3xl h-full overflow-y-auto shadow-2xl">
        <div className="sticky top-0 z-10 bg-zinc-950 border-b border-white/[0.06] p-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="text-sm font-mono text-gray-500">{ticket.key}</span>
            <span className={`text-[10px] px-2 py-0.5 rounded border ${TYPE_COLORS[ticket.type] || ''}`}>{TYPE_LABELS[ticket.type] || ticket.type}</span>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => { setEditing(!editing); setEditData(ticket); }}
              className="text-gray-400 hover:text-white text-sm cursor-pointer"
            >
              {editing ? 'Cancel' : 'Edit'}
            </button>
            <button onClick={onClose} className="text-gray-400 hover:text-white cursor-pointer">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        <div className="p-6">
          {editing ? (
            <div className="space-y-4 mb-6">
              <div>
                <label className="text-xs text-gray-500 mb-1 block">Title</label>
                <input
                  value={editData.title || ''}
                  onChange={e => setEditData({ ...editData, title: e.target.value })}
                  className="w-full bg-zinc-800 border border-white/[0.06] rounded-lg px-3 py-2 text-white text-sm outline-none"
                />
              </div>
              <div>
                <label className="text-xs text-gray-500 mb-1 block">Description</label>
                <textarea
                  value={editData.description || ''}
                  onChange={e => setEditData({ ...editData, description: e.target.value })}
                  className="w-full bg-zinc-800 border border-white/[0.06] rounded-lg px-3 py-2 text-white text-sm outline-none resize-none"
                  rows={4}
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs text-gray-500 mb-1 block">Status</label>
                  <select
                    value={editData.status || ''}
                    onChange={e => setEditData({ ...editData, status: e.target.value })}
                    className="w-full bg-zinc-800 border border-white/[0.06] rounded-lg px-3 py-2 text-white text-sm outline-none"
                  >
                    {Object.entries(STATUS_LABELS).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
                  </select>
                </div>
                <div>
                  <label className="text-xs text-gray-500 mb-1 block">Priority</label>
                  <select
                    value={editData.priority || ''}
                    onChange={e => setEditData({ ...editData, priority: e.target.value })}
                    className="w-full bg-zinc-800 border border-white/[0.06] rounded-lg px-3 py-2 text-white text-sm outline-none"
                  >
                    {Object.entries(PRIORITY_LABELS).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
                  </select>
                </div>
                <div>
                  <label className="text-xs text-gray-500 mb-1 block">Type</label>
                  <select
                    value={editData.type || ''}
                    onChange={e => setEditData({ ...editData, type: e.target.value })}
                    className="w-full bg-zinc-800 border border-white/[0.06] rounded-lg px-3 py-2 text-white text-sm outline-none"
                  >
                    {Object.entries(TYPE_LABELS).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
                  </select>
                </div>
                <div>
                  <label className="text-xs text-gray-500 mb-1 block">Assignee</label>
                  <select
                    value={editData.assignee?.id || ''}
                    onChange={e => {
                      const m = members.find(m => m.user.id === e.target.value);
                      setEditData({ ...editData, assignee: m ? { id: m.user.id, name: m.user.name, email: m.user.email, image: null } : null });
                    }}
                    className="w-full bg-zinc-800 border border-white/[0.06] rounded-lg px-3 py-2 text-white text-sm outline-none"
                  >
                    <option value="">Unassigned</option>
                    {members.map(m => (
                      <option key={m.user.id} value={m.user.id}>{m.user.name || m.user.email}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="text-xs text-gray-500 mb-1 block">Sprint</label>
                  <select
                    value={editData.sprint?.id || ''}
                    onChange={e => {
                      const s = sprints.find(s => s.id === e.target.value);
                      setEditData({ ...editData, sprint: s ? { id: s.id, name: s.name } : null });
                    }}
                    className="w-full bg-zinc-800 border border-white/[0.06] rounded-lg px-3 py-2 text-white text-sm outline-none"
                  >
                    <option value="">No Sprint</option>
                    {sprints.map(s => (
                      <option key={s.id} value={s.id}>{s.name}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="text-xs text-gray-500 mb-1 block">Story Points</label>
                  <input
                    type="number"
                    value={editData.storyPoints || ''}
                    onChange={e => setEditData({ ...editData, storyPoints: parseInt(e.target.value) || null })}
                    className="w-full bg-zinc-800 border border-white/[0.06] rounded-lg px-3 py-2 text-white text-sm outline-none"
                  />
                </div>
                <div>
                  <label className="text-xs text-gray-500 mb-1 block">Due Date</label>
                  <input
                    type="date"
                    value={editData.dueDate ? new Date(editData.dueDate).toISOString().split('T')[0] : ''}
                    onChange={e => setEditData({ ...editData, dueDate: e.target.value })}
                    className="w-full bg-zinc-800 border border-white/[0.06] rounded-lg px-3 py-2 text-white text-sm outline-none"
                  />
                </div>
              </div>
              <button
                onClick={async () => {
                  setSaving(true);
                  const payload: Record<string, unknown> = {
                    title: editData.title,
                    description: editData.description,
                    status: editData.status,
                    priority: editData.priority,
                    type: editData.type,
                    storyPoints: editData.storyPoints,
                    dueDate: editData.dueDate,
                    assigneeId: editData.assignee?.id || null,
                    sprintId: editData.sprint?.id || null,
                  };
                  const res = await fetch(`/api/projects/${projectId}/tickets/${ticketId}`, {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json' },
                    credentials: 'include',
                    body: JSON.stringify(payload),
                  });
                  if (res.ok) {
                    setEditing(false);
                    fetchTicket();
                    onUpdate?.();
                  }
                  setSaving(false);
                }}
                disabled={saving}
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium disabled:opacity-50 cursor-pointer"
              >
                {saving ? 'Saving...' : 'Save Changes'}
              </button>
            </div>
          ) : (
            <>
              <h2 className="text-xl font-semibold text-white mb-4">{ticket.title}</h2>
              {ticket.description && (
                <p className="text-gray-400 text-sm mb-6 whitespace-pre-wrap">{ticket.description}</p>
              )}
            </>
          )}

          <div className="grid grid-cols-2 gap-4 mb-6">
            <div className="bg-zinc-900 border border-white/[0.06] rounded-xl p-4 space-y-3">
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Status</span>
                <select
                  value={ticket.status}
                  onChange={e => updateField('status', e.target.value)}
                  className={`text-[11px] px-2 py-0.5 rounded border bg-transparent cursor-pointer outline-none ${STATUS_COLORS[ticket.status] || ''}`}
                >
                  {Object.entries(STATUS_LABELS).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
                </select>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Priority</span>
                <span className={`text-[11px] px-2 py-0.5 rounded ${PRIORITY_COLORS[ticket.priority] || ''}`}>{PRIORITY_LABELS[ticket.priority]}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Type</span>
                <span className={`text-[11px] px-2 py-0.5 rounded ${TYPE_COLORS[ticket.type] || ''}`}>{TYPE_LABELS[ticket.type]}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Story Points</span>
                <span className="text-white">{ticket.storyPoints ?? '-'}</span>
              </div>
            </div>
            <div className="bg-zinc-900 border border-white/[0.06] rounded-xl p-4 space-y-3">
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Assignee</span>
                <span className="text-white text-xs">{ticket.assignee?.name || ticket.assignee?.email || 'Unassigned'}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Reporter</span>
                <span className="text-white text-xs">{ticket.reporter.name || ticket.reporter.email}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Sprint</span>
                <span className="text-white text-xs">{ticket.sprint?.name || 'None'}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Total Logged</span>
                <span className="text-white">{totalHours}h</span>
              </div>
            </div>
          </div>

          <div className="border-b border-white/[0.06] mb-4 flex gap-4">
            {(['comments', 'activity', 'time', 'attachments'] as Tab[]).map(t => (
              <button
                key={t}
                onClick={() => setTab(t)}
                className={`pb-2 text-sm font-medium capitalize transition-colors cursor-pointer ${
                  tab === t ? 'text-blue-400 border-b-2 border-blue-400' : 'text-gray-500 hover:text-gray-300'
                }`}
              >
                {t} {t === 'comments' ? `(${ticket.comments?.length || 0})` : t === 'attachments' ? `(${ticket.attachments?.length || 0})` : t === 'time' ? `(${totalHours}h)` : ''}
              </button>
            ))}
          </div>

          {tab === 'comments' && (
            <div className="space-y-4">
              <div className="flex gap-3">
                <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center text-white text-xs shrink-0">Y</div>
                <div className="flex-1">
                  <textarea
                    value={newComment}
                    onChange={e => setNewComment(e.target.value)}
                    className="w-full bg-zinc-800 border border-white/[0.06] rounded-lg px-3 py-2 text-white text-sm outline-none resize-none"
                    rows={3}
                    placeholder="Add a comment..."
                  />
                  <button
                    onClick={addComment}
                    disabled={!newComment.trim()}
                    className="mt-2 bg-blue-600 hover:bg-blue-700 text-white px-3 py-1.5 rounded-lg text-xs font-medium disabled:opacity-50 cursor-pointer"
                  >
                    Comment
                  </button>
                </div>
              </div>
              {ticket.comments.map(c => (
                <div key={c.id} className="flex gap-3">
                  <div className="w-8 h-8 rounded-full bg-zinc-700 flex items-center justify-center text-white text-xs shrink-0">
                    {(c.user.name || c.user.email)[0].toUpperCase()}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-sm text-white font-medium">{c.user.name || c.user.email}</span>
                      <span className="text-[11px] text-gray-600">{new Date(c.createdAt).toLocaleString()}</span>
                    </div>
                    <p className="text-sm text-gray-300 whitespace-pre-wrap">{c.content}</p>
                  </div>
                </div>
              ))}
              {ticket.comments.length === 0 && <p className="text-gray-600 text-sm text-center py-4">No comments yet</p>}
            </div>
          )}

          {tab === 'activity' && (
            <div className="space-y-3">
              {ticket.activities.map(a => (
                <div key={a.id} className="flex items-start gap-3 text-sm">
                  <div className="w-2 h-2 rounded-full bg-blue-500 mt-1.5 shrink-0" />
                  <div>
                    <span className="text-gray-400">
                      <span className="text-white font-medium">{a.user.name || 'Someone'}</span>
                      {' '}{a.action.replace('_', ' ')}
                      {a.field && <span className="text-gray-500"> ({a.field})</span>}
                      {a.oldValue && a.newValue && (
                        <span> from <span className="text-red-400">{a.oldValue}</span> to <span className="text-green-400">{a.newValue}</span></span>
                      )}
                    </span>
                    <span className="text-gray-600 text-[11px] ml-2">{new Date(a.createdAt).toLocaleString()}</span>
                  </div>
                </div>
              ))}
              {ticket.activities.length === 0 && <p className="text-gray-600 text-sm text-center py-4">No activity yet</p>}
            </div>
          )}

          {tab === 'time' && (
            <div>
              <div className="flex gap-2 mb-4">
                <input
                  type="number"
                  step="0.25"
                  value={timeHours}
                  onChange={e => setTimeHours(e.target.value)}
                  placeholder="Hours"
                  className="w-24 bg-zinc-800 border border-white/[0.06] rounded-lg px-3 py-2 text-white text-sm outline-none"
                />
                <input
                  value={timeDesc}
                  onChange={e => setTimeDesc(e.target.value)}
                  placeholder="Description (optional)"
                  className="flex-1 bg-zinc-800 border border-white/[0.06] rounded-lg px-3 py-2 text-white text-sm outline-none"
                />
                <button
                  onClick={addTimeLog}
                  disabled={!timeHours}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-2 rounded-lg text-sm disabled:opacity-50 cursor-pointer"
                >
                  Log
                </button>
              </div>
              <div className="space-y-2">
                {ticket.timeLogs.map(l => (
                  <div key={l.id} className="flex items-center justify-between bg-zinc-900 border border-white/[0.06] rounded-lg px-4 py-2">
                    <div>
                      <span className="text-white text-sm">{l.hours}h</span>
                      {l.description && <span className="text-gray-500 text-sm ml-2">- {l.description}</span>}
                    </div>
                    <div className="text-xs text-gray-600">
                      <span>{l.user.name || 'Unknown'}</span>
                      <span className="ml-2">{new Date(l.date).toLocaleDateString()}</span>
                    </div>
                  </div>
                ))}
                {ticket.timeLogs.length === 0 && <p className="text-gray-600 text-sm text-center py-4">No time logged</p>}
              </div>
            </div>
          )}

          {tab === 'attachments' && (
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="cursor-pointer bg-blue-600 hover:bg-blue-700 text-white px-3 py-1.5 rounded-lg text-sm transition-colors inline-flex items-center gap-2">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  </svg>
                  {uploading ? 'Uploading...' : 'Upload file'}
                  <input type="file" className="hidden" onChange={handleFileUpload} disabled={uploading} />
                </label>
                <span className="text-xs text-gray-600">Max 5MB</span>
              </div>
              {ticket.attachments.map(a => (
                <a
                  key={a.id}
                  href={a.fileUrl.startsWith('data:') ? undefined : a.fileUrl}
                  download={a.fileUrl.startsWith('data:') ? a.fileName : undefined}
                  target={a.fileUrl.startsWith('data:') ? undefined : '_blank'}
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 bg-zinc-900 border border-white/[0.06] rounded-lg px-4 py-3 hover:border-blue-500/30 transition-colors"
                >
                  <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m2.25 0H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
                  </svg>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-white truncate">{a.fileName}</p>
                    <p className="text-[11px] text-gray-600">{(a.fileSize / 1024).toFixed(1)}KB &middot; {a.user.name}</p>
                  </div>
                </a>
              ))}
              {ticket.attachments.length === 0 && <p className="text-gray-600 text-sm text-center py-4">No attachments</p>}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
