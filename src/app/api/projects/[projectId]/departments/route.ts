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

    const departments = await prisma.department.findMany({
      where: { projectId },
      include: {
        members: {
          select: {
            user: { select: { id: true, name: true, email: true, image: true } },
          },
        },
        _count: { select: { tickets: true } },
      },
      orderBy: { createdAt: 'asc' },
    });

    return NextResponse.json({ data: departments });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch departments' }, { status: 500 });
  }
}
