import { NextRequest, NextResponse } from 'next/server';
import { getProjectAccess } from '@/lib/projects/access';
import prisma from '@/lib/prisma';

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ projectId: string }> }
) {
  try {
    const access = await getProjectAccess();
    if (access.ok === false) {
      return NextResponse.json({ error: 'Access denied' }, { status: access.status });
    }
    const userId = access.userId;

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

    const sprints = await prisma.sprint.findMany({
      where: { projectId, status: 'COMPLETED' },
      orderBy: { endDate: 'asc' },
    });

    const velocityData = await Promise.all(
      sprints.map(async (sprint) => {
        const tickets = await prisma.ticket.findMany({
          where: { sprintId: sprint.id, status: 'DONE' },
          select: { storyPoints: true },
        });

        const totalPoints = tickets.reduce((sum, t) => sum + (t.storyPoints || 0), 0);
        const totalTickets = tickets.length;

        const allTickets = await prisma.ticket.count({
          where: { sprintId: sprint.id },
        });

        return {
          sprintId: sprint.id,
          sprintName: sprint.name,
          startDate: sprint.startDate,
          endDate: sprint.endDate,
          completedPoints: totalPoints,
          completedTickets: totalTickets,
          totalTickets: allTickets,
          completionRate: allTickets > 0 ? Math.round((totalTickets / allTickets) * 100) : 0,
        };
      })
    );

    const avgVelocity = velocityData.length > 0
      ? velocityData.reduce((sum, v) => sum + v.completedPoints, 0) / velocityData.length
      : 0;

    const avgCompletionRate = velocityData.length > 0
      ? velocityData.reduce((sum, v) => sum + v.completionRate, 0) / velocityData.length
      : 0;

    return NextResponse.json({
      data: {
        sprints: velocityData,
        averageVelocity: Math.round(avgVelocity * 10) / 10,
        averageCompletionRate: Math.round(avgCompletionRate),
        sprintCount: velocityData.length,
      },
    });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to generate velocity report' }, { status: 500 });
  }
}
