import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { verifyToken } from '@/lib/auth';
import prisma from '@/lib/prisma';
import { getNextTicketKey } from '@/lib/projects/utils';

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
    });
    const isOwner = await prisma.project.findFirst({
      where: { id: projectId, ownerId: userId },
      select: { id: true },
    });

    if (!member && !isOwner) {
      return NextResponse.json({ error: 'Access denied' }, { status: 403 });
    }

    const { searchParams } = new URL(req.url);
    const status = searchParams.get('status');
    const assigneeId = searchParams.get('assigneeId');
    const priority = searchParams.get('priority');
    const sprintId = searchParams.get('sprintId');
    const search = searchParams.get('search');
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '50');

    const where: Record<string, any> = { projectId };
    if (status) where.status = status;
    if (assigneeId) where.assigneeId = assigneeId;
    if (priority) where.priority = priority;
    if (sprintId) where.sprintId = sprintId;
    if (search) {
      where.OR = [
        { title: { contains: search, mode: 'insensitive' } },
        { key: { contains: search, mode: 'insensitive' } },
      ];
    }

    const [tickets, total] = await Promise.all([
      prisma.ticket.findMany({
        where,
        skip: (page - 1) * limit,
        take: limit,
        orderBy: { order: 'asc' },
        include: {
          assignee: { select: { id: true, name: true, email: true, image: true } },
          reporter: { select: { id: true, name: true, email: true, image: true } },
          _count: { select: { comments: true, attachments: true } },
        },
      }),
      prisma.ticket.count({ where }),
    ]);

    return NextResponse.json({ data: tickets, total, page, limit });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch tickets' }, { status: 500 });
  }
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
    });
    const isOwner = await prisma.project.findFirst({
      where: { id: projectId, ownerId: userId },
      select: { id: true },
    });

    if (!member && !isOwner) {
      return NextResponse.json({ error: 'Access denied' }, { status: 403 });
    }

    const body = await req.json();
    const { title, description, type, priority, assigneeId, sprintId, labels, storyPoints, dueDate, parentId } = body;

    if (!title) {
      return NextResponse.json({ error: 'Title is required' }, { status: 400 });
    }

    const key = await getNextTicketKey(projectId);

    const maxOrder = await prisma.ticket.aggregate({
      where: { projectId },
      _max: { order: true },
    });

    const ticket = await prisma.ticket.create({
      data: {
        projectId,
        key,
        title,
        description,
        type: type || 'TASK',
        priority: priority || 'MEDIUM',
        reporterId: userId,
        assigneeId: assigneeId || null,
        sprintId: sprintId || null,
        parentId: parentId || null,
        labels: labels || [],
        storyPoints: storyPoints || null,
        dueDate: dueDate || null,
        order: (maxOrder._max.order ?? 0) + 1,
      },
      include: {
        assignee: { select: { id: true, name: true, email: true, image: true } },
        reporter: { select: { id: true, name: true, email: true, image: true } },
        _count: { select: { comments: true, attachments: true } },
      },
    });

    return NextResponse.json({ data: ticket }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to create ticket' }, { status: 500 });
  }
}
