'use client';

import { useState, useEffect } from 'react';
import { useParams, useSearchParams, useRouter } from 'next/navigation';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import Link from 'next/link';
import toast from 'react-hot-toast';
import ApplicationStatusBadge from '@/components/admin/ApplicationStatusBadge';
import { canEditContent, canDeleteContent } from '@/lib/lms/permissions';

const statusOptions = ['PENDING', 'REVIEWED', 'SHORTLISTED', 'REJECTED', 'ACCEPTED'];

export default function ApplicationDetailPage() {
  const params = useParams();
  const searchParams = useSearchParams();
  const router = useRouter();
  const queryClient = useQueryClient();
  const id = params.id as string;
  const type = searchParams.get('type') || 'job';
  const [myRole, setMyRole] = useState<string>('');
  useEffect(() => {
    fetch('/api/auth/me').then(r => r.json()).then(d => { if (d?.role) setMyRole(d.role); }).catch(() => {});
  }, []);

  const { data, isLoading } = useQuery({
    queryKey: ['admin-application-detail', id, type],
    queryFn: async () => {
      const res = await fetch(`/api/admin/applications/${id}?type=${type}`);
      if (!res.ok) throw new Error('Failed to fetch');
      const json = await res.json();
      return json.application;
    },
  });

  const { data: interviewersData } = useQuery({
    queryKey: ['admin-interviewers'],
    queryFn: async () => {
      const res = await fetch('/api/admin/interviewers');
      if (!res.ok) throw new Error('Failed to fetch');
      const json = await res.json();
      return json.interviewers || [];
    },
  });

  const navigateEdit = () => router.push(`/admin/applications/${id}/edit?type=${type}`);

  const interviewers = interviewersData || [];

  const statusMutation = useMutation({
    mutationFn: async ({ status }: { status: string }) => {
      const res = await fetch(`/api/admin/applications/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status, type }),
      });
      if (!res.ok) throw new Error('Failed to update');
    },
    onSuccess: () => {
      toast.success('Status updated');
      queryClient.invalidateQueries({ queryKey: ['admin-application-detail', id, type] });
    },
    onError: (err: Error) => toast.error(err.message),
  });

  const interviewMutation = useMutation({
    mutationFn: async ({ interviewer_name, interview_date }: { interviewer_name?: string; interview_date?: string }) => {
      const res = await fetch(`/api/admin/applications/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ interviewer_name, interview_date, type }),
      });
      if (!res.ok) throw new Error('Failed to update');
    },
    onSuccess: () => {
      toast.success('Interview updated');
      queryClient.invalidateQueries({ queryKey: ['admin-application-detail', id, type] });
    },
    onError: (err: Error) => toast.error(err.message),
  });

  const feedbackMutation = useMutation({
    mutationFn: async ({ interviewer_feedback }: { interviewer_feedback: string }) => {
      const res = await fetch(`/api/admin/applications/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ interviewer_feedback, type }),
      });
      if (!res.ok) throw new Error('Failed to update feedback');
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-application-detail', id, type] });
    },
    onError: (err: Error) => toast.error(err.message),
  });

  const deleteMutation = useMutation({
    mutationFn: async () => {
      const res = await fetch(`/api/admin/applications/${id}?type=${type}`, { method: 'DELETE' });
      if (!res.ok) throw new Error('Failed to delete');
    },
    onSuccess: () => {
      toast.success('Application deleted');
      router.back();
    },
    onError: (err: Error) => toast.error(err.message),
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!data) {
    return (
      <div className="text-center py-16">
        <p className="text-gray-500">Application not found.</p>
        <Link href="/admin/applications" className="text-blue-400 text-sm mt-2 inline-block hover:underline">Back to applications</Link>
      </div>
    );
  }

  const app = data;
  const isJob = app.applicationType === 'job';

  const fields = isJob
    ? [
        { label: 'Name', key: 'name' },
        { label: 'Email', key: 'email' },
        { label: 'Phone', key: 'phone' },
        { label: 'Current Company', key: 'current_company' },
        { label: 'Current Position', key: 'current_position' },
        { label: 'Years of Experience', key: 'years_of_experience' },
        { label: 'LinkedIn', key: 'linkedin_url', href: true },
        { label: 'Portfolio', key: 'portfolio_url', href: true },
        { label: 'Salary Expectation', key: 'salary_expectation' },
        { label: 'Start Date', key: 'start_date' },
        { label: 'Work Authorization', key: 'work_authorization' },
        { label: 'Referral Source', key: 'referral_source' },
        { label: 'Cover Letter', key: 'cover_letter', long: true },
        { label: 'Additional Info', key: 'additional_info', long: true },
      ]
    : [
        { label: 'Name', key: 'name' },
        { label: 'Email', key: 'email' },
        { label: 'Phone', key: 'phone' },
        { label: 'University', key: 'university' },
        { label: 'Major', key: 'major' },
        { label: 'Year of Study', key: 'year_of_study' },
        { label: 'Graduation Date', key: 'graduation_date' },
        { label: 'GPA', key: 'gpa' },
        { label: 'LinkedIn', key: 'linkedin_url', href: true },
        { label: 'GitHub', key: 'github_url', href: true },
        { label: 'Available Start Date', key: 'available_start_date' },
        { label: 'Availability Duration', key: 'availability_duration' },
        { label: 'Work Authorization', key: 'work_authorization' },
        { label: 'Referral Source', key: 'referral_source' },
        { label: 'Cover Letter', key: 'cover_letter', long: true },
        { label: 'Additional Info', key: 'additional_info', long: true },
      ];

  return (
    <div className="space-y-6">
      {/* Back + Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button onClick={() => router.back()} className="p-2 text-gray-400 hover:text-white hover:bg-white/5 rounded-lg transition-all cursor-pointer">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" /></svg>
          </button>
          <div>
            <h1 className="text-xl sm:text-2xl font-bold text-white">{app.name}</h1>
            <p className="text-gray-400 text-sm mt-0.5">
              {app.applicationType === 'job' ? 'Job' : 'Internship'} Application &middot; {app.postingTitle || 'Unknown Position'}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {canEditContent(myRole) && (
            <button
              onClick={navigateEdit}
              className="px-4 py-2 text-sm text-blue-400 hover:text-blue-300 bg-blue-500/10 border border-blue-500/20 rounded-lg hover:bg-blue-500/20 transition-all cursor-pointer flex items-center gap-1.5"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>
              Edit
            </button>
          )}
          {canDeleteContent(myRole) && (
            <button
              onClick={() => { if (confirm('Delete this application?')) deleteMutation.mutate(); }}
              className="px-3 py-2 text-sm text-red-400 hover:text-red-300 bg-red-500/10 border border-red-500/20 rounded-lg hover:bg-red-500/20 transition-all cursor-pointer"
            >
              Delete
            </button>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* ─── Left Content ─── */}
        <div className="lg:col-span-2 space-y-6">

          {/* Personal Information */}
          <div className="bg-zinc-900/50 border border-white/[0.06] rounded-2xl p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-white">Personal Information</h2>
              <button
                onClick={navigateEdit}
                className="text-sm text-blue-400 hover:text-blue-300 transition-colors cursor-pointer flex items-center gap-1"
              >
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>
                Edit
              </button>
            </div>

            <div className="grid grid-cols-2 gap-x-6 gap-y-3">
              {fields.map(f => {
                const val = app[f.key];
                if (!val) return null;
                return (
                  <div key={f.key} className={f.long ? 'col-span-2' : ''}>
                    <span className="text-xs text-gray-500 block">{f.label}</span>
                    {f.href ? (
                      <a href={val} target="_blank" rel="noopener noreferrer" className="text-sm text-blue-400 hover:underline break-all">{val}</a>
                    ) : (
                      <span className="text-sm text-white break-words">{val}</span>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Contact */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div className="bg-zinc-900/50 border border-white/[0.06] rounded-2xl p-5">
              <h2 className="text-sm font-semibold text-white mb-3">Contact</h2>
              <div className="space-y-2 text-sm">
                <div>
                  <span className="text-gray-500">Email</span>
                  <p className="text-white">{app.email || '—'}</p>
                </div>
                <div>
                  <span className="text-gray-500">Phone</span>
                  <p className="text-white">{app.phone || '—'}</p>
                </div>
              </div>
            </div>

            <div className="bg-zinc-900/50 border border-white/[0.06] rounded-2xl p-5">
              <h2 className="text-sm font-semibold text-white mb-3">{isJob ? 'Professional' : 'Academic'}</h2>
              <div className="space-y-2 text-sm">
                {isJob ? (
                  <>
                    {app.current_company && <div><span className="text-gray-500">Company</span><p className="text-white">{app.current_company}</p></div>}
                    {app.current_position && <div><span className="text-gray-500">Position</span><p className="text-white">{app.current_position}</p></div>}
                    {app.years_of_experience && <div><span className="text-gray-500">Experience</span><p className="text-white">{app.years_of_experience} years</p></div>}
                  </>
                ) : (
                  <>
                    {app.university && <div><span className="text-gray-500">University</span><p className="text-white">{app.university}</p></div>}
                    {app.major && <div><span className="text-gray-500">Major</span><p className="text-white">{app.major}</p></div>}
                    {app.year_of_study && <div><span className="text-gray-500">Year</span><p className="text-white">{app.year_of_study}</p></div>}
                    {app.gpa && <div><span className="text-gray-500">GPA</span><p className="text-white">{app.gpa}</p></div>}
                  </>
                )}
              </div>
            </div>
          </div>

          {/* Links */}
          <div className="bg-zinc-900/50 border border-white/[0.06] rounded-2xl p-5">
            <h2 className="text-sm font-semibold text-white mb-3">Links</h2>
            <div className="flex flex-wrap gap-3">
              {app.linkedin_url && (
                <a href={app.linkedin_url} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-blue-500/10 text-blue-400 rounded-lg text-xs hover:bg-blue-500/20 transition-all">
                  <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>
                  LinkedIn
                </a>
              )}
              {app.github_url && (
                <a href={app.github_url} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-gray-500/10 text-gray-300 rounded-lg text-xs hover:bg-gray-500/20 transition-all">
                  <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24"><path d="M12 0C5.374 0 0 5.373 0 12c0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23A11.509 11.509 0 0112 5.803c1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576C20.566 21.797 24 17.3 24 12c0-6.627-5.373-12-12-12z"/></svg>
                  GitHub
                </a>
              )}
              {app.portfolio_url && (
                <a href={app.portfolio_url} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-purple-500/10 text-purple-400 rounded-lg text-xs hover:bg-purple-500/20 transition-all">
                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"/></svg>
                  Portfolio
                </a>
              )}
              {app.resume_url && (
                <a href={app.resume_url} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-green-500/10 text-green-400 rounded-lg text-xs hover:bg-green-500/20 transition-all">
                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/></svg>
                  Resume
                </a>
              )}
            </div>
          </div>

        </div>

        {/* ─── Sidebar ─── */}
        <div className="space-y-6">
          {/* Interview & Review */}
          <div className="bg-zinc-900/50 border border-white/[0.06] rounded-2xl p-5">
            <h2 className="text-sm font-semibold text-white mb-4">Interview & Review</h2>

            <div className="space-y-4">
              <div>
                <label className="text-xs text-gray-400 block mb-1.5">Status</label>
                <div className="mb-2">
                  <ApplicationStatusBadge status={app.status} />
                </div>
                {canEditContent(myRole) ? (
                  <select
                    value={app.status}
                    onChange={(e) => statusMutation.mutate({ status: e.target.value })}
                    className="w-full bg-[#1a1a1a] border border-[#2a2a2a] rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-blue-500 cursor-pointer"
                  >
                    {statusOptions.map(s => (
                      <option key={s} value={s}>{s}</option>
                    ))}
                  </select>
                ) : (
                  <span className="text-gray-400 text-sm">{app.status}</span>
                )}
              </div>

              {canEditContent(myRole) && (
                <div className="border-t border-white/[0.06] pt-4">
                  <label className="text-xs text-gray-400 block mb-1.5">Interviewer</label>
                  <select
                    value={app.interviewer_name || ''}
                    onChange={(e) => interviewMutation.mutate({ interviewer_name: e.target.value || undefined })}
                    className="w-full bg-[#1a1a1a] border border-[#2a2a2a] rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-blue-500 cursor-pointer"
                  >
                    <option value="">—</option>
                    {interviewers.map((iv: any) => (
                      <option key={iv.id} value={iv.name}>{iv.name}</option>
                    ))}
                  </select>
                </div>
              )}

              {canEditContent(myRole) && (
                <div className="border-t border-white/[0.06] pt-4">
                  <label className="text-xs text-gray-400 block mb-1.5">Schedule Interview Date</label>
                  <input
                    type="date"
                    value={app.interview_date ? app.interview_date.split('T')[0] : ''}
                    onChange={(e) => interviewMutation.mutate({ interview_date: e.target.value || undefined })}
                    className="w-full bg-[#1a1a1a] border border-[#2a2a2a] rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-blue-500"
                  />
                </div>
              )}

              {canEditContent(myRole) && (
                <div className="border-t border-white/[0.06] pt-4">
                  <label className="text-xs text-gray-400 block mb-1.5">Interviewer Feedback</label>
                  <textarea
                    rows={3}
                    defaultValue={app.interviewer_feedback || ''}
                    placeholder="Enter feedback, rejection reason, or notes..."
                    onBlur={(e) => {
                      const val = e.target.value.trim();
                      if (val !== (app.interviewer_feedback || '')) {
                        feedbackMutation.mutate({ interviewer_feedback: val });
                      }
                    }}
                    className="w-full bg-[#1a1a1a] border border-[#2a2a2a] rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-blue-500 resize-none"
                />
              </div>
              )}
            </div>
          </div>

          {/* Timeline */}
          <div className="bg-zinc-900/50 border border-white/[0.06] rounded-2xl p-5">
            <h2 className="text-sm font-semibold text-white mb-3">Timeline</h2>
            <div className="space-y-2 text-sm">
              <div>
                <span className="text-gray-500">Applied</span>
                <p className="text-white">{new Date(app.created_at).toLocaleDateString()}</p>
              </div>
              <div>
                <span className="text-gray-500">Last Updated</span>
                <p className="text-white">{new Date(app.updated_at).toLocaleDateString()}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
