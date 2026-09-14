import { NextRequest, NextResponse } from 'next/server';
import { isProjectReadOnlyRole } from '@/lib/lms/permissions';
import { getProjectAccess } from '@/lib/projects/access';
import prisma from '@/lib/prisma';
import { logActivity } from '@/lib/projects/utils';

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ projectId: string; ticketId: string }> }
) {
  try {
    const access = await getProjectAccess();
    if (access.ok === false) {
      return NextResponse.json({ error: 'Access denied' }, { status: access.status });
    }
    const userId = access.userId;

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
      select: { id: true },
    });

    if (!ticket) {
      return NextResponse.json({ error: 'Ticket not found' }, { status: 404 });
    }

    const timeLogs = await prisma.timeLog.findMany({
      where: { ticketId },
      include: {
        user: { select: { id: true, name: true, email: true } },
      },
      orderBy: { date: 'desc' },
    });

    return NextResponse.json({ data: timeLogs });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch time logs' }, { status: 500 });
  }
}

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ projectId: string; ticketId: string }> }
) {
  try {
    const access = await getProjectAccess();
    if (access.ok === false) {
      return NextResponse.json({ error: 'Access denied' }, { status: access.status });
    }
    if (isProjectReadOnlyRole(access.role)) {
      return NextResponse.json({ error: 'Access denied' }, { status: 403 });
    }
    const userId = access.userId;

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
      select: { id: true },
    });

    if (!ticket) {
      return NextResponse.json({ error: 'Ticket not found' }, { status: 404 });
    }

    const body = await req.json();
    const { hours, description, date } = body;

    if (!hours || hours <= 0) {
      return NextResponse.json({ error: 'Valid hours are required' }, { status: 400 });
    }

    const timeLog = await prisma.timeLog.create({
      data: {
        ticketId,
        userId,
        hours: parseFloat(hours),
        description: description || null,
        date: date ? new Date(date) : new Date(),
      },
      include: {
        user: { select: { id: true, name: true, email: true } },
      },
    });

    await logActivity(ticketId, userId, 'LOGGED_TIME', 'hours', '', `${hours}h`);

    return NextResponse.json({ data: timeLog }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to log time' }, { status: 500 });
  }
}
