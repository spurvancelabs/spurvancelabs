'use client';

import { useState } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';

export default function CsvManagementPage() {
  const queryClient = useQueryClient();
  const [importResult, setImportResult] = useState<{ imported: number; skipped: number; errors: number } | null>(null);

  const { data: interviewersData } = useQuery({
    queryKey: ['admin-interviewers'],
    queryFn: async () => {
      const res = await fetch('/api/admin/interviewers');
      if (!res.ok) throw new Error('Failed to fetch');
      const json = await res.json();
      return json.interviewers || [];
    },
  });

  const handleImport = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setImportResult(null);
    const formData = new FormData();
    formData.append('file', file);
    try {
      const res = await fetch('/api/admin/applications/import', { method: 'POST', body: formData });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error);
      setImportResult({ imported: json.imported, skipped: json.skipped, errors: json.errors });
      toast.success(`Imported: ${json.imported}, Skipped: ${json.skipped}, Errors: ${json.errors}`);
      queryClient.invalidateQueries();
    } catch (err: any) {
      toast.error(err.message);
    }
    e.target.value = '';
  };

  const handleExport = async (type: string) => {
    try {
      const params = new URLSearchParams();
      if (type) params.set('type', type);
      const res = await fetch(`/api/admin/applications/export?${params}`);
      if (!res.ok) throw new Error('Export failed');
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `applications-${type || 'all'}-${new Date().toISOString().split('T')[0]}.csv`;
      a.click();
      URL.revokeObjectURL(url);
      toast.success('Exported successfully');
    } catch (err: any) {
      toast.error(err.message);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl sm:text-2xl font-bold text-white">CSV Import / Export</h1>
        <p className="text-gray-400 text-sm mt-0.5">Import or export applications data via CSV files</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* ─── IMPORT ─── */}
        <div className="bg-zinc-900/50 border border-white/[0.06] rounded-2xl p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v2a2 2 0 002 2h12a2 2 0 002-2v-2M7 10l5 5 5-5M12 15V3" /></svg>
            </div>
            <div>
              <h2 className="text-lg font-semibold text-white">Import CSV</h2>
              <p className="text-sm text-gray-400">Bulk import applications from a CSV file</p>
            </div>
          </div>

          <div className="bg-[#1a1a1a] border border-[#2a2a2a] rounded-xl p-4 mb-4">
            <h3 className="text-sm font-medium text-white mb-2">How it works</h3>
            <ol className="space-y-2 text-sm text-gray-400">
              <li className="flex items-start gap-2">
                <span className="text-blue-400 font-medium shrink-0">1.</span>
                <span>Prepare a CSV file with columns: <code className="text-white bg-black/30 px-1 rounded text-xs">Type</code>, <code className="text-white bg-black/30 px-1 rounded text-xs">Name</code>, <code className="text-white bg-black/30 px-1 rounded text-xs">Email</code>, <code className="text-white bg-black/30 px-1 rounded text-xs">Status</code>, <code className="text-white bg-black/30 px-1 rounded text-xs">Applied For</code>, <code className="text-white bg-black/30 px-1 rounded text-xs">Interviewer</code>, <code className="text-white bg-black/30 px-1 rounded text-xs">Interview Date</code>, <code className="text-white bg-black/30 px-1 rounded text-xs">Phone</code></span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-400 font-medium shrink-0">2.</span>
                <span>Set <code className="text-white bg-black/30 px-1 rounded text-xs">Type</code> to <strong className="text-white">job</strong> or <strong className="text-white">internship</strong>.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-400 font-medium shrink-0">3.</span>
                <span>Set <code className="text-white bg-black/30 px-1 rounded text-xs">Applied For</code> to the exact job or internship title (case-insensitive). If the title doesn&apos;t match, the application is imported without a posting link.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-400 font-medium shrink-0">4.</span>
                <span>Valid statuses: <code className="text-white bg-black/30 px-1 rounded text-xs">PENDING</code>, <code className="text-white bg-black/30 px-1 rounded text-xs">REVIEWED</code>, <code className="text-white bg-black/30 px-1 rounded text-xs">SHORTLISTED</code>, <code className="text-white bg-black/30 px-1 rounded text-xs">REJECTED</code>, <code className="text-white bg-black/30 px-1 rounded text-xs">ACCEPTED</code>. Defaults to <code className="text-white bg-black/30 px-1 rounded text-xs">PENDING</code> if invalid.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-400 font-medium shrink-0">5.</span>
                <span>Click the button below, select your CSV file, and the import will run automatically.</span>
              </li>
            </ol>
          </div>

          <label className="inline-flex items-center gap-2 px-4 py-2.5 bg-blue-500/10 border border-blue-500/30 rounded-xl text-sm text-blue-400 hover:bg-blue-500/20 hover:border-blue-400 transition-all cursor-pointer">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v2a2 2 0 002 2h12a2 2 0 002-2v-2M7 10l5 5 5-5M12 15V3" /></svg>
            Upload CSV File
            <input type="file" accept=".csv" className="hidden" onChange={handleImport} />
          </label>

          {importResult && (
            <div className="mt-4 flex gap-3 text-sm">
              <span className="text-green-400">Imported: {importResult.imported}</span>
              <span className="text-yellow-400">Skipped: {importResult.skipped}</span>
              <span className="text-red-400">Errors: {importResult.errors}</span>
            </div>
          )}

          <div className="mt-6 pt-4 border-t border-white/[0.06]">
            <h3 className="text-sm font-medium text-white mb-2">CSV Template</h3>
            <pre className="bg-black/30 rounded-lg p-3 text-xs text-gray-400 overflow-x-auto">
Type,Name,Email,Status,Applied For,Interviewer,Interview Date,Phone{'\n'}
job,John Doe,john@example.com,PENDING,Senior Frontend Engineer,,2026-07-15,+1234567890{'\n'}
internship,Jane Smith,jane@example.com,REVIEWED,Frontend Developer Intern,,,
            </pre>
          </div>
        </div>

        {/* ─── EXPORT ─── */}
        <div className="bg-zinc-900/50 border border-white/[0.06] rounded-2xl p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-xl bg-green-500/10 border border-green-500/20 flex items-center justify-center text-green-400">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3" /></svg>
            </div>
            <div>
              <h2 className="text-lg font-semibold text-white">Export CSV</h2>
              <p className="text-sm text-gray-400">Download applications data as CSV</p>
            </div>
          </div>

          <div className="bg-[#1a1a1a] border border-[#2a2a2a] rounded-xl p-4 mb-4">
            <h3 className="text-sm font-medium text-white mb-2">How it works</h3>
            <ol className="space-y-2 text-sm text-gray-400">
              <li className="flex items-start gap-2">
                <span className="text-green-400 font-medium shrink-0">1.</span>
                <span>Choose what to export — all applications, or filter by type.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-green-400 font-medium shrink-0">2.</span>
                <span>Click the <strong className="text-white">Export</strong> button to download a <code className="text-white bg-black/30 px-1 rounded text-xs">.csv</code> file.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-green-400 font-medium shrink-0">3.</span>
                <span>The CSV includes: ID, Type, Name, Email, Phone, Status, Applied For, Interviewer, Interview Date, Created At, Updated At.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-green-400 font-medium shrink-0">4.</span>
                <span>The exported file can be re-imported later or opened in any spreadsheet software.</span>
              </li>
            </ol>
          </div>

          <div className="space-y-3">
            <button
              onClick={() => handleExport('')}
              className="w-full flex items-center justify-between px-4 py-3 bg-[#1a1a1a] border border-[#2a2a2a] rounded-xl text-sm text-white hover:bg-white/[0.03] hover:border-gray-600 transition-all cursor-pointer"
            >
              <span className="flex items-center gap-2">
                <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" /></svg>
                All Applications
              </span>
              <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3" /></svg>
            </button>
            <button
              onClick={() => handleExport('job')}
              className="w-full flex items-center justify-between px-4 py-3 bg-[#1a1a1a] border border-[#2a2a2a] rounded-xl text-sm text-white hover:bg-white/[0.03] hover:border-gray-600 transition-all cursor-pointer"
            >
              <span className="flex items-center gap-2">
                <svg className="w-4 h-4 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.25 14.15v4.25c0 1.094-.787 2.036-1.872 2.18-2.087.277-4.216.42-6.378.42s-4.291-.143-6.378-.42c-1.085-.144-1.872-1.086-1.872-2.18v-4.25m16.5 0a2.18 2.18 0 00.75-1.661V8.706c0-1.081-.768-2.015-1.837-2.175a48.114 48.114 0 00-3.413-.387m4.5 8.006c-.194.165-.42.295-.673.38A23.978 23.978 0 0112 15.75c-2.648 0-5.195-.429-7.577-1.22a2.016 2.016 0 01-.673-.38m0 0A2.18 2.18 0 013 12.489V8.706c0-1.081.768-2.015 1.837-2.175a48.111 48.111 0 013.413-.387m7.5 0V5.25A2.25 2.25 0 0013.5 3h-3a2.25 2.25 0 00-2.25 2.25v.894m7.5 0a48.667 48.667 0 00-7.5 0M12 12.75h.008v.008H12v-.008z" /></svg>
                Job Applications Only
              </span>
              <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3" /></svg>
            </button>
            <button
              onClick={() => handleExport('internship')}
              className="w-full flex items-center justify-between px-4 py-3 bg-[#1a1a1a] border border-[#2a2a2a] rounded-xl text-sm text-white hover:bg-white/[0.03] hover:border-gray-600 transition-all cursor-pointer"
            >
              <span className="flex items-center gap-2">
                <svg className="w-4 h-4 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.26 10.147a60.438 60.438 0 0 0-.491 6.347A48.62 48.62 0 0 1 12 20.904a48.62 48.62 0 0 1 8.232-4.41 60.46 60.46 0 0 0-.491-6.347m-15.482 0a50.636 50.636 0 0 0-2.658-.813A59.906 59.906 0 0 1 12 3.493a59.903 59.903 0 0 1 10.399 5.84c-.896.248-1.783.52-2.658.814m-15.482 0A50.717 50.717 0 0 1 12 13.489a50.702 50.702 0 0 1 7.74-3.342" /></svg>
                Internship Applications Only
              </span>
              <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3" /></svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
