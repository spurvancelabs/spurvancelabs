'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function CreateProjectModal({
  onClose,
  onCreated,
}: {
  onClose: () => void;
  onCreated?: (project: { id: string }) => void;
}) {
  const router = useRouter();
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [key, setKey] = useState('');
  const [color, setColor] = useState('#6366f1');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const generateKey = (n: string) => {
    return n
      .replace(/[^a-zA-Z0-9\s]/g, '')
      .split(/\s+/)
      .map(w => w[0])
      .join('')
      .toUpperCase()
      .slice(0, 5);
  };

  const handleNameChange = (v: string) => {
    setName(v);
    if (!key || key === generateKey(name)) {
      setKey(generateKey(v));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !key.trim()) {
      setError('Name and key are required');
      return;
    }
    setLoading(true);
    setError('');
    try {
      const res = await fetch('/api/projects', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ name: name.trim(), description: description.trim(), key: key.trim().toUpperCase(), color }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || 'Failed to create project');
        setLoading(false);
        return;
      }
      onCreated?.(data.data);
    } catch {
      setError('Something went wrong');
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-zinc-900 border border-white/[0.06] rounded-2xl w-full max-w-lg shadow-2xl">
        <div className="flex items-center justify-between p-5 border-b border-white/[0.06]">
          <h2 className="text-lg font-semibold text-white">Create Project</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-white cursor-pointer">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        <form onSubmit={handleSubmit} className="p-5 space-y-4">
          {error && (
            <div className="bg-red-500/10 border border-red-500/20 text-red-400 text-sm px-4 py-2 rounded-lg">{error}</div>
          )}
          <div>
            <label className="block text-sm text-gray-400 mb-1.5">Project Name *</label>
            <input
              type="text"
              value={name}
              onChange={e => handleNameChange(e.target.value)}
              className="w-full bg-zinc-800 border border-white/[0.06] rounded-lg px-3 py-2 text-white text-sm outline-none focus:border-blue-500/50"
              placeholder="My Awesome Project"
              autoFocus
            />
          </div>
          <div>
            <label className="block text-sm text-gray-400 mb-1.5">Project Key *</label>
            <input
              type="text"
              value={key}
              onChange={e => setKey(e.target.value.toUpperCase().slice(0, 10))}
              className="w-full bg-zinc-800 border border-white/[0.06] rounded-lg px-3 py-2 text-white text-sm font-mono outline-none focus:border-blue-500/50"
              placeholder="MAP"
              maxLength={10}
            />
            <p className="text-[11px] text-gray-600 mt-1">Used as ticket prefix (e.g., {key || 'MAP'}-1)</p>
          </div>
          <div>
            <label className="block text-sm text-gray-400 mb-1.5">Description</label>
            <textarea
              value={description}
              onChange={e => setDescription(e.target.value)}
              className="w-full bg-zinc-800 border border-white/[0.06] rounded-lg px-3 py-2 text-white text-sm outline-none focus:border-blue-500/50 resize-none"
              rows={3}
              placeholder="Optional project description..."
            />
          </div>
          <div>
            <label className="block text-sm text-gray-400 mb-1.5">Color</label>
            <div className="flex items-center gap-2">
              <input
                type="color"
                value={color}
                onChange={e => setColor(e.target.value)}
                className="w-8 h-8 rounded-lg border border-white/[0.06] cursor-pointer bg-transparent"
              />
              <span className="text-xs text-gray-500">{color}</span>
            </div>
          </div>
          <div className="flex justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm text-gray-400 hover:text-white transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-lg transition-colors disabled:opacity-50 cursor-pointer"
            >
              {loading ? 'Creating...' : 'Create Project'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
