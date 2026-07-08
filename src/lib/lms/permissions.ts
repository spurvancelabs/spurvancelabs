import { ROLES, hasMinRole, roleLevel } from './roles';

export const PERMISSIONS = {
  MANAGE_ADMINS: 'manage_admins',
  MANAGE_USERS: 'manage_users',
  MANAGE_ROLES: 'manage_roles',
  CREATE_CONTENT: 'create_content',
  EDIT_CONTENT: 'edit_content',
  DELETE_CONTENT: 'delete_content',
  VIEW_ADMIN_PANEL: 'view_admin_panel',
  VIEW_ANALYTICS: 'view_analytics',
  ACCESS_LMS_ADMIN: 'access_lms_admin',
  ACCESS_LMS_INSTRUCTOR: 'access_lms_instructor',
} as const;

export type Permission = (typeof PERMISSIONS)[keyof typeof PERMISSIONS];

const PERMISSION_ROLES: Record<Permission, string[]> = {
  [PERMISSIONS.MANAGE_ADMINS]: [ROLES.SUPER_ADMIN],
  [PERMISSIONS.MANAGE_USERS]: [ROLES.SUPER_ADMIN, ROLES.ADMIN],
  [PERMISSIONS.MANAGE_ROLES]: [ROLES.SUPER_ADMIN, ROLES.ADMIN],
  [PERMISSIONS.CREATE_CONTENT]: [ROLES.SUPER_ADMIN, ROLES.ADMIN, ROLES.EDITOR],
  [PERMISSIONS.EDIT_CONTENT]: [ROLES.SUPER_ADMIN, ROLES.ADMIN, ROLES.EDITOR, ROLES.NANO_EDITOR],
  [PERMISSIONS.DELETE_CONTENT]: [ROLES.SUPER_ADMIN, ROLES.ADMIN],
  [PERMISSIONS.VIEW_ADMIN_PANEL]: [ROLES.SUPER_ADMIN, ROLES.ADMIN, ROLES.EDITOR, ROLES.NANO_EDITOR, ROLES.VIEWER],
  [PERMISSIONS.VIEW_ANALYTICS]: [ROLES.SUPER_ADMIN, ROLES.ADMIN, ROLES.EDITOR, ROLES.NANO_EDITOR, ROLES.VIEWER],
  [PERMISSIONS.ACCESS_LMS_ADMIN]: [ROLES.SUPER_ADMIN, ROLES.ADMIN],
  [PERMISSIONS.ACCESS_LMS_INSTRUCTOR]: [ROLES.SUPER_ADMIN, ROLES.ADMIN, ROLES.INSTRUCTOR],
};

export function hasPermission(role: string | null | undefined, permission: Permission): boolean {
  if (!role) return false;
  const allowedRoles = PERMISSION_ROLES[permission];
  return allowedRoles.includes(role);
}

export function canManageAdmins(role: string | null | undefined): boolean {
  return hasPermission(role, PERMISSIONS.MANAGE_ADMINS);
}

export function canManageUsers(role: string | null | undefined): boolean {
  return hasPermission(role, PERMISSIONS.MANAGE_USERS);
}

export function canCreateContent(role: string | null | undefined): boolean {
  return hasPermission(role, PERMISSIONS.CREATE_CONTENT);
}

export function canEditContent(role: string | null | undefined): boolean {
  return hasPermission(role, PERMISSIONS.EDIT_CONTENT);
}

export function canDeleteContent(role: string | null | undefined): boolean {
  return hasPermission(role, PERMISSIONS.DELETE_CONTENT);
}

export function canViewAdminPanel(role: string | null | undefined): boolean {
  return hasPermission(role, PERMISSIONS.VIEW_ADMIN_PANEL);
}

export function canViewAnalytics(role: string | null | undefined): boolean {
  return hasPermission(role, PERMISSIONS.VIEW_ANALYTICS);
}

export function canAccessLMSAdmin(role: string | null | undefined): boolean {
  return hasPermission(role, PERMISSIONS.ACCESS_LMS_ADMIN);
}

export function canAccessLMSInstructor(role: string | null | undefined): boolean {
  return hasPermission(role, PERMISSIONS.ACCESS_LMS_INSTRUCTOR);
}

export function getAssignableRoles(actorRole: string | null | undefined): string[] {
  if (!actorRole) return [];
  if (actorRole === ROLES.SUPER_ADMIN) {
    return [ROLES.SUPER_ADMIN, ROLES.ADMIN, ROLES.EDITOR, ROLES.NANO_EDITOR, ROLES.VIEWER];
  }
  if (actorRole === ROLES.ADMIN) {
    return [ROLES.EDITOR, ROLES.NANO_EDITOR, ROLES.VIEWER];
  }
  return [];
}
