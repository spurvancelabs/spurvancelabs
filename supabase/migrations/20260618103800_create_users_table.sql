CREATE EXTENSION IF NOT EXISTS pgcrypto;

CREATE TABLE IF NOT EXISTS public.users (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email text UNIQUE,
  name text,
  image text,
  role text NOT NULL DEFAULT 'USER',
  provider text,
  provider_id text,
  email_verified boolean NOT NULL DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.users ADD COLUMN IF NOT EXISTS role text;
UPDATE public.users SET role = 'USER' WHERE role IS NULL;
ALTER TABLE public.users ALTER COLUMN role SET NOT NULL;
ALTER TABLE public.users ALTER COLUMN role SET DEFAULT 'USER';

ALTER TABLE public.users ADD COLUMN IF NOT EXISTS provider text;
ALTER TABLE public.users ADD COLUMN IF NOT EXISTS provider_id text;
ALTER TABLE public.users ADD COLUMN IF NOT EXISTS email_verified boolean NOT NULL DEFAULT false;
UPDATE public.users SET email_verified = false WHERE email_verified IS NULL;
ALTER TABLE public.users ALTER COLUMN email_verified SET NOT NULL;
ALTER TABLE public.users ALTER COLUMN email_verified SET DEFAULT false;

CREATE INDEX IF NOT EXISTS idx_users_email ON public.users(email);

ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can view own profile" ON public.users;
CREATE POLICY "Users can view own profile" ON public.users
  FOR SELECT USING (auth.uid() = id);

DROP POLICY IF EXISTS "Users can update own profile" ON public.users;
CREATE POLICY "Users can update own profile" ON public.users
  FOR UPDATE USING (auth.uid() = id);

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.users (
    id,
    email,
    name,
    image,
    role,
    provider,
    provider_id,
    email_verified
  )
  VALUES (
    NEW.id,
    COALESCE(NEW.email, NEW.raw_user_meta_data->>'email'),
    COALESCE(NEW.raw_user_meta_data->>'name', ''),
    NEW.raw_user_meta_data->>'avatar_url',
    COALESCE(NEW.raw_user_meta_data->>'role', 'USER'),
    NEW.raw_user_meta_data->>'provider',
    NEW.raw_user_meta_data->>'provider_id',
    COALESCE(NEW.email_confirmed_at IS NOT NULL, false)
  )
  ON CONFLICT (id) DO UPDATE SET
    email = COALESCE(EXCLUDED.email, public.users.email),
    name = COALESCE(NULLIF(EXCLUDED.name, ''), public.users.name),
    image = COALESCE(EXCLUDED.image, public.users.image),
    role = COALESCE(EXCLUDED.role, public.users.role),
    provider = COALESCE(EXCLUDED.provider, public.users.provider),
    provider_id = COALESCE(EXCLUDED.provider_id, public.users.provider_id),
    email_verified = public.users.email_verified OR EXCLUDED.email_verified,
    updated_at = now();

  RETURN NEW;
END;
$$;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1
    FROM pg_trigger
    WHERE tgname = 'on_auth_user_created'
      AND tgrelid = 'auth.users'::regclass
      AND NOT tgisinternal
  ) THEN
    CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
  END IF;
END $$;
