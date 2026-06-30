'use client';

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
}

export default function ApplicationDetailModal({ isOpen, onClose, application, jobInfo }: ApplicationDetailModalProps) {
  if (!isOpen || !application) return null;

  const isJob = application.applicationType === 'job';

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
      <div className="bg-[#0a0a0a] border border-[#1a1a1a] rounded-xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-[#0a0a0a] border-b border-[#1a1a1a] px-6 py-4 flex items-center justify-between z-10">
          <div>
            <h2 className="text-white text-lg font-semibold">Application Details</h2>
            <p className="text-gray-400 text-sm">Submitted on {new Date(application.created_at).toLocaleDateString()}</p>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-white text-xl cursor-pointer">✕</button>
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
              <InfoRow label="Name" value={application.name} />
              <InfoRow label="Email" value={application.email} />
              <InfoRow label="Phone" value={application.phone} />
              {application.resume_url && (
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
                <>
                  <InfoRow label="Current Company" value={application.current_company} />
                  <InfoRow label="Current Position" value={application.current_position} />
                  <InfoRow label="Years of Experience" value={application.years_of_experience} />
                  <InfoRow label="LinkedIn" value={application.linkedin_url ? <a href={application.linkedin_url} target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:underline">View</a> : null} />
                  <InfoRow label="Portfolio" value={application.portfolio_url ? <a href={application.portfolio_url} target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:underline">View</a> : null} />
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
              )}
            </div>
          </div>

          {isJob && (
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

          {!isJob && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <InfoRow label="Work Authorization" value={application.work_authorization} />
              <InfoRow label="Referral Source" value={application.referral_source} />
              <InfoRow label="Available Start Date" value={application.available_start_date ? new Date(application.available_start_date).toLocaleDateString() : null} />
              <InfoRow label="Availability Duration" value={application.availability_duration} />
            </div>
          )}

          {(application.cover_letter || application.additional_info) && (
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
