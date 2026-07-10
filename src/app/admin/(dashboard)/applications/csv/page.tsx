'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { canCreateContent } from '@/lib/lms/permissions';

export default function CsvManagementPage() {
  const [myRole, setMyRole] = useState<string>('');
  useEffect(() => {
    fetch('/api/auth/me').then(r => r.json()).then(d => { if (d?.role) setMyRole(d.role); }).catch(() => {});
  }, []);
  const queryClient = useQueryClient();
  const [importResult, setImportResult] = useState<{ imported: number; skipped: number; errors: number } | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isImporting, setIsImporting] = useState(false);

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
    setIsImporting(true);
    const formData = new FormData();
    formData.append('file', file);
    
    try {
      const res = await fetch('/api/admin/applications/import', { 
        method: 'POST', 
        body: formData 
      });
      const json = await res.json();
      
      if (!res.ok) throw new Error(json.error || 'Import failed');
      
      setImportResult({ 
        imported: json.imported || 0, 
        skipped: json.skipped || 0, 
        errors: json.errors || 0 
      });
      
      toast.success(`Imported: ${json.imported || 0}, Skipped: ${json.skipped || 0}, Errors: ${json.errors || 0}`);
      queryClient.invalidateQueries();
    } catch (err: any) {
      toast.error(err.message || 'Failed to import');
    } finally {
      setIsImporting(false);
      e.target.value = '';
    }
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
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      toast.success('Exported successfully');
    } catch (err: any) {
      toast.error(err.message);
    }
  };

  const handleFileDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    if (file && file.type === 'text/csv') {
      const input = document.getElementById('csv-upload') as HTMLInputElement;
      if (input) {
        const dataTransfer = new DataTransfer();
        dataTransfer.items.add(file);
        input.files = dataTransfer.files;
        input.dispatchEvent(new Event('change', { bubbles: true }));
      }
    } else {
      toast.error('Please upload a CSV file');
    }
  };

  const router = useRouter();

  useEffect(() => {
    if (!canCreateContent(myRole) && myRole) {
      router.push('/admin/dashboard');
    }
  }, [myRole, router]);

  if (!canCreateContent(myRole) && myRole) return null;

  return (
    <div className="space-y-6 px-4 sm:px-6 md:px-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-semibold text-white">CSV Management</h1>
          <p className="text-sm text-gray-400 mt-1">Import or export applications data via CSV files</p>
        </div>
        <div className="flex items-center gap-2 text-sm text-gray-400 bg-white/5 px-3 py-1.5 rounded-lg border border-white/10">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
          {interviewersData?.length || 0} Interviewers
        </div>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Import Section */}
        <div className="bg-white/5 border border-white/10 rounded-2xl p-6 hover:border-white/20 transition-colors">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-lg bg-white/10 flex items-center justify-center text-white/60">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v2a2 2 0 002 2h12a2 2 0 002-2v-2M7 10l5 5 5-5M12 15V3" />
              </svg>
            </div>
            <div>
              <h2 className="text-lg font-medium text-white">Import CSV</h2>
              <p className="text-sm text-gray-400">Bulk import applications</p>
            </div>
          </div>

          {/* Guide */}
          <div className="bg-black/30 border border-white/10 rounded-xl p-4 mb-6">
            <h3 className="text-sm font-medium text-white mb-3">How to import</h3>
            <ul className="space-y-2 text-sm text-gray-400">
              <li className="flex items-start gap-3">
                <span className="text-white/40 font-mono text-xs">1.</span>
                <span>Prepare CSV with: <span className="text-white/80 font-mono text-xs">Type</span>, <span className="text-white/80 font-mono text-xs">Name</span>, <span className="text-white/80 font-mono text-xs">Email</span>, <span className="text-white/80 font-mono text-xs">Status</span>, <span className="text-white/80 font-mono text-xs">Applied For</span></span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-white/40 font-mono text-xs">2.</span>
                <span>Set <span className="text-white/80 font-mono text-xs">Type</span> to <span className="text-white/80">job</span> or <span className="text-white/80">internship</span></span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-white/40 font-mono text-xs">3.</span>
                <span>Status: <span className="text-white/80">PENDING</span> · <span className="text-white/80">REVIEWED</span> · <span className="text-white/80">SHORTLISTED</span> · <span className="text-white/80">REJECTED</span> · <span className="text-white/80">ACCEPTED</span></span>
              </li>
            </ul>
          </div>

          {/* Drop Zone */}
          <div 
            className={`relative border-2 border-dashed rounded-xl p-8 text-center transition-colors cursor-pointer ${
              isDragging 
                ? 'border-white/40 bg-white/10' 
                : 'border-white/10 hover:border-white/30 hover:bg-white/5'
            }`}
            onDragEnter={() => setIsDragging(true)}
            onDragLeave={() => setIsDragging(false)}
            onDrop={handleFileDrop}
            onDragOver={(e) => e.preventDefault()}
            onClick={() => {
              const input = document.getElementById('csv-upload') as HTMLInputElement;
              if (input) input.click();
            }}
          >
            <input 
              id="csv-upload"
              type="file" 
              accept=".csv" 
              className="hidden" 
              onChange={handleImport}
              disabled={isImporting}
            />
            <div className="flex flex-col items-center gap-2">
              {isImporting ? (
                <>
                  <svg className="w-8 h-8 text-white/40 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                  </svg>
                  <p className="text-sm text-white/60">Importing...</p>
                </>
              ) : (
                <>
                  <svg className="w-8 h-8 text-white/30" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16v2a2 2 0 002 2h12a2 2 0 002-2v-2M7 10l5 5 5-5M12 15V3" />
                  </svg>
                  <p className="text-sm text-white/60">
                    {isDragging ? 'Drop your file here' : 'Drop your CSV file here or click to browse'}
                  </p>
                </>
              )}
            </div>
          </div>

          {/* Results */}
          {importResult && (
            <div className="mt-4 grid grid-cols-3 gap-3">
              <div className="text-center p-3 rounded-lg bg-white/5 border border-white/10">
                <p className="text-lg font-medium text-white">{importResult.imported}</p>
                <p className="text-xs text-gray-500">Imported</p>
              </div>
              <div className="text-center p-3 rounded-lg bg-white/5 border border-white/10">
                <p className="text-lg font-medium text-white">{importResult.skipped}</p>
                <p className="text-xs text-gray-500">Skipped</p>
              </div>
              <div className="text-center p-3 rounded-lg bg-white/5 border border-white/10">
                <p className="text-lg font-medium text-white">{importResult.errors}</p>
                <p className="text-xs text-gray-500">Errors</p>
              </div>
            </div>
          )}

          {/* Template */}
          <div className="mt-4 pt-4 border-t border-white/10">
            <h3 className="text-sm font-medium text-white mb-2">CSV Template</h3>
            <div className="bg-black/40 rounded-lg p-3 overflow-x-auto">
              <pre className="text-xs text-white/60 font-mono whitespace-pre-wrap">
