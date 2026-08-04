import { PROJECT_ROLES } from './types';

export type ProjectPermission =
  | 'view'
  | 'manage_tickets'
  | 'delete_ticket'
  | 'manage_sprints'
  | 'manage_labels'
  | 'manage_project'
  | 'manage_members';

const PROJECT_PERMISSIONS: Record<ProjectPermission, readonly string[]> = {
  view: ['PROJECT_OWNER', 'PROJECT_MANAGER', 'DEVELOPER', 'CLIENT', 'VIEWER'],
  manage_tickets: ['PROJECT_OWNER', 'PROJECT_MANAGER', 'DEVELOPER'],
  delete_ticket: ['PROJECT_OWNER', 'PROJECT_MANAGER'],
  manage_sprints: ['PROJECT_OWNER', 'PROJECT_MANAGER'],
  manage_labels: ['PROJECT_OWNER', 'PROJECT_MANAGER'],
  manage_project: ['PROJECT_OWNER', 'PROJECT_MANAGER'],
  manage_members: ['PROJECT_OWNER'],
};

export function canProject(role: string | null | undefined, permission: ProjectPermission): boolean {
  if (!role) return false;
  return PROJECT_PERMISSIONS[permission].includes(role);
}

export function isValidProjectRole(role: string | null | undefined): role is string {
  return !!role && (PROJECT_ROLES as readonly string[]).includes(role);
}

export { PROJECT_PERMISSIONS };
