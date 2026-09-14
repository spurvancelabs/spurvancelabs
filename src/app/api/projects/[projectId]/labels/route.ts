import { NextRequest, NextResponse } from 'next/server';
import { getProjectAccess } from '@/lib/projects/access';
import prisma from '@/lib/prisma';
import { canProject } from '@/lib/projects/permissions';

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

    const labels = await prisma.ticketLabel.findMany({
      where: { projectId },
      orderBy: { name: 'asc' },
    });

    return NextResponse.json({ data: labels });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch labels' }, { status: 500 });
  }
}

export async function POST(
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
      select: { role: true },
    });
    const isOwner = await prisma.project.findFirst({
      where: { id: projectId, ownerId: userId },
      select: { id: true },
    });

    const role = isOwner ? 'PROJECT_OWNER' : member?.role;
    if (!canProject(role, 'manage_labels')) {
      return NextResponse.json({ error: 'Insufficient permissions' }, { status: 403 });
    }

    const body = await req.json();
    const { name, color } = body;

    if (!name) {
      return NextResponse.json({ error: 'Name is required' }, { status: 400 });
    }

    const label = await prisma.ticketLabel.create({
      data: {
        projectId,
        name,
        color: color || '#6366f1',
      },
    });

    return NextResponse.json({ data: label }, { status: 201 });
  } catch (error: any) {
    if (error?.code === 'P2002') {
      return NextResponse.json({ error: 'Label name already exists in this project' }, { status: 409 });
    }
    return NextResponse.json({ error: 'Failed to create label' }, { status: 500 });
  }
}
