'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import ProjectSidebar from '@/components/projects/ProjectSidebar';
import ProjectHeader from '@/components/projects/ProjectHeader';

interface Activity {
  id: string;
  action: string;
  field: string | null;
  oldValue: string | null;
  newValue: string | null;
  createdAt: string;
  user: { id: string; name: string | null; email: string } | null;
  ticket: { id: string; key: string; title: string; status: string };
}

const ACTION_LABELS: Record<string, string> = {
  CREATED: 'created',
  UPDATED: 'updated',
  COMMENTED: 'commented on',
  COMMENT_DELETED: 'deleted a comment on',
  ATTACHMENT_ADDED: 'added an attachment to',
  ATTACHMENT_REMOVED: 'removed an attachment from',
  TIME_LOGGED: 'logged time on',
  STATUS_CHANGED: 'changed the status of',
};

export default function ProjectActivityPage({ params }: { params: Promise<{ projectId: string }> }) {
  const [projectId, setProjectId] = useState('');
  const [activities, setActivities] = useState<Activity[]>([]);
  const [loading, setLoading] = useState(true);
  const [project, setProject] = useState<{ id: string; name: string; key: string } | null>(null);

  useEffect(() => {
    params.then(p => setProjectId(p.projectId));
  }, [params]);

  useEffect(() => {
    if (!projectId) return;

    const load = async () => {
      try {
        const [pRes, aRes] = await Promise.all([
          fetch(`/api/projects/${projectId}`, { credentials: 'include' }),
          fetch(`/api/projects/${projectId}/activities?limit=50`, { credentials: 'include' }),
        ]);
        const pData = await pRes.json();
        const aData = await aRes.json();
        setProject(pData.data);
        setActivities(aData.data || []);
      } catch {} finally {
        setLoading(false);
      }
    };

    load();
    const interval = setInterval(load, 10000);
    const onFocus = () => load();
    window.addEventListener('focus', onFocus);
    return () => {
      clearInterval(interval);
      window.removeEventListener('focus', onFocus);
    };
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
        <main className="p-4 sm:p-6 lg:p-8 max-w-3xl">
          <div className="mb-6">
            <h1 className="text-xl font-bold text-white">Activity Feed</h1>
            <p className="text-gray-500 text-sm mt-1">Recent changes across all tickets in this project</p>
          </div>

          {activities.length === 0 ? (
            <div className="bg-zinc-900 border border-white/[0.06] rounded-xl py-12 text-center">
              <p className="text-gray-600 text-sm">No activity yet</p>
            </div>
          ) : (
            <div className="relative">
              <div className="absolute left-[7px] top-2 bottom-2 w-px bg-white/[0.06]" />
              <div className="space-y-1">
                {activities.map(a => (
                  <Link
                    key={a.id}
                    href={`/projects/${projectId}/board`}
                    className="relative flex items-start gap-4 py-3 px-2 rounded-lg hover:bg-white/[0.02] transition-colors group"
                  >
                    <div className="w-[15px] h-[15px] rounded-full bg-blue-500/20 border-2 border-blue-500 shrink-0 mt-0.5 z-10" />
                    <div className="min-w-0 flex-1">
                      <p className="text-sm text-gray-300">
                        <span className="text-white font-medium">{a.user?.name || a.user?.email || 'Someone'}</span>{' '}
                        <span className="text-gray-500">{ACTION_LABELS[a.action] || a.action.replace('_', ' ')}</span>{' '}
                        <span className="font-mono text-xs text-blue-400 group-hover:text-blue-300">{a.ticket.key}</span>{' '}
                        <span className="text-gray-300">{a.ticket.title}</span>
                      </p>
                      {a.field && (
                        <p className="text-xs text-gray-500 mt-0.5">
                          {a.field.replace('_', ' ')}
                          {a.oldValue && a.newValue && (
                            <>: <span className="text-red-400">{a.oldValue}</span> → <span className="text-emerald-400">{a.newValue}</span></>
                          )}
                        </p>
                      )}
                      <p className="text-[11px] text-gray-600 mt-1">
                        {new Date(a.createdAt).toLocaleString()}
                      </p>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
