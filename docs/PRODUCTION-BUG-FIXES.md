# Production Bug Fixes

This release fixes the LMS module-count, LMS media upload, VIDEO lesson playback, project creation, department workflow, CSV ID, admin-user relationship, and secondary-text contrast issues.

## Required deployment step

Apply the new Supabase migration before testing uploads or creating new Auth users:

```text
supabase/migrations/20260901000000_lms_media_and_user_integrity.sql
```

The migration creates these public Storage buckets:

- `lms-course-thumbnails` — JPG/PNG/WebP/GIF, maximum 5 MB
- `lms-lesson-videos` — MP4/WebM/MOV, maximum 500 MB
- `lms-avatars` — JPG/PNG/WebP/GIF, maximum 5 MB

No new environment variables are required. The existing Supabase URL/anon key and service-role key are used.

## What changed

- Module APIs now return `_count.lessons`, so module counters and course-review validation use the real database count.
- LMS uploads are stored in Supabase Storage rather than the serverless filesystem.
- Thumbnail uploads are authenticated and capped at 5 MB server-side.
- Large lesson videos use signed direct-to-Storage uploads instead of sending the file through the Next.js function.
- VIDEO lessons can exist as unpublished drafts while content is being prepared; publishing requires a video URL.
- The reusable `LessonPlayer` is used by the instructor module view and learner view.
- Admin Projects now has a Create Project flow backed by `POST /api/admin/projects`.
- Project UUIDs remain database-generated; users enter only the human-readable project key.
- Department UI now explains the project dependency when no projects exist.
- Admin creation ensures the corresponding `public.users` row exists before inserting `admin_users`.
- The Auth trigger is updated so new users cannot opt out of the application `public.users` record through `skip_users_table`.
- CSV application import continues to omit the primary key so the database generates it.
- Important secondary text has been raised from very low-contrast gray values.
