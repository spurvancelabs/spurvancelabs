export const ROLES = {
  USER: 'USER',
  INSTRUCTOR: 'INSTRUCTOR',
  ADMIN: 'ADMIN',
} as const;

export type Role = (typeof ROLES)[keyof typeof ROLES];

export const ROLE_COLORS: Record<Role, string> = {
  USER: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
  INSTRUCTOR: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
  ADMIN: 'bg-blue-500/10 text-blue-400 border-blue-500/20',
};

export const ROLE_LABELS: Record<Role, string> = {
  USER: 'Student',
  INSTRUCTOR: 'Instructor',
  ADMIN: 'Admin',
};

export function getRoleColor(role: string | null | undefined): string {
  if (role && role in ROLE_COLORS) return ROLE_COLORS[role as Role];
  return 'bg-gray-500/10 text-gray-400 border-gray-500/20';
}

export function getRoleLabel(role: string | null | undefined): string {
  if (role && role in ROLE_LABELS) return ROLE_LABELS[role as Role];
  return role ?? 'Unknown';
}

export function isValidRole(role: string): role is Role {
  return Object.values(ROLES).includes(role as Role);
}
