export interface JobApplicationFormData {
  jobId: string;
  name: string;
  email: string;
  phone: string;
  currentCompany: string;
  currentPosition: string;
  yearsOfExperience: string;
  linkedInUrl: string;
  portfolioUrl: string;
  coverLetter: string;
  salaryExpectation: string;
  startDate: string;
  workAuthorization: string;
  referralSource: string;
  additionalInfo: string;
  resume: File | null;
}

export interface InternshipApplicationFormData {
  internshipId: string;
  name: string;
  email: string;
  phone: string;
  university: string;
  major: string;
  yearOfStudy: string;
  graduationDate: string;
  gpa: string;
  linkedInUrl: string;
  githubUrl: string;
  coverLetter: string;
  availableStartDate: string;
  availabilityDuration: string;
  workAuthorization: string;
  referralSource: string;
  additionalInfo: string;
  resume: File | null;
}

function buildFormData(data: Record<string, string | File | null>, fileKey: string, file: File | null): FormData {
  const form = new FormData();
  for (const [key, value] of Object.entries(data)) {
    if (value !== null && value !== undefined) {
      form.append(key, value);
    }
  }
  if (file) {
    form.append(fileKey, file);
  }
  return form;
}

export const submitJobApplication = async (data: JobApplicationFormData) => {
  const formData = buildFormData(
    { ...data, resume: '' },
    'resume',
    data.resume
  );

  const res = await fetch('/api/jobs/apply', {
    method: 'POST',
    body: formData,
  });

  const result = await res.json();

  if (!res.ok) {
    throw result;
  }

  return result;
};

export const submitInternshipApplication = async (data: InternshipApplicationFormData) => {
  const formData = buildFormData(
    { ...data, resume: '' },
    'resume',
    data.resume
  );

  const res = await fetch('/api/internships/apply', {
    method: 'POST',
    body: formData,
  });

  const result = await res.json();

  if (!res.ok) {
    throw result;
  }

  return result;
};
