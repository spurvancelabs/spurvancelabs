import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { verifyToken } from '@/lib/auth';
import prisma from '@/lib/prisma';

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
  { params }: { params: Promise<{ projectId: string; sprintId: string }> }
) {
  try {
    const userId = await getAuthUserId();
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { projectId, sprintId } = await params;

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

    const sprint = await prisma.sprint.findFirst({
      where: { id: sprintId, projectId },
      include: {
        tickets: {
          include: {
            assignee: { select: { id: true, name: true, email: true, image: true } },
            _count: { select: { comments: true, attachments: true } },
          },
          orderBy: { order: 'asc' },
        },
        _count: { select: { tickets: true } },
      },
    });

    if (!sprint) {
      return NextResponse.json({ error: 'Sprint not found' }, { status: 404 });
    }

    return NextResponse.json({ data: sprint });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch sprint' }, { status: 500 });
  }
}

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ projectId: string; sprintId: string }> }
) {
  try {
    const userId = await getAuthUserId();
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { projectId, sprintId } = await params;

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

    const existing = await prisma.sprint.findFirst({
      where: { id: sprintId, projectId },
    });

    if (!existing) {
      return NextResponse.json({ error: 'Sprint not found' }, { status: 404 });
    }

    const body = await req.json();
    const { name, goal, startDate, endDate, status } = body;

    const data: Record<string, any> = {};
    if (name !== undefined) data.name = name;
    if (goal !== undefined) data.goal = goal;
    if (startDate !== undefined) data.startDate = startDate ? new Date(startDate) : null;
    if (endDate !== undefined) data.endDate = endDate ? new Date(endDate) : null;

    let movedTickets = 0;

    if (status !== undefined && status !== existing.status) {
      if (status === 'ACTIVE' && existing.status === 'PLANNING') {
        data.status = 'ACTIVE';
        if (!existing.startDate) {
          data.startDate = new Date();
        }
      } else if (status === 'COMPLETED' && existing.status === 'ACTIVE') {
        data.status = 'COMPLETED';
        if (!existing.endDate) {
          data.endDate = new Date();
        }
        const result = await prisma.ticket.updateMany({
          where: {
            sprintId,
            status: { notIn: ['DONE'] },
          },
          data: { sprintId: null },
        });
        movedTickets = result.count;
      } else {
        return NextResponse.json({ error: `Cannot transition from ${existing.status} to ${status}` }, { status: 400 });
      }
    }

    const sprint = await prisma.sprint.update({
      where: { id: sprintId },
      data,
      include: {
        _count: { select: { tickets: true } },
      },
    });

    return NextResponse.json({ data: sprint, movedTickets });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update sprint' }, { status: 500 });
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ projectId: string; sprintId: string }> }
) {
  try {
    const userId = await getAuthUserId();
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { projectId, sprintId } = await params;

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

    const sprint = await prisma.sprint.findFirst({
      where: { id: sprintId, projectId },
    });

    if (!sprint) {
      return NextResponse.json({ error: 'Sprint not found' }, { status: 404 });
    }

    await prisma.ticket.updateMany({
      where: { sprintId },
      data: { sprintId: null },
    });

    await prisma.sprint.delete({ where: { id: sprintId } });

    return NextResponse.json({ message: 'Sprint deleted' });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to delete sprint' }, { status: 500 });
  }
}
