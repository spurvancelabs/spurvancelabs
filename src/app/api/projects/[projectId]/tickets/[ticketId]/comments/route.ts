import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { verifyToken } from '@/lib/auth';
import prisma from '@/lib/prisma';
import { logActivity, extractMentionedUserIds } from '@/lib/projects/utils';
import { NotificationTrigger } from '@/lib/notification/trigger';

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
      select: { id: true, key: true, title: true, assigneeId: true, reporterId: true },
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

    try {
      const [commenter, projectMembers] = await Promise.all([
        prisma.user.findUnique({ where: { id: userId }, select: { name: true, email: true } }),
        prisma.projectMember.findMany({
          where: { projectId },
          select: { userId: true, user: { select: { name: true, email: true } } },
        }),
      ]);

      const commenterName = commenter?.name || commenter?.email || 'Someone';
      const mentionedIds = extractMentionedUserIds(
        content,
        (projectMembers || []).map(m => ({ userId: m.userId, name: m.user?.name ?? null, email: m.user?.email ?? '' }))
      );

      const recipients = new Set<string>();
      if (ticket.assigneeId && ticket.assigneeId !== userId) recipients.add(ticket.assigneeId);
      if (ticket.reporterId && ticket.reporterId !== userId) recipients.add(ticket.reporterId);
      for (const id of mentionedIds) {
        if (id !== userId) recipients.add(id);
      }

      for (const recipientId of recipients) {
        const isMentioned = mentionedIds.includes(recipientId);
        await NotificationTrigger.triggerNotification({
          user_id: recipientId,
          type: 'info',
          title: isMentioned ? `Mentioned in ${ticket.key}` : `New comment on ${ticket.key}`,
          message: isMentioned
            ? `${commenterName} mentioned you: ${content.slice(0, 120)}`
            : `${commenterName} commented on ${ticket.key}: ${content.slice(0, 120)}`,
          priority: 'medium',
          link: `/projects/${projectId}/board`,
          sender_id: userId,
        });
      }
    } catch { /* best effort */ }

    return NextResponse.json({ data: comment }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to add comment' }, { status: 500 });
  }
}
