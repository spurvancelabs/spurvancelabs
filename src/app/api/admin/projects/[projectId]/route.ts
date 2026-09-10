import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { requireSuperAdmin } from '@/lib/lms/utils';

const STATUSES = ['ACTIVE', 'ON_HOLD', 'COMPLETED', 'ARCHIVED'];

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ projectId: string }> }
) {
  try {
    await requireSuperAdmin();

    const { projectId } = await params;
    const body = await req.json();
    const { name, description, status, color } = body;

    if (name !== undefined && !String(name).trim()) {
      return NextResponse.json({ error: 'Project name cannot be empty' }, { status: 400 });
    }
    if (status !== undefined && !STATUSES.includes(status)) {
      return NextResponse.json({ error: 'Invalid status' }, { status: 400 });
    }

    const existing = await prisma.project.findUnique({
      where: { id: projectId },
      select: { id: true },
    });
    if (!existing) {
      return NextResponse.json({ error: 'Project not found' }, { status: 404 });
    }

    const project = await prisma.project.update({
      where: { id: projectId },
      data: {
        ...(name !== undefined && { name: String(name).trim() }),
        ...(description !== undefined && { description: description ? String(description).trim() : null }),
        ...(status !== undefined && { status }),
        ...(color !== undefined && { color }),
      },
      include: {
        owner: { select: { id: true, name: true, email: true, image: true } },
        _count: { select: { members: true, tickets: true, sprints: true } },
      },
    });

    return NextResponse.json({ data: project });
  } catch (error: any) {
    if (error?.message === 'Unauthorized' || error?.message === 'Forbidden') {
      return NextResponse.json({ error: error.message }, { status: 401 });
    }
    console.error('Admin project update failed:', error);
    return NextResponse.json({ error: 'Unable to update project. Please try again.' }, { status: 500 });
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ projectId: string }> }
) {
  try {
    await requireSuperAdmin();

    const { projectId } = await params;

    const existing = await prisma.project.findUnique({
      where: { id: projectId },
      select: { id: true },
    });
    if (!existing) {
      return NextResponse.json({ error: 'Project not found' }, { status: 404 });
    }

    await prisma.project.delete({ where: { id: projectId } });

    return NextResponse.json({ message: 'Project deleted' });
  } catch (error: any) {
    if (error?.message === 'Unauthorized' || error?.message === 'Forbidden') {
      return NextResponse.json({ error: error.message }, { status: 401 });
    }
    console.error('Admin project deletion failed:', error);
    return NextResponse.json({ error: 'Unable to delete project. Please try again.' }, { status: 500 });
  }
}
