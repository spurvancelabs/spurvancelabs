import { cookies } from 'next/headers';
import { redirect, notFound } from 'next/navigation';
import { verifyToken } from '@/lib/auth';
import prisma from '@/lib/prisma';
import TicketDetailPageClient from './client';

export const dynamic = 'force-dynamic';

export default async function TicketDetailPage({
  params,
}: {
  params: Promise<{ projectId: string; ticketId: string }>;
}) {
  const cookieStore = await cookies();
  const token = cookieStore.get('token')?.value;
  if (!token) redirect('/login');

  const payload = await verifyToken(token);
  if (!payload?.userId) redirect('/login');

  const { projectId, ticketId } = await params;

  const member = await prisma.projectMember.findUnique({
    where: { projectId_userId: { projectId, userId: payload.userId } },
  });
  const isOwner = await prisma.project.findFirst({
    where: { id: projectId, ownerId: payload.userId },
    select: { id: true },
  });

  if (!member && !isOwner) redirect('/projects');

  const [ticket, project, members, sprints] = await Promise.all([
    prisma.ticket.findFirst({
      where: { id: ticketId, projectId },
      include: {
        assignee: { select: { id: true, name: true, email: true, image: true } },
        reporter: { select: { id: true, name: true, email: true, image: true } },
        sprint: { select: { id: true, name: true, status: true } },
        parent: { select: { id: true, key: true, title: true } },
        comments: {
          include: { user: { select: { id: true, name: true, email: true, image: true } } },
          orderBy: { createdAt: 'desc' },
        },
        attachments: {
          include: { user: { select: { id: true, name: true, email: true } } },
          orderBy: { createdAt: 'desc' },
        },
        timeLogs: {
          include: { user: { select: { id: true, name: true, email: true } } },
          orderBy: { date: 'desc' },
        },
        activities: {
          include: { user: { select: { id: true, name: true, email: true } } },
          orderBy: { createdAt: 'desc' },
        },
      },
    }),
    prisma.project.findUnique({
      where: { id: projectId },
      select: { id: true, name: true, key: true },
    }),
    prisma.projectMember.findMany({
      where: { projectId },
      select: { id: true, role: true, user: { select: { id: true, name: true, email: true } } },
    }),
    prisma.sprint.findMany({
      where: { projectId },
      orderBy: { createdAt: 'desc' },
      select: { id: true, name: true, status: true },
    }),
  ]);

  if (!ticket || !project) notFound();

  return (
    <TicketDetailPageClient
      ticketId={ticketId}
      projectId={projectId}
      ticketData={JSON.parse(JSON.stringify(ticket))}
      projectData={JSON.parse(JSON.stringify(project))}
      membersData={JSON.parse(JSON.stringify(members))}
      sprintsData={JSON.parse(JSON.stringify(sprints))}
    />
  );
}
