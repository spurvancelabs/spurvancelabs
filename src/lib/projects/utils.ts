import prisma from '@/lib/prisma';
import { getAuthUser, type AuthUser } from '@/lib/lms/utils';

export async function getAuthUserForProject(): Promise<AuthUser | null> {
  return getAuthUser();
}

export async function isProjectMember(projectId: string, userId: string): Promise<boolean> {
  const member = await prisma.projectMember.findUnique({
    where: { projectId_userId: { projectId, userId } },
  });
  return !!member;
}

export async function getProjectMemberRole(projectId: string, userId: string): Promise<string | null> {
  const member = await prisma.projectMember.findUnique({
    where: { projectId_userId: { projectId, userId } },
    select: { role: true },
  });
  return member?.role ?? null;
}

export async function getNextTicketKey(projectId: string): Promise<string> {
  const project = await prisma.project.findUnique({
    where: { id: projectId },
    select: { key: true, _count: { select: { tickets: true } } },
  });
  if (!project) throw new Error('Project not found');
  const nextNum = project._count.tickets + 1;
  return `${project.key}-${nextNum}`;
}

export async function logActivity(
  ticketId: string,
  userId: string,
  action: string,
  field?: string,
  oldValue?: string,
  newValue?: string
) {
  await prisma.ticketActivity.create({
    data: { ticketId, userId, action, field, oldValue, newValue },
  });
}

export async function isValidAssignee(projectId: string, assigneeId: string | null | undefined): Promise<boolean> {
  if (!assigneeId) return true;
  const member = await prisma.projectMember.findUnique({
    where: { projectId_userId: { projectId, userId: assigneeId } },
    select: { id: true },
  });
  return !!member;
}

export async function isValidDepartment(projectId: string, departmentId: string | null | undefined): Promise<boolean> {
  if (!departmentId) return true;
  const department = await prisma.department.findUnique({
    where: { id: departmentId },
    select: { id: true, projectId: true },
  });
  return !!department && department.projectId === projectId;
}

export async function isAssigneeInDepartment(departmentId: string | null | undefined, assigneeId: string | null | undefined): Promise<boolean> {
  if (!departmentId || !assigneeId) return true;
  const membership = await prisma.departmentMember.findUnique({
    where: { departmentId_userId: { departmentId, userId: assigneeId } },
    select: { id: true },
  });
  return !!membership;
}

export interface MentionMember {
  userId: string;
  name: string | null;
  email: string;
}

export function extractMentionedUserIds(content: string, members: MentionMember[]): string[] {
  const tokens = new Set<string>();
  const matches = content.match(/@([^\s@]+)/g) || [];
  for (const m of matches) tokens.add(m.slice(1).toLowerCase().replace(/[^\w@.-]/g, ''));
  if (tokens.size === 0) return [];

  const ids = new Set<string>();
  for (const member of members) {
    const name = (member.name || '').toLowerCase();
    const nameCompact = name.replace(/[^a-z0-9]/g, '');
    const email = (member.email || '').toLowerCase();
    const emailPrefix = email.split('@')[0];
    if (tokens.has(email) || tokens.has(emailPrefix) || (name && (tokens.has(name) || tokens.has(nameCompact)))) {
      ids.add(member.userId);
    }
  }
  return Array.from(ids);
}