Type,Name,Email,Status,Applied For{'\n'}
job,John Doe,john@example.com,PENDING,Senior Engineer{'\n'}
internship,Jane Smith,jane@example.com,REVIEWED,Frontend Intern
              </pre>
            </div>
          </div>
        </div>

        {/* Export Section */}
        <div className="bg-white/5 border border-white/10 rounded-2xl p-6 hover:border-white/20 transition-colors">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-lg bg-white/10 flex items-center justify-center text-white/60">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3" />
              </svg>
            </div>
            <div>
              <h2 className="text-lg font-medium text-white">Export CSV</h2>
              <p className="text-sm text-gray-400">Download applications data</p>
            </div>
          </div>

          {/* Guide */}
          <div className="bg-black/30 border border-white/10 rounded-xl p-4 mb-6">
            <h3 className="text-sm font-medium text-white mb-3">How to export</h3>
            <ul className="space-y-2 text-sm text-gray-400">
              <li className="flex items-start gap-3">
                <span className="text-white/40 font-mono text-xs">1.</span>
                <span>Select the data you want to export</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-white/40 font-mono text-xs">2.</span>
                <span>Click Export to download a <span className="text-white/80 font-mono text-xs">.csv</span> file</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-white/40 font-mono text-xs">3.</span>
                <span>File includes all application data</span>
              </li>
            </ul>
          </div>

          {/* Export Buttons */}
          <div className="space-y-2">
            <button
              onClick={() => handleExport('')}
              className="w-full flex items-center justify-between px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-sm text-white hover:bg-white/10 hover:border-white/20 transition-colors group"
            >
              <span className="flex items-center gap-3">
                <svg className="w-4 h-4 text-white/40" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
                </svg>
                All Applications
              </span>
              <span className="text-white/40 group-hover:text-white/60 transition-colors text-sm">Export →</span>
            </button>

            <button
              onClick={() => handleExport('job')}
              className="w-full flex items-center justify-between px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-sm text-white hover:bg-white/10 hover:border-white/20 transition-colors group"
            >
              <span className="flex items-center gap-3">
                <svg className="w-4 h-4 text-white/40" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.25 14.15v4.25c0 1.094-.787 2.036-1.872 2.18-2.087.277-4.216.42-6.378.42s-4.291-.143-6.378-.42c-1.085-.144-1.872-1.086-1.872-2.18v-4.25m16.5 0a2.18 2.18 0 00.75-1.661V8.706c0-1.081-.768-2.015-1.837-2.175a48.114 48.114 0 00-3.413-.387m4.5 8.006c-.194.165-.42.295-.673.38A23.978 23.978 0 0112 15.75c-2.648 0-5.195-.429-7.577-1.22a2.016 2.016 0 01-.673-.38m0 0A2.18 2.18 0 013 12.489V8.706c0-1.081.768-2.015 1.837-2.175a48.111 48.111 0 013.413-.387m7.5 0V5.25A2.25 2.25 0 0013.5 3h-3a2.25 2.25 0 00-2.25 2.25v.894m7.5 0a48.667 48.667 0 00-7.5 0M12 12.75h.008v.008H12v-.008z" />
                </svg>
                Job Applications
              </span>
              <span className="text-white/40 group-hover:text-white/60 transition-colors text-sm">Export →</span>
            </button>

            <button
              onClick={() => handleExport('internship')}
              className="w-full flex items-center justify-between px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-sm text-white hover:bg-white/10 hover:border-white/20 transition-colors group"
            >
              <span className="flex items-center gap-3">
                <svg className="w-4 h-4 text-white/40" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.26 10.147a60.438 60.438 0 0 0-.491 6.347A48.62 48.62 0 0 1 12 20.904a48.62 48.62 0 0 1 8.232-4.41 60.46 60.46 0 0 0-.491-6.347m-15.482 0a50.636 50.636 0 0 0-2.658-.813A59.906 59.906 0 0 1 12 3.493a59.903 59.903 0 0 1 10.399 5.84c-.896.248-1.783.52-2.658.814m-15.482 0A50.717 50.717 0 0 1 12 13.489a50.702 50.702 0 0 1 7.74-3.342" />
                </svg>
                Internship Applications
              </span>
              <span className="text-white/40 group-hover:text-white/60 transition-colors text-sm">Export →</span>
            </button>
          </div>

          {/* Stats */}
          <div className="mt-4 pt-4 border-t border-white/10">
            <div className="grid grid-cols-3 gap-3">
              <div className="text-center">
                <p className="text-sm font-medium text-white">CSV</p>
                <p className="text-xs text-gray-500">Format</p>
              </div>
              <div className="text-center">
                <p className="text-sm font-medium text-white">11</p>
                <p className="text-xs text-gray-500">Columns</p>
              </div>
              <div className="text-center">
                <p className="text-sm font-medium text-white">All</p>
                <p className="text-xs text-gray-500">Data</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}