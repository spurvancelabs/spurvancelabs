import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { verifyToken } from '@/lib/auth';
import prisma from '@/lib/prisma';
import { getNextTicketKey, isValidAssignee, isValidDepartment, isAssigneeInDepartment } from '@/lib/projects/utils';
import { canProject } from '@/lib/projects/permissions';
import { NotificationTrigger } from '@/lib/notification/trigger';
import { AdminNotificationService } from '@/lib/admin-notifications/service';

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
          sprint: { select: { id: true, name: true, status: true } },
          parent: { select: { id: true, key: true, title: true } },
          department: { select: { id: true, name: true, color: true } },
          _count: { select: { comments: true, attachments: true, timeLogs: true } },
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

    const role = isOwner ? 'PROJECT_OWNER' : member?.role;
    if (!canProject(role, 'manage_tickets')) {
      return NextResponse.json({ error: 'Insufficient permissions' }, { status: 403 });
    }

    const body = await req.json();
    const { title, description, type, priority, assigneeId, sprintId, labels, storyPoints, startDate, dueDate, parentId, departmentId } = body;

    if (!title) {
      return NextResponse.json({ error: 'Title is required' }, { status: 400 });
    }

    if (assigneeId && !(await isValidAssignee(projectId, assigneeId))) {
      return NextResponse.json({ error: 'Assignee must be a project member' }, { status: 400 });
    }

    if (!(await isValidDepartment(projectId, departmentId))) {
      return NextResponse.json({ error: 'Department must belong to this project' }, { status: 400 });
    }

    if (!(await isAssigneeInDepartment(departmentId, assigneeId))) {
      return NextResponse.json({ error: 'Assignee must be a member of the selected department' }, { status: 400 });
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
        departmentId: departmentId || null,
        labels: labels || [],
        storyPoints: storyPoints || null,
        startDate: startDate || null,
        dueDate: dueDate || null,
        order: (maxOrder._max.order ?? 0) + 1,
      },
      include: {
        assignee: { select: { id: true, name: true, email: true, image: true } },
        reporter: { select: { id: true, name: true, email: true, image: true } },
        sprint: { select: { id: true, name: true, status: true } },
        parent: { select: { id: true, key: true, title: true } },
        department: { select: { id: true, name: true, color: true } },
        _count: { select: { comments: true, attachments: true, timeLogs: true } },
      },
    });

    if (assigneeId && assigneeId !== userId) {
      try {
        await NotificationTrigger.triggerNotification({
          user_id: assigneeId,
          type: 'info',
          title: 'Assigned to ticket',
          message: `${ticket.key}: ${title}`,
          priority: 'medium',
          link: `/projects/${projectId}/board`,
          sender_id: userId,
        });
      } catch { /* best effort */ }
    }

    try {
      await AdminNotificationService.notifyAdmins({
        type: 'ticket',
        title: 'New ticket created',
        message: `${ticket.key}: ${title}`,
        priority: 'medium',
        link: `/projects/${projectId}/board`,
      });
    } catch { /* best effort */ }

    return NextResponse.json({ data: ticket }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to create ticket' }, { status: 500 });
  }
}
