<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

# LMS Admin Area Conventions

- **Single merged area.** The LMS admin/instructor area lives under `/lms/instructor/*` only. There is NO `/lms/admin` route, no `AdminSidebar`, and no `api/lms/admin/*` endpoints — do not recreate them.
- **All admin roles get all access.** Any role in `isAdminRole()` (SUPER_ADMIN, ADMIN, EDITOR, NANO_EDITOR, VIEWER) passes every LMS gate. Use `requireInstructor()` (NOT `requireAdmin()`) for write-gated LMS APIs, and `isAdminRole(user.role)` for ownership checks.
- **Global scope.** `api/lms/instructor/courses` and `api/lms/instructor/stats` are global (all courses), not scoped to the calling user's `instructorId`.
- **Sidebar.** `src/components/lms/InstructorSidebar.tsx` is the single sidebar. Its "Back to Admin" link goes to `/admin/dashboard`.
- **Course lifecycle.** Courses are created DRAFT by default; editors can create PUBLISHED directly or use "Approve & Publish" on the edit page. `pendingCourses` = status DRAFT && isComplete true.

# Prisma / Database Conventions

- **DO NOT run `prisma db push` or `prisma migrate`.** Both fail project-wide on a pre-existing cross-schema FK (`public.admin_notifications.recipient_user_id` → `auth.users`, Supabase-managed). Adding `auth` to the datasource `schemas` makes Prisma want to DROP the entire Supabase auth schema — never do it (verified with `migrate diff`). Keep `schemas = ["public"]`.
- **Applying new tables:** update `prisma/schema.prisma`, run `prisma generate`, then apply DDL with raw SQL (see `scripts/apply-certificate-tables.mjs` for the pattern) since `db push` is unusable.

