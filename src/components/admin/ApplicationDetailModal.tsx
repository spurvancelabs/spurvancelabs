'use client';

import { useState } from 'react';
import toast from 'react-hot-toast';
import ApplicationStatusBadge from './ApplicationStatusBadge';

interface JobInfo {
  id: string;
  title: string;
  department: string;
  type: string;
  location: string;
}

interface Application {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  resume_url: string | null;
  cover_letter: string | null;
  status: string;
  created_at: string;
  applicationType: string;
  job_id?: string;
  internship_id?: string;
  current_company?: string | null;
  current_position?: string | null;
  years_of_experience?: string | null;
  linkedin_url?: string | null;
  portfolio_url?: string | null;
  salary_expectation?: string | null;
  start_date?: string | null;
  work_authorization?: string | null;
  referral_source?: string | null;
  additional_info?: string | null;
  interviewer_name?: string | null;
  interview_date?: string | null;
  university?: string | null;
  major?: string | null;
  year_of_study?: string | null;
  graduation_date?: string | null;
  gpa?: string | null;
  github_url?: string | null;
  available_start_date?: string | null;
  availability_duration?: string | null;
}

interface ApplicationDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  application: Application | null;
  jobInfo: JobInfo | null;
  onUpdate?: () => void;
}

export default function ApplicationDetailModal({ isOpen, onClose, application, jobInfo, onUpdate }: ApplicationDetailModalProps) {
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState<Record<string, any>>({});
  const [saving, setSaving] = useState(false);

  if (!isOpen || !application) return null;

  const isJob = application.applicationType === 'job';

  const startEdit = () => {
    setForm({
      name: application.name,
      email: application.email,
      phone: application.phone || '',
      current_company: application.current_company || '',
      current_position: application.current_position || '',
      years_of_experience: application.years_of_experience || '',
      linkedin_url: application.linkedin_url || '',
      portfolio_url: application.portfolio_url || '',
      salary_expectation: application.salary_expectation || '',
      start_date: application.start_date || '',
      work_authorization: application.work_authorization || '',
      referral_source: application.referral_source || '',
      additional_info: application.additional_info || '',
      university: application.university || '',
      major: application.major || '',
      year_of_study: application.year_of_study || '',
      graduation_date: application.graduation_date || '',
      gpa: application.gpa || '',
      github_url: application.github_url || '',
      available_start_date: application.available_start_date || '',
      availability_duration: application.availability_duration || '',
      cover_letter: application.cover_letter || '',
    });
    setEditing(true);
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const type = application.applicationType;
      const res = await fetch(`/api/admin/applications/${application.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...form, type }),
      });
      if (!res.ok) throw new Error('Failed to update');
      toast.success('Application updated');
      setEditing(false);
      onUpdate?.();
    } catch (err: any) {
      toast.error(err.message);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!confirm('Are you sure you want to delete this application?')) return;
    setSaving(true);
    try {
      const type = application.applicationType;
      const res = await fetch(`/api/admin/applications/${application.id}?type=${type}`, {
        method: 'DELETE',
      });
      if (!res.ok) throw new Error('Failed to delete');
      toast.success('Application deleted');
      onClose();
      onUpdate?.();
    } catch (err: any) {
      toast.error(err.message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
      <div className="bg-[#0a0a0a] border border-[#1a1a1a] rounded-xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-[#0a0a0a] border-b border-[#1a1a1a] px-6 py-4 flex items-center justify-between z-10">
          <div>
            <h2 className="text-white text-lg font-semibold">Application Details</h2>
            <p className="text-gray-400 text-sm">Submitted on {new Date(application.created_at).toLocaleDateString()}</p>
          </div>
          <div className="flex items-center gap-2">
            {editing ? (
              <>
                <button
                  onClick={() => setEditing(false)}
                  className="px-3 py-1.5 text-xs text-gray-400 hover:text-white border border-white/10 rounded-lg transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSave}
                  disabled={saving}
                  className="px-3 py-1.5 text-xs bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors disabled:opacity-50 cursor-pointer"
                >
                  {saving ? 'Saving...' : 'Save'}
                </button>
              </>
            ) : (
              <>
                <button onClick={() => startEdit()} className="p-2 text-gray-400 hover:text-blue-400 hover:bg-blue-500/10 rounded-lg transition-all cursor-pointer">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>
                </button>
                <button onClick={handleDelete} disabled={saving} className="p-2 text-gray-400 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-all cursor-pointer">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                </button>
                <button onClick={onClose} className="text-gray-400 hover:text-white text-xl cursor-pointer ml-1">✕</button>
              </>
            )}
          </div>
        </div>

        <div className="p-6 space-y-6">
          {jobInfo && (
            <div className="backdrop-blur-xl bg-blue-500/5 border border-blue-500/20 rounded-xl p-4">
              <p className="text-blue-400 text-xs font-medium uppercase tracking-wider mb-2">Applied for</p>
              <h3 className="text-white text-lg font-semibold">{jobInfo.title}</h3>
              <p className="text-gray-400 text-sm mt-1">{jobInfo.department} · {jobInfo.type} · {jobInfo.location}</p>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-3">
              <h4 className="text-gray-300 text-sm font-semibold border-b border-white/5 pb-2">Personal Info</h4>
              {editing ? (
                <>
                  <EditField label="Name" value={form.name} onChange={(v) => setForm({ ...form, name: v })} />
                  <EditField label="Email" value={form.email} onChange={(v) => setForm({ ...form, email: v })} />
                  <EditField label="Phone" value={form.phone} onChange={(v) => setForm({ ...form, phone: v })} />
                </>
              ) : (
                <>
                  <InfoRow label="Name" value={application.name} />
                  <InfoRow label="Email" value={application.email} />
                  <InfoRow label="Phone" value={application.phone} />
                  <InfoRow label="Interviewer" value={application.interviewer_name} />
                  <InfoRow label="Interview Date" value={application.interview_date ? new Date(application.interview_date).toLocaleDateString() : null} />
                </>
              )}
              {application.resume_url && !editing && (
                <div>
                  <p className="text-gray-500 text-xs">Resume</p>
                  <a href={application.resume_url} target="_blank" rel="noopener noreferrer"
                    className="text-blue-400 text-sm hover:underline">View Resume →</a>
                </div>
              )}
              <InfoRow label="Status" value={<ApplicationStatusBadge status={application.status} />} />
            </div>

            <div className="space-y-3">
              <h4 className="text-gray-300 text-sm font-semibold border-b border-white/5 pb-2">
                {isJob ? 'Professional Info' : 'Academic Info'}
              </h4>
              {isJob ? (
                editing ? (
                  <>
                    <EditField label="Current Company" value={form.current_company} onChange={(v) => setForm({ ...form, current_company: v })} />
                    <EditField label="Current Position" value={form.current_position} onChange={(v) => setForm({ ...form, current_position: v })} />
                    <EditField label="Years of Experience" value={form.years_of_experience} onChange={(v) => setForm({ ...form, years_of_experience: v })} />
                    <EditField label="LinkedIn URL" value={form.linkedin_url} onChange={(v) => setForm({ ...form, linkedin_url: v })} />
                    <EditField label="Portfolio URL" value={form.portfolio_url} onChange={(v) => setForm({ ...form, portfolio_url: v })} />
                  </>
                ) : (
                  <>
                    <InfoRow label="Current Company" value={application.current_company} />
                    <InfoRow label="Current Position" value={application.current_position} />
                    <InfoRow label="Years of Experience" value={application.years_of_experience} />
                    <InfoRow label="LinkedIn" value={application.linkedin_url ? <a href={application.linkedin_url} target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:underline">View</a> : null} />
                    <InfoRow label="Portfolio" value={application.portfolio_url ? <a href={application.portfolio_url} target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:underline">View</a> : null} />
                  </>
                )
              ) : (
                editing ? (
                  <>
                    <EditField label="University" value={form.university} onChange={(v) => setForm({ ...form, university: v })} />
                    <EditField label="Major" value={form.major} onChange={(v) => setForm({ ...form, major: v })} />
                    <EditField label="Year of Study" value={form.year_of_study} onChange={(v) => setForm({ ...form, year_of_study: v })} />
                    <EditField label="Graduation Date" value={form.graduation_date} onChange={(v) => setForm({ ...form, graduation_date: v })} type="date" />
                    <EditField label="GPA" value={form.gpa} onChange={(v) => setForm({ ...form, gpa: v })} />
                    <EditField label="GitHub URL" value={form.github_url} onChange={(v) => setForm({ ...form, github_url: v })} />
                  </>
                ) : (
                  <>
                    <InfoRow label="University" value={application.university} />
                    <InfoRow label="Major" value={application.major} />
                    <InfoRow label="Year of Study" value={application.year_of_study} />
                    <InfoRow label="Graduation Date" value={application.graduation_date ? new Date(application.graduation_date).toLocaleDateString() : null} />
                    <InfoRow label="GPA" value={application.gpa} />
                    <InfoRow label="GitHub" value={application.github_url ? <a href={application.github_url} target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:underline">View</a> : null} />
                  </>
                )
              )}
            </div>
          </div>

          {isJob && editing && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-3">
                <h4 className="text-gray-300 text-sm font-semibold border-b border-white/5 pb-2">Additional Info</h4>
                <EditField label="Salary Expectation" value={form.salary_expectation} onChange={(v) => setForm({ ...form, salary_expectation: v })} />
                <EditField label="Start Date" value={form.start_date} onChange={(v) => setForm({ ...form, start_date: v })} type="date" />
                <EditField label="Work Authorization" value={form.work_authorization} onChange={(v) => setForm({ ...form, work_authorization: v })} />
                <EditField label="Referral Source" value={form.referral_source} onChange={(v) => setForm({ ...form, referral_source: v })} />
              </div>
              <div className="space-y-3">
                <h4 className="text-gray-300 text-sm font-semibold border-b border-white/5 pb-2">Additional Info</h4>
                <EditField label="Available Start Date" value={form.available_start_date} onChange={(v) => setForm({ ...form, available_start_date: v })} type="date" />
                <EditField label="Availability Duration" value={form.availability_duration} onChange={(v) => setForm({ ...form, availability_duration: v })} />
              </div>
            </div>
          )}

          {isJob && !editing && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-3">
                <h4 className="text-gray-300 text-sm font-semibold border-b border-white/5 pb-2">Additional Info</h4>
                <InfoRow label="Salary Expectation" value={application.salary_expectation} />
                <InfoRow label="Start Date" value={application.start_date ? new Date(application.start_date).toLocaleDateString() : null} />
                <InfoRow label="Work Authorization" value={application.work_authorization} />
                <InfoRow label="Referral Source" value={application.referral_source} />
              </div>
              <div className="space-y-3">
                <h4 className="text-gray-300 text-sm font-semibold border-b border-white/5 pb-2">Internship Details</h4>
                <InfoRow label="Available Start Date" value={application.available_start_date ? new Date(application.available_start_date).toLocaleDateString() : null} />
                <InfoRow label="Availability Duration" value={application.availability_duration} />
              </div>
            </div>
          )}

          {!isJob && !editing && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <InfoRow label="Work Authorization" value={application.work_authorization} />
              <InfoRow label="Referral Source" value={application.referral_source} />
              <InfoRow label="Available Start Date" value={application.available_start_date ? new Date(application.available_start_date).toLocaleDateString() : null} />
              <InfoRow label="Availability Duration" value={application.availability_duration} />
            </div>
          )}

          {!isJob && editing && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <EditField label="Work Authorization" value={form.work_authorization} onChange={(v) => setForm({ ...form, work_authorization: v })} />
              <EditField label="Referral Source" value={form.referral_source} onChange={(v) => setForm({ ...form, referral_source: v })} />
              <EditField label="Available Start Date" value={form.available_start_date} onChange={(v) => setForm({ ...form, available_start_date: v })} type="date" />
              <EditField label="Availability Duration" value={form.availability_duration} onChange={(v) => setForm({ ...form, availability_duration: v })} />
            </div>
          )}

          {(application.cover_letter || application.additional_info) && !editing && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {application.cover_letter && (
                <div>
                  <h4 className="text-gray-300 text-sm font-semibold border-b border-white/5 pb-2 mb-2">Cover Letter</h4>
                  <p className="text-gray-400 text-sm whitespace-pre-wrap">{application.cover_letter}</p>
                </div>
              )}
              {application.additional_info && (
                <div>
                  <h4 className="text-gray-300 text-sm font-semibold border-b border-white/5 pb-2 mb-2">Additional Information</h4>
                  <p className="text-gray-400 text-sm whitespace-pre-wrap">{application.additional_info}</p>
                </div>
              )}
            </div>
          )}

          {editing && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <EditField label="Cover Letter" value={form.cover_letter || ''} onChange={(v) => setForm({ ...form, cover_letter: v })} textarea />
              <EditField label="Additional Info" value={form.additional_info || ''} onChange={(v) => setForm({ ...form, additional_info: v })} textarea />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function InfoRow({ label, value }: { label: string; value: React.ReactNode }) {
  if (!value) return null;
  return (
    <div>
      <p className="text-gray-500 text-xs">{label}</p>
      <p className="text-white text-sm mt-0.5">{value}</p>
    </div>
  );
}

function EditField({ label, value, onChange, type, textarea }: { label: string; value: string; onChange: (v: string) => void; type?: string; textarea?: boolean }) {
  return (
    <div>
      <p className="text-gray-500 text-xs mb-1">{label}</p>
      {textarea ? (
        <textarea
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-full bg-[#1a1a1a] border border-[#2a2a2a] rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-blue-500 resize-none"
          rows={3}
        />
      ) : (
        <input
          type={type || 'text'}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-full bg-[#1a1a1a] border border-[#2a2a2a] rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-blue-500"
        />
      )}
    </div>
  );
}
