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
