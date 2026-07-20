'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

interface UserInfo {
  name: string | null;
  email: string;
  image: string | null;
}

export default function ProjectHeader({
  projectName,
  projectKey,
  projectId,
  onSearch,
}: {
  projectName?: string;
  projectKey?: string;
  projectId?: string;
  onSearch?: (q: string) => void;
}) {
  const router = useRouter();
  const [user, setUser] = useState<UserInfo | null>(null);
  const [search, setSearch] = useState('');
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    fetch('/api/auth/me')
      .then(r => {
        if (!r.ok) { router.replace('/login'); return; }
        return r.json();
      })
      .then(d => { if (d) setUser(d); })
      .catch(() => { router.replace('/login'); });
  }, [router]);

  useEffect(() => {
    const t = setTimeout(() => onSearch?.(search), 300);
    return () => clearTimeout(t);
  }, [search, onSearch]);

  const initial = (user?.name || user?.email || '?')[0].toUpperCase();

  return (
    <header className="sticky top-0 z-30 bg-zinc-950/80 backdrop-blur-xl border-b border-white/[0.06]">
      <div className="flex items-center justify-between h-14 px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-3">
          <Link href="/projects" className="text-gray-400 hover:text-white text-sm transition-colors">
            Projects
          </Link>
          {projectName && (
            <>
              <span className="text-gray-600">/</span>
              <div className="flex items-center gap-2">
                {projectKey && (
                  <span className="text-xs font-mono bg-blue-500/10 text-blue-400 px-2 py-0.5 rounded">{projectKey}</span>
                )}
                <span className="text-white text-sm font-medium">{projectName}</span>
              </div>
            </>
          )}
        </div>

        <div className="flex items-center gap-3">
          {onSearch && (
            <div className="hidden sm:flex items-center bg-zinc-900 border border-white/[0.06] rounded-lg px-3 py-1.5">
              <svg className="w-4 h-4 text-gray-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
              </svg>
              <input
                type="text"
                placeholder="Search tickets..."
                value={search}
                onChange={e => setSearch(e.target.value)}
                className="bg-transparent text-sm text-white placeholder-gray-500 outline-none w-48"
              />
            </div>
          )}

          <div className="relative">
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="flex items-center gap-2 cursor-pointer"
            >
              <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center text-white text-sm font-medium">
                {user?.image ? (
                  <img src={user.image} alt="" className="w-8 h-8 rounded-full" />
                ) : (
                  initial
                )}
              </div>
            </button>
            {menuOpen && (
              <div className="absolute right-0 top-10 w-56 bg-zinc-900 border border-white/[0.06] rounded-xl shadow-2xl py-1 z-50">
                <div className="px-3 py-2 border-b border-white/[0.06]">
                  <p className="text-sm text-white font-medium">{user?.name || 'User'}</p>
                  <p className="text-xs text-gray-500">{user?.email}</p>
                </div>
                <button
                  onClick={() => { router.push('/dashboard'); setMenuOpen(false); }}
                  className="w-full text-left px-3 py-2 text-sm text-gray-400 hover:text-white hover:bg-white/5 cursor-pointer"
                >
                  Dashboard
                </button>
                <button
                  onClick={async () => {
                    await fetch('/api/auth/logout', { method: 'POST' });
                    router.push('/login');
                    setMenuOpen(false);
                  }}
                  className="w-full text-left px-3 py-2 text-sm text-red-400 hover:bg-red-500/5 cursor-pointer"
                >
                  Logout
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
