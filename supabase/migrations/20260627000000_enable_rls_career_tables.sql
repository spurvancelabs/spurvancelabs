-- Enable RLS on career tables
ALTER TABLE public.jobs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.internships ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.job_applications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.internship_applications ENABLE ROW LEVEL SECURITY;

-- Jobs: anyone can read, only authenticated users with admin role can write
DROP POLICY IF EXISTS "Anyone can view jobs" ON public.jobs;
CREATE POLICY "Anyone can view jobs" ON public.jobs
  FOR SELECT USING (true);

DROP POLICY IF EXISTS "Authenticated users can insert jobs" ON public.jobs;
CREATE POLICY "Authenticated users can insert jobs" ON public.jobs
  FOR INSERT WITH CHECK (auth.role() = 'authenticated');

DROP POLICY IF EXISTS "Authenticated users can update jobs" ON public.jobs;
CREATE POLICY "Authenticated users can update jobs" ON public.jobs
  FOR UPDATE USING (auth.role() = 'authenticated');

DROP POLICY IF EXISTS "Authenticated users can delete jobs" ON public.jobs;
CREATE POLICY "Authenticated users can delete jobs" ON public.jobs
  FOR DELETE USING (auth.role() = 'authenticated');

-- Internships: same as jobs
DROP POLICY IF EXISTS "Anyone can view internships" ON public.internships;
CREATE POLICY "Anyone can view internships" ON public.internships
  FOR SELECT USING (true);

DROP POLICY IF EXISTS "Authenticated users can insert internships" ON public.internships;
CREATE POLICY "Authenticated users can insert internships" ON public.internships
  FOR INSERT WITH CHECK (auth.role() = 'authenticated');

DROP POLICY IF EXISTS "Authenticated users can update internships" ON public.internships;
CREATE POLICY "Authenticated users can update internships" ON public.internships
  FOR UPDATE USING (auth.role() = 'authenticated');

DROP POLICY IF EXISTS "Authenticated users can delete internships" ON public.internships;
CREATE POLICY "Authenticated users can delete internships" ON public.internships
  FOR DELETE USING (auth.role() = 'authenticated');

-- Job applications: anyone can insert (submit application), only the owner can view/update/delete their own
DROP POLICY IF EXISTS "Anyone can submit job applications" ON public.job_applications;
CREATE POLICY "Anyone can submit job applications" ON public.job_applications
  FOR INSERT WITH CHECK (true);

DROP POLICY IF EXISTS "Users can view own job applications" ON public.job_applications;
CREATE POLICY "Users can view own job applications" ON public.job_applications
  FOR SELECT USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can update own job applications" ON public.job_applications;
CREATE POLICY "Users can update own job applications" ON public.job_applications
  FOR UPDATE USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can delete own job applications" ON public.job_applications;
CREATE POLICY "Users can delete own job applications" ON public.job_applications
  FOR DELETE USING (auth.uid() = user_id);

-- Internship applications: same as job applications
DROP POLICY IF EXISTS "Anyone can submit internship applications" ON public.internship_applications;
CREATE POLICY "Anyone can submit internship applications" ON public.internship_applications
  FOR INSERT WITH CHECK (true);

DROP POLICY IF EXISTS "Users can view own internship applications" ON public.internship_applications;
CREATE POLICY "Users can view own internship applications" ON public.internship_applications
  FOR SELECT USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can update own internship applications" ON public.internship_applications;
CREATE POLICY "Users can update own internship applications" ON public.internship_applications
  FOR UPDATE USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can delete own internship applications" ON public.internship_applications;
CREATE POLICY "Users can delete own internship applications" ON public.internship_applications
  FOR DELETE USING (auth.uid() = user_id);
