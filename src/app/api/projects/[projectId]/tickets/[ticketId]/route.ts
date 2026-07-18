import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { verifyToken } from '@/lib/auth';
import prisma from '@/lib/prisma';
import { logActivity } from '@/lib/projects/utils';

async function getAuthUserId(): Promise<string | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get('token')?.value;
  if (!token) return null;
  const payload = await verifyToken(token);
  if (!payload?.userId) return null;
  return payload.userId;
}

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ projectId: string; ticketId: string }> }
) {
  try {
    const userId = await getAuthUserId();
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { projectId, ticketId } = await params;

    const member = await prisma.projectMember.findUnique({
      where: { projectId_userId: { projectId, userId } },
    });
    const isOwner = await prisma.project.findFirst({
      where: { id: projectId, ownerId: userId },
      select: { id: true },
    });

    if (!member && !isOwner) {
      return NextResponse.json({ error: 'Access denied' }, { status: 403 });
    }

    const ticket = await prisma.ticket.findFirst({
      where: { id: ticketId, projectId },
      include: {
        assignee: { select: { id: true, name: true, email: true, image: true } },
        reporter: { select: { id: true, name: true, email: true, image: true } },
        sprint: { select: { id: true, name: true, status: true } },
        parent: { select: { id: true, key: true, title: true } },
        children: {
          select: { id: true, key: true, title: true, status: true, priority: true, storyPoints: true },
          orderBy: { order: 'asc' },
        },
        comments: {
          include: {
            user: { select: { id: true, name: true, email: true, image: true } },
          },
          orderBy: { createdAt: 'desc' },
        },
        attachments: {
          include: {
            user: { select: { id: true, name: true, email: true } },
          },
          orderBy: { createdAt: 'desc' },
        },
        timeLogs: {
          include: {
            user: { select: { id: true, name: true, email: true } },
          },
          orderBy: { date: 'desc' },
        },
        activities: {
          include: {
            user: { select: { id: true, name: true, email: true } },
          },
          orderBy: { createdAt: 'desc' },
        },
      },
    });

    if (!ticket) {
      return NextResponse.json({ error: 'Ticket not found' }, { status: 404 });
    }

    return NextResponse.json({ data: ticket });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch ticket' }, { status: 500 });
  }
}

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ projectId: string; ticketId: string }> }
) {
  try {
    const userId = await getAuthUserId();
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { projectId, ticketId } = await params;

    const member = await prisma.projectMember.findUnique({
      where: { projectId_userId: { projectId, userId } },
      select: { role: true },
    });
    const isOwner = await prisma.project.findFirst({
      where: { id: projectId, ownerId: userId },
      select: { id: true },
    });

    if (!member && !isOwner) {
      return NextResponse.json({ error: 'Access denied' }, { status: 403 });
    }

    const existing = await prisma.ticket.findFirst({
      where: { id: ticketId, projectId },
    });

    if (!existing) {
      return NextResponse.json({ error: 'Ticket not found' }, { status: 404 });
    }

    const body = await req.json();
    const fields = [
      'title', 'description', 'status', 'priority', 'type',
      'assigneeId', 'sprintId', 'storyPoints', 'order',
      'startDate', 'dueDate', 'estimatedHours', 'labels', 'parentId',
    ];

    const data: Record<string, any> = {};
    const changes: { field: string; oldValue: string; newValue: string }[] = [];

    for (const field of fields) {
      if (body[field] !== undefined) {
        const oldVal = existing[field as keyof typeof existing];
        const newVal = body[field];
        const oldStr = oldVal === null || oldVal === undefined ? '' : String(oldVal);
        const newStr = newVal === null || newVal === undefined ? '' : String(newVal);
        if (oldStr !== newStr) {
          changes.push({ field, oldValue: oldStr, newValue: newStr });
        }
        data[field] = newVal;
      }
    }

    const ticket = await prisma.ticket.update({
      where: { id: ticketId },
      data,
      include: {
        assignee: { select: { id: true, name: true, email: true, image: true } },
        reporter: { select: { id: true, name: true, email: true, image: true } },
        _count: { select: { comments: true, attachments: true } },
      },
    });

    for (const change of changes) {
      await logActivity(ticketId, userId, 'UPDATED', change.field, change.oldValue, change.newValue);
    }

    return NextResponse.json({ data: ticket });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update ticket' }, { status: 500 });
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ projectId: string; ticketId: string }> }
) {
  try {
    const userId = await getAuthUserId();
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { projectId, ticketId } = await params;

    const member = await prisma.projectMember.findUnique({
      where: { projectId_userId: { projectId, userId } },
      select: { role: true },
    });
    const isOwner = await prisma.project.findFirst({
      where: { id: projectId, ownerId: userId },
      select: { id: true },
    });

    if (!isOwner && member?.role !== 'PROJECT_OWNER' && member?.role !== 'PROJECT_MANAGER') {
      return NextResponse.json({ error: 'Insufficient permissions' }, { status: 403 });
    }

    const ticket = await prisma.ticket.findFirst({
      where: { id: ticketId, projectId },
    });

    if (!ticket) {
      return NextResponse.json({ error: 'Ticket not found' }, { status: 404 });
    }

    await prisma.ticket.delete({ where: { id: ticketId } });

    return NextResponse.json({ message: 'Ticket deleted' });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to delete ticket' }, { status: 500 });
  }
}
