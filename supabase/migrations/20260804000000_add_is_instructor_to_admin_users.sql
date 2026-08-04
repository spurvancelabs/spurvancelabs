-- Add instructor co-role to admin_users.
-- Any of the 5 admin roles can also carry the Instructor co-role.
-- The standalone INSTRUCTOR role is removed from assignment; legacy
-- users with type = 'INSTRUCTOR' keep working via app-level checks.
ALTER TABLE public.admin_users ADD COLUMN IF NOT EXISTS is_instructor boolean NOT NULL DEFAULT false;
