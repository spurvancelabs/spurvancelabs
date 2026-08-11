-- Admin notifications: a separate notification stream for admin users.
-- Each admin_user receives their own row (recipient_user_id), so read/unread
-- state is per-admin and never mixed with user notifications.

CREATE TABLE IF NOT EXISTS public.admin_notifications (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  recipient_user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  type text NOT NULL DEFAULT 'info',
  title text NOT NULL,
  message text NOT NULL,
  priority text NOT NULL DEFAULT 'medium',
  read boolean NOT NULL DEFAULT false,
  read_at timestamptz,
  link text,
  data jsonb NOT NULL DEFAULT '{}',
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_admin_notifications_recipient
  ON public.admin_notifications(recipient_user_id, created_at DESC);

ALTER TABLE public.admin_notifications ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Admin notifications: view own" ON public.admin_notifications;
CREATE POLICY "Admin notifications: view own" ON public.admin_notifications
  FOR SELECT USING (auth.uid() = recipient_user_id);

DROP POLICY IF EXISTS "Admin notifications: update own" ON public.admin_notifications;
CREATE POLICY "Admin notifications: update own" ON public.admin_notifications
  FOR UPDATE USING (auth.uid() = recipient_user_id);

DROP POLICY IF EXISTS "Admin notifications: delete own" ON public.admin_notifications;
CREATE POLICY "Admin notifications: delete own" ON public.admin_notifications
  FOR DELETE USING (auth.uid() = recipient_user_id);
