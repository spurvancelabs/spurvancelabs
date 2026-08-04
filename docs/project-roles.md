# Project Roles & Permissions

Project roles are independent from global app roles (`src/lib/lms/roles.ts`). They are
enforced per-project via membership (`ProjectMember`) and the project `ownerId`.

## Roles

| Role               | Meaning                                                    |
| ------------------ | ---------------------------------------------------------- |
| `PROJECT_OWNER`    | The user who created the project (`Project.ownerId`). Full control. |
| `PROJECT_MANAGER`  | Runs the project: sprints, planning, settings, bulk ops.   |
| `DEVELOPER`        | Creates and edits tickets, moves them on the board.        |
| `CLIENT`           | Read-only; can view and comment.                           |
| `VIEWER`           | Read-only viewer.                                          |

The project owner is **not** stored in `ProjectMember`; their role is derived by comparing
`Project.ownerId` with the authenticated user. The owner's role cannot be changed (PATCH
rejects it) and the owner cannot be removed.

## Permission Matrix

| Permission        | Owner | Manager | Developer | Client | Viewer |
| ----------------- | :---: | :-----: | :-------: | :----: | :----: |
| `view`            | ✅    | ✅      | ✅        | ✅     | ✅     |
| `manage_tickets`  | ✅    | ✅      | ✅        | ❌     | ❌     |
| `delete_ticket`   | ✅    | ✅      | ❌        | ❌     | ❌     |
| `manage_sprints`  | ✅    | ✅      | ❌        | ❌     | ❌     |
| `manage_labels`   | ✅    | ✅      | ❌        | ❌     | ❌     |
| `manage_project`  | ✅    | ✅      | ❌        | ❌     | ❌     |
| `manage_members`  | ✅    | ❌      | ❌        | ❌     | ❌     |

Additionally:

- Moving a ticket **between sprints** (changing `sprintId`) requires `manage_sprints`,
  even though editing the ticket itself only requires `manage_tickets`. The API checks the
  changed fields (`tickets/[ticketId]/route.ts`).
- Deleting a **project** requires being the actual `ownerId` (stricter than `manage_project`).

## Enforcement

The source of truth is `src/lib/projects/permissions.ts`:
`canProject(role, permission)` and `isValidProjectRole(role)`. Every write endpoint resolves
the caller's effective role (`PROJECT_OWNER` if `ownerId` matches, otherwise the
`ProjectMember.role`) and guards with `canProject` before mutating.

### API (`src/app/api/projects/[projectId]/...`)

| Route                              | Permission(s) used                          |
| ---------------------------------- | ------------------------------------------- |
| `route.ts` GET                     | member or owner (view)                      |
| `route.ts` PUT                     | `manage_project`                            |
| `route.ts` DELETE                  | ownerId only                                |
| `tickets/route.ts` POST            | `manage_tickets`                            |
| `tickets/[ticketId]/route.ts` PUT  | `manage_tickets` (+ `manage_sprints` when `sprintId` changes) |
| `tickets/[ticketId]/route.ts` DEL  | `delete_ticket`                             |
| `tickets/bulk/route.ts` POST       | `manage_sprints`                            |
| `sprints/route.ts` POST            | `manage_sprints`                            |
| `sprints/[sprintId]/route.ts`      | `manage_sprints`                            |
| `labels/route.ts` POST             | `manage_labels`                             |
| `members/route.ts` GET             | member or owner (view)                      |
| `members/route.ts` POST            | `manage_members` (owner only)               |
| `members/route.ts` PATCH           | `manage_members` (owner only)               |
| `members/route.ts` DELETE          | `manage_members` (owner only)               |

### Frontend

- `board/page.tsx` (server) computes `currentUserRole` and passes it to `KanbanBoard`.
- `KanbanBoard` derives `canManageTickets`, `canManageSprints`, `canDeleteTicket` and gates
  Create Ticket, bulk-select bar, and passes `draggable`/`selectable` to columns.
- `KanbanColumn` → `TicketCard` disables drag (`useSortable disabled`), the sub-task
  shortcut, and selection checkboxes for read-only roles.
- `TicketDetailModal` hides Edit, status control, sub-task add, time-log form, and file
  upload for non-managers; the sprint field is read-only unless `canManageSprints`.
- `backlog/page.tsx` and `planning/page.tsx` (client) compute the role from
  `/api/auth/me` + project `owner` + members and gate selection, bulk ops, and drag.
- `settings/page.tsx` gates add/remove members, role change (via PATCH), and Danger Zone
  to the owner, and hides the role dropdown when the current user lacks `manage_members`.
