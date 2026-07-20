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
    const sprintId = searchParams.get('sprintId');

    if (!sprintId) {
      return NextResponse.json({ error: 'sprintId is required' }, { status: 400 });
    }

    const sprint = await prisma.sprint.findFirst({
      where: { id: sprintId, projectId },
    });

    if (!sprint) {
      return NextResponse.json({ error: 'Sprint not found' }, { status: 404 });
    }

    const startDate = sprint.startDate ? new Date(sprint.startDate) : null;
    const endDate = sprint.endDate ? new Date(sprint.endDate) : new Date();

    if (!startDate) {
      return NextResponse.json({ error: 'Sprint has no start date' }, { status: 400 });
    }

    const totalTickets = await prisma.ticket.count({
      where: { sprintId, projectId },
    });

    const completedTickets = await prisma.ticket.count({
      where: { sprintId, projectId, status: 'DONE' },
    });

    const totalStoryPoints = await prisma.ticket.aggregate({
      where: { sprintId, projectId },
      _sum: { storyPoints: true },
    });

    const completedStoryPoints = await prisma.ticket.aggregate({
      where: { sprintId, projectId, status: 'DONE' },
      _sum: { storyPoints: true },
    });

    const totalPoints = totalStoryPoints._sum.storyPoints || totalTickets;
    const completedPoints = completedStoryPoints._sum.storyPoints || completedTickets;

    const daysDiff = Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24));
    const totalDays = Math.max(daysDiff, 1);

    const idealLine: { day: number; date: string; points: number }[] = [];
    for (let i = 0; i <= totalDays; i++) {
      const date = new Date(startDate);
      date.setDate(date.getDate() + i);
      idealLine.push({
        day: i,
        date: date.toISOString().split('T')[0],
        points: totalPoints - (totalPoints * i) / totalDays,
      });
    }

    const ticketUpdates = await prisma.ticket.findMany({
      where: {
        sprintId,
        projectId,
        status: 'DONE',
      },
      select: { updatedAt: true, storyPoints: true },
    });

    const pointsByDate: Record<string, number> = {};
    for (const ticket of ticketUpdates) {
      const dateStr = new Date(ticket.updatedAt).toISOString().split('T')[0];
      if (!pointsByDate[dateStr]) pointsByDate[dateStr] = 0;
      pointsByDate[dateStr] += ticket.storyPoints || 1;
    }

    const actualData: { day: number; date: string; points: number }[] = [];
    let remainingPoints = totalPoints;
    for (let i = 0; i <= totalDays; i++) {
      const date = new Date(startDate);
      date.setDate(date.getDate() + i);
      const dateStr = date.toISOString().split('T')[0];

      if (pointsByDate[dateStr]) {
        remainingPoints -= pointsByDate[dateStr];
      }
      actualData.push({
        day: i,
        date: dateStr,
        points: Math.max(remainingPoints, 0),
      });
    }

    return NextResponse.json({
      data: {
        sprint: { id: sprint.id, name: sprint.name, startDate: sprint.startDate, endDate: sprint.endDate },
        totalPoints,
        idealLine,
        actualData,
      },
    });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to generate burndown report' }, { status: 500 });
  }
}
