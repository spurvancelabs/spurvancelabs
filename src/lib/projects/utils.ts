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

export function canManageTicket(memberRole: string | null): boolean {
  return memberRole === 'PROJECT_OWNER' || memberRole === 'PROJECT_MANAGER';
}

export function canDeleteTicket(memberRole: string | null): boolean {
  return memberRole === 'PROJECT_OWNER';
}

export function canManageSprint(memberRole: string | null): boolean {
  return memberRole === 'PROJECT_OWNER' || memberRole === 'PROJECT_MANAGER';
}

export function canManageMembers(memberRole: string | null): boolean {
  return memberRole === 'PROJECT_OWNER';
}

export function canManageProjectSettings(memberRole: string | null): boolean {
  return memberRole === 'PROJECT_OWNER' || memberRole === 'PROJECT_MANAGER';
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
  await prisma.activity.create({
    data: { ticketId, userId, action, field, oldValue, newValue },
  });
}
