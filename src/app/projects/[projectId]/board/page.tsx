import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { verifyToken } from '@/lib/auth';
import prisma from '@/lib/prisma';
import KanbanBoard from '@/components/projects/KanbanBoard';

export const dynamic = 'force-dynamic';

interface BoardPageProps {
  params: Promise<{ projectId: string }>;
}

export default async function BoardPage({ params }: BoardPageProps) {
  const { projectId } = await params;

  const cookieStore = await cookies();
  const token = cookieStore.get('token')?.value;
  if (!token) redirect('/login');

  const payload = await verifyToken(token);
  if (!payload?.userId) redirect('/login');

  const [project, tickets, members, sprints] = await Promise.all([
    prisma.project.findUnique({
      where: { id: projectId },
      select: {
        id: true,
        name: true,
        key: true,
        description: true,
        status: true,
        color: true,
        icon: true,
        owner: { select: { id: true, name: true, email: true, image: true } },
        _count: { select: { members: true, tickets: true, sprints: true } },
      },
    }),
    prisma.ticket.findMany({
      where: { projectId },
      orderBy: [{ status: 'asc' }, { order: 'asc' }],
      select: {
        id: true,
        key: true,
        title: true,
        description: true,
        status: true,
        priority: true,
        type: true,
        storyPoints: true,
        order: true,
        startDate: true,
        dueDate: true,
        estimatedHours: true,
        labels: true,
        createdAt: true,
        updatedAt: true,
        assignee: { select: { id: true, name: true, email: true, image: true } },
        reporter: { select: { id: true, name: true, email: true, image: true } },
        sprint: { select: { id: true, name: true, status: true } },
        parent: { select: { id: true, key: true, title: true } },
        _count: { select: { comments: true, attachments: true, timeLogs: true } },
      },
    }),
    prisma.projectMember.findMany({
      where: { projectId },
      select: {
        id: true,
        role: true,
        user: { select: { id: true, name: true, email: true, image: true } },
      },
    }),
    prisma.sprint.findMany({
      where: { projectId },
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        name: true,
        status: true,
        startDate: true,
        endDate: true,
        _count: { select: { tickets: true } },
      },
    }),
  ]);

  if (!project) redirect('/projects');

  return (
    <KanbanBoard
      project={project}
      initialTickets={tickets as unknown as KanbanBoardTicket[]}
      members={members.map((m) => ({
        id: m.user.id,
        name: m.user.name,
        email: m.user.email,
        image: m.user.image,
        role: m.role,
      }))}
      sprints={sprints}
      currentUserId={payload.userId}
    />
  );
}

export interface KanbanBoardTicket {
  id: string;
  key: string;
  title: string;
  description: string | null;
  status: string;
  priority: string;
  type: string;
  storyPoints: number | null;
  order: number;
  startDate: Date | null;
  dueDate: Date | null;
  estimatedHours: number | null;
  labels: string[];
  createdAt: Date;
  updatedAt: Date;
  assignee: { id: string; name: string | null; email: string; image: string | null } | null;
  reporter: { id: string; name: string | null; email: string; image: string | null };
  sprint: { id: string; name: string; status: string } | null;
  parent: { id: string; key: string; title: string } | null;
  _count: { comments: number; attachments: number; timeLogs: number };
}
