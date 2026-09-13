import { NextRequest, NextResponse } from 'next/server';
import { getProjectAccess } from '@/lib/projects/access';
import prisma from '@/lib/prisma';

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ projectId: string }> }
) {
  try {
    const access = await getProjectAccess();
    if (!access.ok) {
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

    const { searchParams } = new URL(req.url);
    const limit = Math.min(parseInt(searchParams.get('limit') || '50'), 100);

    const activities = await prisma.ticketActivity.findMany({
      where: { ticket: { projectId } },
      include: {
        user: { select: { id: true, name: true, email: true } },
        ticket: { select: { id: true, key: true, title: true, status: true } },
      },
      orderBy: { createdAt: 'desc' },
      take: limit,
    });

    return NextResponse.json({ data: activities });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch activities' }, { status: 500 });
  }
}
