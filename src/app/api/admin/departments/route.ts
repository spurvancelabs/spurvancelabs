import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { requireSuperAdmin } from '@/lib/lms/utils';

export async function GET(req: NextRequest) {
  try {
    await requireSuperAdmin();

    const { searchParams } = new URL(req.url);
    const projectId = searchParams.get('projectId');

    const where = projectId ? { projectId } : {};

    const departments = await prisma.department.findMany({
      where,
      include: {
        _count: { select: { members: true, tickets: true } },
        members: {
          select: {
            user: { select: { id: true, name: true, email: true, image: true } },
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json({ departments });
  } catch (error: any) {
    if (error.message === 'Unauthorized' || error.message === 'Forbidden') {
      return NextResponse.json({ error: error.message }, { status: 401 });
    }
    return NextResponse.json({ error: error?.message || 'Something went wrong' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    await requireSuperAdmin();

    const { projectId, name, description, color } = await req.json();

    if (!projectId || !name?.trim()) {
      return NextResponse.json({ error: 'projectId and name are required' }, { status: 400 });
    }

    const project = await prisma.project.findUnique({ where: { id: projectId } });
    if (!project) {
      return NextResponse.json({ error: 'Project not found' }, { status: 404 });
    }

    const existing = await prisma.department.findUnique({
      where: { projectId_name: { projectId, name: name.trim() } },
    });
    if (existing) {
      return NextResponse.json({ error: 'A department with this name already exists in the project' }, { status: 409 });
    }

    const department = await prisma.department.create({
      data: {
        projectId,
        name: name.trim(),
        description: description || null,
        color: color || null,
      },
    });

    return NextResponse.json({ department }, { status: 201 });
  } catch (error: any) {
    if (error.message === 'Unauthorized' || error.message === 'Forbidden') {
      return NextResponse.json({ error: error.message }, { status: 401 });
    }
    return NextResponse.json({ error: error?.message || 'Something went wrong' }, { status: 500 });
  }
}
