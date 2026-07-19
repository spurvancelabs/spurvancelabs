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
      select: { id: true },
    });

    if (!ticket) {
      return NextResponse.json({ error: 'Ticket not found' }, { status: 404 });
    }

    const comments = await prisma.ticketComment.findMany({
      where: { ticketId },
      include: {
        user: { select: { id: true, name: true, email: true, image: true } },
      },
      orderBy: { createdAt: 'asc' },
    });

    return NextResponse.json({ data: comments });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch comments' }, { status: 500 });
  }
}

export async function POST(
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
      select: { id: true },
    });

    if (!ticket) {
      return NextResponse.json({ error: 'Ticket not found' }, { status: 404 });
    }

    const body = await req.json();
    const { content } = body;

    if (!content) {
      return NextResponse.json({ error: 'Content is required' }, { status: 400 });
    }

    const comment = await prisma.ticketComment.create({
      data: {
        ticketId,
        userId,
        content,
      },
      include: {
        user: { select: { id: true, name: true, email: true, image: true } },
      },
    });

    await logActivity(ticketId, userId, 'COMMENTED', 'content', '', content.slice(0, 200));

    return NextResponse.json({ data: comment }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to add comment' }, { status: 500 });
  }
}
