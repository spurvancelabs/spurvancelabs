import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { verifyToken } from '@/lib/auth';
import prisma from '@/lib/prisma';
import { canProject } from '@/lib/projects/permissions';
import { isValidAssignee } from '@/lib/projects/utils';

async function getAuthUserId(): Promise<string | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get('token')?.value;
  if (!token) return null;
  const payload = await verifyToken(token);
  if (!payload?.userId) return null;
  return payload.userId;
}

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ projectId: string }> }
) {
  try {
    const userId = await getAuthUserId();
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { projectId } = await params;

    const member = await prisma.projectMember.findUnique({
      where: { projectId_userId: { projectId, userId } },
      select: { role: true },
    });
    const isOwner = await prisma.project.findFirst({
      where: { id: projectId, ownerId: userId },
      select: { id: true },
    });

    const role = isOwner ? 'PROJECT_OWNER' : member?.role;
    if (!canProject(role, 'manage_sprints')) {
      return NextResponse.json({ error: 'Insufficient permissions' }, { status: 403 });
    }

    const body = await req.json();
    const { ticketIds, updates } = body;

    if (!Array.isArray(ticketIds) || ticketIds.length === 0) {
      return NextResponse.json({ error: 'ticketIds is required and must be a non-empty array' }, { status: 400 });
    }

    if (!updates || typeof updates !== 'object') {
      return NextResponse.json({ error: 'updates is required' }, { status: 400 });
    }

    const data: Record<string, any> = {};
    if (updates.status !== undefined) data.status = updates.status;
    if (updates.assigneeId !== undefined) data.assigneeId = updates.assigneeId || null;
    if (updates.priority !== undefined) data.priority = updates.priority;
    if (updates.sprintId !== undefined) data.sprintId = updates.sprintId || null;

    if (Object.keys(data).length === 0) {
      return NextResponse.json({ error: 'No valid update fields provided' }, { status: 400 });
    }

    if (data.assigneeId !== null && data.assigneeId !== undefined && !(await isValidAssignee(projectId, data.assigneeId))) {
      return NextResponse.json({ error: 'Assignee must be a project member' }, { status: 400 });
    }

    const result = await prisma.ticket.updateMany({
      where: {
        id: { in: ticketIds },
        projectId,
      },
      data,
    });

    return NextResponse.json({ data: { updated: result.count } });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to bulk update tickets' }, { status: 500 });
  }
}
