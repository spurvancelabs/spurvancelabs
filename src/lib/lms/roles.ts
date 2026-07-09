export const ROLES = {
  SUPER_ADMIN: 'SUPER_ADMIN',
  ADMIN: 'ADMIN',
  EDITOR: 'EDITOR',
  NANO_EDITOR: 'NANO_EDITOR',
  VIEWER: 'VIEWER',
  USER: 'USER',
  INSTRUCTOR: 'INSTRUCTOR',
} as const;

export type Role = (typeof ROLES)[keyof typeof ROLES];

export type AdminRole = typeof ROLES.SUPER_ADMIN | typeof ROLES.ADMIN | typeof ROLES.EDITOR | typeof ROLES.NANO_EDITOR | typeof ROLES.VIEWER;

export const ROLE_HIERARCHY: Record<string, number> = {
  SUPER_ADMIN: 100,
  ADMIN: 80,
  EDITOR: 60,
  NANO_EDITOR: 40,
  VIEWER: 20,
  USER: 10,
  INSTRUCTOR: 10,
};

export function roleLevel(role: string | null | undefined): number {
  return ROLE_HIERARCHY[role ?? ''] ?? 0;
}

export function hasMinRole(userRole: string | null | undefined, minRole: string): boolean {
  if (!userRole) return false;
  return roleLevel(userRole) >= roleLevel(minRole);
}

export const ROLE_COLORS: Record<string, string> = {
  SUPER_ADMIN: 'bg-red-500/10 text-red-400 border-red-500/20',
  ADMIN: 'bg-blue-500/10 text-blue-400 border-blue-500/20',
  EDITOR: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
  NANO_EDITOR: 'bg-purple-500/10 text-purple-400 border-purple-500/20',
  VIEWER: 'bg-gray-500/10 text-gray-400 border-gray-500/20',
  USER: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
  INSTRUCTOR: 'bg-cyan-500/10 text-cyan-400 border-cyan-500/20',
};

export const ROLE_LABELS: Record<string, string> = {
  SUPER_ADMIN: 'Super Admin',
  ADMIN: 'Admin',
  EDITOR: 'Editor',
  NANO_EDITOR: 'Nano Editor',
  VIEWER: 'Viewer',
  USER: 'Student',
  INSTRUCTOR: 'Instructor',
};

export function getRoleColor(role: string | null | undefined): string {
  if (role && role in ROLE_COLORS) return ROLE_COLORS[role];
  return 'bg-gray-500/10 text-gray-400 border-gray-500/20';
}

export function getRoleLabel(role: string | null | undefined): string {
  if (role && role in ROLE_LABELS) return ROLE_LABELS[role];
  return role ?? 'Unknown';
}

export function isValidRole(role: string): role is Role {
  return Object.values(ROLES).includes(role as Role);
}

export function isAdminRole(role: string | null | undefined): boolean {
  if (!role) return false;
  return hasMinRole(role, ROLES.VIEWER) && role !== ROLES.USER && role !== ROLES.INSTRUCTOR;
}
