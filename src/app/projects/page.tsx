'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import ProjectSidebar from '@/components/projects/ProjectSidebar';
import ProjectHeader from '@/components/projects/ProjectHeader';
import CreateProjectModal from '@/components/projects/CreateProjectModal';
import EditProjectModal from '@/components/projects/EditProjectModal';
import { STATUS_COLORS } from '@/lib/projects/types';

interface Project {
  id: string;
  name: string;
  key: string;
  description: string | null;
  status: string;
  color: string | null;
  createdAt: string;
  owner: { id: string; name: string | null; email: string; image: string | null };
  _count: { members: number; tickets: number; sprints: number };
}

const STATUS_BADGES: Record<string, string> = {
  ACTIVE: 'bg-green-500/10 text-green-400 border-green-500/20',
  ON_HOLD: 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20',
  COMPLETED: 'bg-blue-500/10 text-blue-400 border-blue-500/20',
  ARCHIVED: 'bg-gray-500/10 text-gray-400 border-gray-500/20',
};

export default function ProjectsPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreate, setShowCreate] = useState(false);
  const [menuOpenId, setMenuOpenId] = useState<string | null>(null);
  const [editProject, setEditProject] = useState<Project | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<Project | null>(null);
  const [deleting, setDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState('');

  const fetchProjects = () => {
    fetch('/api/projects')
      .then(r => {
        if (!r.ok) { window.location.href = '/login'; return; }
        return r.json();
      })
      .then(data => {
        if (data) setProjects(data.data || []);
        setLoading(false);
      })
      .catch(() => { window.location.href = '/login'; });
  };

  useEffect(() => { fetchProjects(); }, []);

  const handleDelete = async () => {
    if (!deleteTarget) return;
    setDeleting(true);
    setDeleteError('');
    try {
      const res = await fetch(`/api/projects/${deleteTarget.id}`, {
        method: 'DELETE',
        credentials: 'include',
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        setDeleteError(data.error || 'Failed to delete project');
        setDeleting(false);
        return;
      }
      setProjects(prev => prev.filter(p => p.id !== deleteTarget.id));
      setDeleteTarget(null);
      setDeleting(false);
    } catch {
      setDeleteError('Something went wrong');
      setDeleting(false);
    }
  };

  return (
    <div className="flex min-h-screen bg-zinc-950">
      <ProjectSidebar />
      <div className="flex-1 lg:ml-64">
        <ProjectHeader />
        <main className="p-4 sm:p-6 lg:p-8">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-2xl font-bold text-white">Projects</h1>
              <p className="text-gray-400 text-sm mt-1">Manage your projects and track progress</p>
            </div>
            <button
              onClick={() => setShowCreate(true)}
              className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors cursor-pointer"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.5v15m7.5-7.5h-15" />
              </svg>
              New Project
            </button>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {[1, 2, 3].map(i => (
                <div key={i} className="bg-zinc-900 border border-white/[0.06] rounded-xl p-5 animate-pulse">
                  <div className="h-5 bg-zinc-800 rounded w-1/2 mb-3" />
                  <div className="h-3 bg-zinc-800 rounded w-3/4 mb-2" />
                  <div className="h-3 bg-zinc-800 rounded w-1/3" />
                </div>
              ))}
            </div>
          ) : projects.length === 0 ? (
            <div className="text-center py-20">
              <div className="w-16 h-16 bg-zinc-900 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M2.25 12.75V12A2.25 2.25 0 014.5 9.75h15A2.25 2.25 0 0121.75 12v.75m-8.69-6.44l-2.12-2.12a1.5 1.5 0 00-1.061-.44H4.5A2.25 2.25 0 002.25 6v12a2.25 2.25 0 002.25 2.25h15A2.25 2.25 0 0021.75 18V9a2.25 2.25 0 00-2.25-2.25h-5.379a1.5 1.5 0 01-1.06-.44z" />
                </svg>
              </div>
              <h3 className="text-white text-lg font-medium mb-2">No projects yet</h3>
              <p className="text-gray-400 text-sm mb-4">Create your first project to get started</p>
              <button
                onClick={() => setShowCreate(true)}
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors cursor-pointer"
              >
                Create Project
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {projects.map(project => (
                <div key={project.id} className="relative group">
                <Link
                  href={`/projects/${project.id}/board`}
                  className="block bg-zinc-900 border border-white/[0.06] rounded-xl p-5 hover:border-blue-500/30 transition-all"
                >
                  <div className="flex items-center gap-2 mb-3 pr-8">
                    <div
                      className="w-3 h-3 rounded-full shrink-0"
                      style={{ backgroundColor: project.color || '#6366f1' }}
                    />
                    <span className="text-xs font-mono text-gray-500">{project.key}</span>
                    <span className={`text-[10px] px-2 py-0.5 rounded-full border ${STATUS_BADGES[project.status] || STATUS_BADGES.ACTIVE}`}>
                      {project.status.replace('_', ' ')}
                    </span>
                  </div>
                  <h3 className="text-white font-medium group-hover:text-blue-400 transition-colors mb-1">
                    {project.name}
                  </h3>
                  {project.description && (
                    <p className="text-gray-500 text-xs line-clamp-2 mb-3">{project.description}</p>
                  )}
                  <div className="flex items-center gap-4 text-xs text-gray-500">
                    <span className="flex items-center gap-1">
                      <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z" />
                      </svg>
                      {project._count.members}
                    </span>
                    <span className="flex items-center gap-1">
                      <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h3.75M9 15h3.75M9 18h3.75m3 .75H18a2.25 2.25 0 002.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 00-1.123-.08m-5.801 0c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 00.75-.75 2.25 2.25 0 00-.1-.664m-5.8 0A2.251 2.251 0 0113.5 2.25H15c1.012 0 1.867.668 2.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V8.25m0 0H4.875c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V9.375c0-.621-.504-1.125-1.125-1.125H8.25zM6.75 12h.008v.008H6.75V12zm0 3h.008v.008H6.75V15zm0 3h.008v.008H6.75V18z" />
                      </svg>
                      {project._count.tickets}
                    </span>
                  </div>
                </Link>
                <div className="absolute top-3.5 right-3.5">
                  <button
                    type="button"
                    aria-label="Project actions"
                    onClick={() => setMenuOpenId(menuOpenId === project.id ? null : project.id)}
                    className="p-1.5 rounded-lg text-gray-500 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
                  >
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 6.5a1.5 1.5 0 110-3 1.5 1.5 0 010 3zm0 7a1.5 1.5 0 110-3 1.5 1.5 0 010 3zm0 7a1.5 1.5 0 110-3 1.5 1.5 0 010 3z" />
                    </svg>
                  </button>
                  {menuOpenId === project.id && (
                    <div className="absolute right-0 top-full mt-1 w-32 bg-zinc-800 border border-white/10 rounded-lg shadow-xl py-1 z-50">
                      <button
                        type="button"
                        onClick={() => { setEditProject(project); setMenuOpenId(null); }}
                        className="w-full flex items-center gap-2 px-3 py-1.5 text-sm text-gray-300 hover:text-white hover:bg-white/5 transition-colors cursor-pointer"
                      >
                        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931z" />
                        </svg>
                        Edit
                      </button>
                      <button
                        type="button"
                        onClick={() => { setDeleteTarget(project); setDeleteError(''); setMenuOpenId(null); }}
                        className="w-full flex items-center gap-2 px-3 py-1.5 text-sm text-red-400 hover:text-red-300 hover:bg-red-500/10 transition-colors cursor-pointer"
                      >
                        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
                        </svg>
                        Delete
                      </button>
                    </div>
                  )}
                </div>
                </div>
              ))}
            </div>
          )}
        </main>
      </div>
      {menuOpenId && (
        <div className="fixed inset-0 z-40" onClick={() => setMenuOpenId(null)} />
      )}
      {showCreate && (
        <CreateProjectModal
          onClose={() => setShowCreate(false)}
          onCreated={(p) => { setShowCreate(false); fetchProjects(); }}
        />
      )}
      {editProject && (
        <EditProjectModal
          project={editProject}
          onClose={() => setEditProject(null)}
          onUpdated={() => { setEditProject(null); fetchProjects(); }}
        />
      )}
      {deleteTarget && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-zinc-900 border border-white/[0.06] rounded-2xl w-full max-w-md shadow-2xl p-5">
            <h2 className="text-lg font-semibold text-white mb-2">Delete project</h2>
            <p className="text-sm text-gray-400 mb-4">
              Are you sure you want to delete <span className="text-white font-medium">{deleteTarget.name}</span>?
              This permanently removes the project and all its tickets, sprints and data. This action cannot be undone.
            </p>
            {deleteError && (
              <div className="bg-red-500/10 border border-red-500/20 text-red-400 text-sm px-4 py-2 rounded-lg mb-4">{deleteError}</div>
            )}
            <div className="flex justify-end gap-3">
              <button
                type="button"
                onClick={() => { setDeleteTarget(null); setDeleteError(''); }}
                disabled={deleting}
                className="px-4 py-2 text-sm text-gray-400 hover:text-white transition-colors cursor-pointer disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleDelete}
                disabled={deleting}
                className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white text-sm font-medium rounded-lg transition-colors disabled:opacity-50 cursor-pointer"
              >
                {deleting ? 'Deleting...' : 'Delete Project'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
