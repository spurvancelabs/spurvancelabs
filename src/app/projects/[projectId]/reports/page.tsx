'use client';

import { useState, useEffect } from 'react';
import ProjectSidebar from '@/components/projects/ProjectSidebar';
import ProjectHeader from '@/components/projects/ProjectHeader';
import BurndownChart from '@/components/projects/BurndownChart';
import VelocityChart from '@/components/projects/VelocityChart';

interface Sprint { id: string; name: string; status: string; }

export default function ReportsPage({ params }: { params: Promise<{ projectId: string }> }) {
  const [projectId, setProjectId] = useState('');
  const [project, setProject] = useState<{ id: string; name: string; key: string } | null>(null);
  const [sprints, setSprints] = useState<Sprint[]>([]);
  const [selectedSprint, setSelectedSprint] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => { params.then(p => setProjectId(p.projectId)); }, [params]);

  useEffect(() => {
    if (!projectId) return;
    Promise.all([
      fetch(`/api/projects/${projectId}`, { credentials: 'include' }).then(r => r.json()),
      fetch(`/api/projects/${projectId}/sprints`, { credentials: 'include' }).then(r => r.json()),
    ]).then(([pData, sData]) => {
      setProject(pData.data);
      const sprintsList = sData.data || [];
      setSprints(sprintsList);
      const active = sprintsList.find((s: Sprint) => s.status === 'ACTIVE');
      if (active) setSelectedSprint(active.id);
      setLoading(false);
    }).catch(() => setLoading(false));
  }, [projectId]);

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
          <h1 className="text-xl font-bold text-white mb-6">Reports</h1>

          <div className="bg-zinc-900 border border-white/[0.06] rounded-xl p-6 mb-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-white">Burndown Chart</h2>
              <select
                value={selectedSprint}
                onChange={e => setSelectedSprint(e.target.value)}
                className="bg-zinc-800 border border-white/[0.06] rounded-lg px-3 py-2 text-white text-sm outline-none"
              >
                <option value="">Select Sprint</option>
                {sprints.map(s => (
                  <option key={s.id} value={s.id}>{s.name} ({s.status})</option>
                ))}
              </select>
            </div>
            {selectedSprint ? (
              <BurndownChart projectId={projectId} sprintId={selectedSprint} />
            ) : (
              <p className="text-gray-600 text-sm text-center py-8">Select a sprint to view burndown</p>
            )}
          </div>

          <div className="bg-zinc-900 border border-white/[0.06] rounded-xl p-6">
            <h2 className="text-lg font-semibold text-white mb-4">Velocity Chart</h2>
            <VelocityChart projectId={projectId} />
          </div>
        </main>
      </div>
    </div>
  );
}
