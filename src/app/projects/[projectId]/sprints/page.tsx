'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import ProjectSidebar from '@/components/projects/ProjectSidebar';
import ProjectHeader from '@/components/projects/ProjectHeader';

interface Sprint {
  id: string;
  name: string;
  goal: string | null;
  status: string;
  startDate: string | null;
  endDate: string | null;
  createdAt: string;
  _count: { tickets: number };
}

const STATUS_BADGES: Record<string, string> = {
  PLANNING: 'bg-yellow-500/10 text-yellow-400 border border-yellow-500/20',
  ACTIVE: 'bg-green-500/10 text-green-400 border border-green-500/20',
  COMPLETED: 'bg-blue-500/10 text-blue-400 border border-blue-500/20',
};

export default function SprintsPage({ params }: { params: Promise<{ projectId: string }> }) {
  const [projectId, setProjectId] = useState('');
  const [sprints, setSprints] = useState<Sprint[]>([]);
  const [loading, setLoading] = useState(true);
  const [project, setProject] = useState<{ id: string; name: string; key: string } | null>(null);
  const [showCreate, setShowCreate] = useState(false);
  const [formName, setFormName] = useState('');
  const [formGoal, setFormGoal] = useState('');
  const [formStart, setFormStart] = useState('');
  const [formEnd, setFormEnd] = useState('');
  const [creating, setCreating] = useState(false);

  useEffect(() => { params.then(p => setProjectId(p.projectId)); }, [params]);

  const fetchSprints = () => {
    if (!projectId) return;
    Promise.all([
      fetch(`/api/projects/${projectId}`, { credentials: 'include' }).then(r => r.json()),
      fetch(`/api/projects/${projectId}/sprints`, { credentials: 'include' }).then(r => r.json()),
    ]).then(([pData, sData]) => {
      setProject(pData.data);
      setSprints(sData.data || []);
      setLoading(false);
    }).catch(() => setLoading(false));
  };

  useEffect(() => { fetchSprints(); }, [projectId]);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formName.trim()) return;
    setCreating(true);
    try {
      const res = await fetch(`/api/projects/${projectId}/sprints`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          name: formName.trim(),
          goal: formGoal.trim() || undefined,
          startDate: formStart || undefined,
          endDate: formEnd || undefined,
        }),
      });
      if (res.ok) {
        setShowCreate(false);
        setFormName(''); setFormGoal(''); setFormStart(''); setFormEnd('');
        fetchSprints();
      }
    } finally { setCreating(false); }
  };

  const updateStatus = async (sprintId: string, status: string) => {
    await fetch(`/api/projects/${projectId}/sprints/${sprintId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({ status }),
    });
    fetchSprints();
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

  return (
    <div className="flex min-h-screen bg-zinc-950">
      <ProjectSidebar project={project || undefined} />
      <div className="flex-1 lg:ml-64">
        <ProjectHeader projectName={project?.name} projectKey={project?.key} projectId={projectId} />
        <main className="p-4 sm:p-6 lg:p-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-xl font-bold text-white">Sprints</h1>
              <p className="text-gray-500 text-sm mt-1">{sprints.length} sprints total</p>
            </div>
            <button
              onClick={() => setShowCreate(true)}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium cursor-pointer"
            >
              New Sprint
            </button>
          </div>

          {sprints.length === 0 ? (
            <div className="text-center py-20">
              <h3 className="text-white text-lg font-medium mb-2">No sprints yet</h3>
              <p className="text-gray-500 text-sm mb-4">Create your first sprint to start planning work</p>
              <button onClick={() => setShowCreate(true)} className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm cursor-pointer">
                Create Sprint
              </button>
            </div>
          ) : (
            <div className="space-y-3">
              {sprints.map(sprint => (
                <div key={sprint.id} className="bg-zinc-900 border border-white/[0.06] rounded-xl p-5 flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-1">
                      <Link href={`/projects/${projectId}/sprints/${sprint.id}`} className="text-white font-medium hover:text-blue-400 transition-colors">
                        {sprint.name}
                      </Link>
                      <span className={`text-[10px] px-2 py-0.5 rounded-full ${STATUS_BADGES[sprint.status] || ''}`}>{sprint.status}</span>
                    </div>
                    {sprint.goal && <p className="text-gray-500 text-sm">{sprint.goal}</p>}
                    <div className="flex items-center gap-4 mt-2 text-xs text-gray-600">
                      <span>{sprint._count.tickets} tickets</span>
                      {sprint.startDate && <span>Start: {new Date(sprint.startDate).toLocaleDateString()}</span>}
                      {sprint.endDate && <span>End: {new Date(sprint.endDate).toLocaleDateString()}</span>}
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {sprint.status === 'PLANNING' && (
                      <button
                        onClick={() => updateStatus(sprint.id, 'ACTIVE')}
                        className="bg-green-600 hover:bg-green-700 text-white px-3 py-1.5 rounded-lg text-xs font-medium cursor-pointer"
                      >
                        Start
                      </button>
                    )}
                    {sprint.status === 'ACTIVE' && (
                      <button
                        onClick={() => updateStatus(sprint.id, 'COMPLETED')}
                        className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1.5 rounded-lg text-xs font-medium cursor-pointer"
                      >
                        Complete
                      </button>
                    )}
                    <Link
                      href={`/projects/${projectId}/sprints/${sprint.id}`}
                      className="text-gray-500 hover:text-white text-sm cursor-pointer px-3 py-1.5"
                    >
                      View
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </main>
      </div>

      {showCreate && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-zinc-900 border border-white/[0.06] rounded-2xl w-full max-w-lg shadow-2xl">
            <div className="flex items-center justify-between p-5 border-b border-white/[0.06]">
              <h2 className="text-lg font-semibold text-white">Create Sprint</h2>
              <button onClick={() => setShowCreate(false)} className="text-gray-400 hover:text-white cursor-pointer">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <form onSubmit={handleCreate} className="p-5 space-y-4">
              <div>
                <label className="text-sm text-gray-400 mb-1 block">Sprint Name *</label>
                <input
                  type="text" value={formName} onChange={e => setFormName(e.target.value)}
                  className="w-full bg-zinc-800 border border-white/[0.06] rounded-lg px-3 py-2 text-white text-sm outline-none focus:border-blue-500/50"
                  placeholder="Sprint 1" autoFocus
                />
              </div>
              <div>
                <label className="text-sm text-gray-400 mb-1 block">Goal</label>
                <textarea
                  value={formGoal} onChange={e => setFormGoal(e.target.value)}
                  className="w-full bg-zinc-800 border border-white/[0.06] rounded-lg px-3 py-2 text-white text-sm outline-none resize-none"
                  rows={2} placeholder="Sprint goal..."
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-sm text-gray-400 mb-1 block">Start Date</label>
                  <input type="date" value={formStart} onChange={e => setFormStart(e.target.value)}
                    className="w-full bg-zinc-800 border border-white/[0.06] rounded-lg px-3 py-2 text-white text-sm outline-none" />
                </div>
                <div>
                  <label className="text-sm text-gray-400 mb-1 block">End Date</label>
                  <input type="date" value={formEnd} onChange={e => setFormEnd(e.target.value)}
                    className="w-full bg-zinc-800 border border-white/[0.06] rounded-lg px-3 py-2 text-white text-sm outline-none" />
                </div>
              </div>
              <div className="flex justify-end gap-3 pt-2">
                <button type="button" onClick={() => setShowCreate(false)} className="px-4 py-2 text-sm text-gray-400 hover:text-white cursor-pointer">Cancel</button>
                <button type="submit" disabled={creating} className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-lg disabled:opacity-50 cursor-pointer">
                  {creating ? 'Creating...' : 'Create Sprint'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
