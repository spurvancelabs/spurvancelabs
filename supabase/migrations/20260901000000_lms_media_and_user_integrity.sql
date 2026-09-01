-- LMS media storage. Uploads are authorized by the application server and stored
-- outside the serverless function filesystem.
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES
  ('lms-course-thumbnails', 'lms-course-thumbnails', true, 5242880,
    ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/gif']),
  ('lms-lesson-videos', 'lms-lesson-videos', true, 524288000,
    ARRAY['video/mp4', 'video/webm', 'video/quicktime']),
  ('lms-avatars', 'lms-avatars', true, 5242880,
    ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/gif'])
ON CONFLICT (id) DO UPDATE SET
  public = EXCLUDED.public,
  file_size_limit = EXCLUDED.file_size_limit,
  allowed_mime_types = EXCLUDED.allowed_mime_types;

-- Every auth user used by the application must have its public.users row.
-- The service-role application code also upserts this record for legacy users,
-- but removing the skip flag from the trigger prevents new orphaned records.
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
    type,
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
    type = COALESCE(EXCLUDED.type, public.users.type),
    provider = COALESCE(EXCLUDED.provider, public.users.provider),
    provider_id = COALESCE(EXCLUDED.provider_id, public.users.provider_id),
    email_verified = public.users.email_verified OR EXCLUDED.email_verified,
    updated_at = now();

  RETURN NEW;
END;
$$;


-- Finalize user integrity: never allow metadata to suppress the application-level user row.
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.users (id, email, name, image, type, provider, provider_id, email_verified)
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
    type = COALESCE(EXCLUDED.type, public.users.type),
    provider = COALESCE(EXCLUDED.provider, public.users.provider),
    provider_id = COALESCE(EXCLUDED.provider_id, public.users.provider_id),
    email_verified = public.users.email_verified OR EXCLUDED.email_verified,
    updated_at = now();
  RETURN NEW;
END;
$$;
