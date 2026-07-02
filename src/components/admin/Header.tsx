'use client';

import { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';

interface SearchResult {
  id: string;
  title: string;
  type: 'job' | 'internship' | 'application';
}

const typeConfig = {
  job: { label: 'Jobs', color: 'text-blue-400', bg: 'bg-blue-500/10', href: (id: string) => `/admin/jobs/${id}` },
  internship: { label: 'Internships', color: 'text-purple-400', bg: 'bg-purple-500/10', href: (id: string) => `/admin/internships/${id}` },
  application: { label: 'Applications', color: 'text-emerald-400', bg: 'bg-emerald-500/10', href: (id: string) => `/admin/applications` },
};

export default function Header() {
  const router = useRouter();
  const [search, setSearch] = useState('');
  const [results, setResults] = useState<SearchResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const [showMobileSearch, setShowMobileSearch] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const debounceRef = useRef<NodeJS.Timeout>(undefined);

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(e.target as Node)) {
        setShowResults(false);
      }
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setShowResults(false);
        inputRef.current?.blur();
      }
    };
    document.addEventListener('keydown', handleKey);
    return () => document.removeEventListener('keydown', handleKey);
  }, []);

  const doSearch = async (q: string) => {
    if (!q.trim()) {
      setResults([]);
      setShowResults(false);
      return;
    }
    setLoading(true);
    setShowResults(true);
    try {
      const res = await fetch(`/api/admin/search?q=${encodeURIComponent(q.trim())}`);
      const data = await res.json();
      setResults(data.results || []);
    } catch {
      setResults([]);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (value: string) => {
    setSearch(value);
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => doSearch(value), 300);
  };

  const handleSelect = (item: SearchResult) => {
    setShowResults(false);
    setSearch('');
    const config = typeConfig[item.type];
    router.push(config.href(item.id));
  };

  const handleLogout = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' });
      toast.success('Logged out successfully');
      router.push('/login');
    } catch {
      toast.error('Logout failed');
    }
  };

  const grouped = results.reduce((acc, item) => {
    if (!acc[item.type]) acc[item.type] = [];
    acc[item.type].push(item);
    return acc;
  }, {} as Record<string, SearchResult[]>);

  return (
    <header className="sticky top-0 z-20 bg-zinc-950/80 backdrop-blur-xl border-b border-white/[0.06]">
        <div className="flex items-center justify-between h-16 px-4 sm:px-6 lg:px-8 pl-14 sm:pl-16">
        <div ref={searchRef} className="hidden sm:block relative max-w-md w-full">
          <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
          </svg>
          <input
            ref={inputRef}
            type="text"
            value={search}
            onChange={e => handleChange(e.target.value)}
            onFocus={() => { if (results.length || loading) setShowResults(true); }}
            placeholder="Search jobs, internships, applications..."
            className="w-full max-w-xs bg-white/[0.04] border border-white/[0.08] rounded-lg pl-10 pr-10 py-2 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-blue-500/50 focus:bg-white/[0.06] transition-all"
          />
          {loading && (
            <div className="absolute right-3 top-1/2 -translate-y-1/2">
              <div className="w-4 h-4 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
            </div>
          )}

          {showResults && (results.length > 0 || loading) && (
            <div className="absolute left-0 right-0 top-full mt-2 bg-zinc-900 border border-white/[0.08] rounded-xl shadow-2xl z-50 py-2 max-h-80 overflow-y-auto">
              {Object.entries(grouped).map(([type, items]) => (
                <div key={type}>
                  <p className={`px-4 py-1.5 text-[10px] font-semibold uppercase tracking-widest ${typeConfig[type as keyof typeof typeConfig]?.color || 'text-gray-500'}`}>
                    {typeConfig[type as keyof typeof typeConfig]?.label || type}
                  </p>
                  {items.map((item) => (
                    <button
                      key={`${item.type}-${item.id}`}
                      onClick={() => handleSelect(item)}
                      className="flex items-center gap-3 w-full px-4 py-2 text-sm text-gray-300 hover:bg-white/5 transition-all text-left"
                    >
                      <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${typeConfig[item.type]?.bg || 'bg-gray-500'}`} />
                      <span className="flex-1 truncate">{item.title}</span>
                      <span className={`text-[10px] px-1.5 py-0.5 rounded ${typeConfig[item.type]?.bg || ''} ${typeConfig[item.type]?.color || ''}`}>
                        {typeConfig[item.type]?.label || item.type}
                      </span>
                    </button>
                  ))}
                </div>
              ))}
            </div>
          )}

          {showResults && search.trim() && !loading && results.length === 0 && (
            <div className="absolute left-0 right-0 top-full mt-2 bg-zinc-900 border border-white/[0.08] rounded-xl shadow-2xl z-50 py-6 text-center">
              <p className="text-gray-500 text-sm">No results found for &quot;{search}&quot;</p>
            </div>
          )}
        </div>

        <button
          onClick={() => setShowMobileSearch(true)}
          className="sm:hidden p-2 rounded-lg text-gray-400 hover:text-white hover:bg-white/5 transition-all"
          aria-label="Search"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
          </svg>
        </button>

        <div className="flex items-center gap-3 ml-auto">
          <button className="relative p-2 cursor-pointer rounded-lg text-gray-400 hover:text-white hover:bg-white/5 transition-all">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M14.857 17.082a23.848 23.848 0 005.454-1.31A8.967 8.967 0 0118 9.75v-.7V9A6 6 0 006 9v.75a8.967 8.967 0 01-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 01-5.714 0m5.714 0a3 3 0 11-5.714 0" />
            </svg>
            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-blue-500 rounded-full" />
          </button>

          <div className="relative">
            <button
              onClick={() => setShowProfile(!showProfile)}
              className="flex items-center cursor-pointer gap-2 p-1.5 rounded-lg hover:bg-white/5 transition-all"
            >
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white text-xs font-semibold">
                A
              </div>
              <div className="hidden sm:block text-left ">
                <p className="text-white text-xs font-medium leading-tight">Admin</p>
                <p className="text-gray-500 text-[10px] leading-tight">admin@spurvance.com</p>
              </div>
            </button>

            {showProfile && (
              <>
                <div className="fixed inset-0 z-40" onClick={() => setShowProfile(false)} />
                <div className="absolute right-0 top-full mt-2 w-48 bg-zinc-900 border border-white/[0.08] rounded-xl shadow-xl z-50 py-1.5">
                  <div className="px-4 py-2 border-b border-white/[0.06] mb-1">
                    <p className="text-white text-sm font-medium">Admin</p>
                    <p className="text-gray-500 text-xs">admin@spurvance.com</p>
                  </div>
                  <button
                    onClick={handleLogout}
                    className="flex cursor-pointer items-center gap-2 w-full px-4 py-2 text-sm text-red-400 hover:bg-white/5 transition-all"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15m3 0l3-3m0 0l-3-3m3 3H9" />
                    </svg>
                    Logout
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
      {showMobileSearch && (
        <div className="fixed inset-0 z-50 sm:hidden bg-zinc-950/95 backdrop-blur-xl">
          <div className="p-4 border-b border-white/[0.06]">
            <div className="flex items-center gap-3">
              <div className="relative flex-1">
                <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
                </svg>
                <input
                  ref={inputRef}
                  type="text"
                  value={search}
                  onChange={e => handleChange(e.target.value)}
                  onFocus={() => { if (results.length || loading) setShowResults(true); }}
                  placeholder="Search jobs, internships, applications..."
                  className="w-full bg-white/[0.04] border border-white/[0.08] rounded-lg pl-10 pr-4 py-2.5 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-blue-500/50 focus:bg-white/[0.06] transition-all"
                  autoFocus
                />
                {loading && (
                  <div className="absolute right-3 top-1/2 -translate-y-1/2">
                    <div className="w-4 h-4 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
                  </div>
                )}
              </div>
              <button
                onClick={() => { setShowMobileSearch(false); setSearch(''); setResults([]); setShowResults(false); }}
                className="text-sm text-gray-400 hover:text-white whitespace-nowrap"
              >
                Cancel
              </button>
            </div>
            {showResults && (results.length > 0 || loading) && (
              <div className="mt-2 max-h-80 overflow-y-auto">
                {Object.entries(grouped).map(([type, items]) => (
                  <div key={type}>
                    <p className={`px-2 py-1.5 text-[10px] font-semibold uppercase tracking-widest ${typeConfig[type as keyof typeof typeConfig]?.color || 'text-gray-500'}`}>
                      {typeConfig[type as keyof typeof typeConfig]?.label || type}
                    </p>
                    {items.map((item) => (
                      <button
                        key={`${item.type}-${item.id}`}
                        onClick={() => { handleSelect(item); setShowMobileSearch(false); }}
                        className="flex items-center gap-3 w-full px-2 py-2 text-sm text-gray-300 hover:bg-white/5 transition-all text-left rounded-lg"
                      >
                        <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${typeConfig[item.type]?.bg || 'bg-gray-500'}`} />
                        <span className="flex-1 truncate">{item.title}</span>
                        <span className={`text-[10px] px-1.5 py-0.5 rounded ${typeConfig[item.type]?.bg || ''} ${typeConfig[item.type]?.color || ''}`}>
                          {typeConfig[item.type]?.label || item.type}
                        </span>
                      </button>
                    ))}
                  </div>
                ))}
              </div>
            )}
            {showResults && search.trim() && !loading && results.length === 0 && (
              <div className="mt-2 py-6 text-center">
                <p className="text-gray-500 text-sm">No results found for &quot;{search}&quot;</p>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
