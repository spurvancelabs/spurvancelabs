import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { requireSuperAdmin } from '@/lib/lms/utils';
import { getAvailableProjectKey } from '@/lib/projects/key';

export async function GET() {
  try {
    await requireSuperAdmin();

    const projects = await prisma.project.findMany({
      include: {
        owner: { select: { id: true, name: true, email: true, image: true } },
        _count: { select: { members: true, tickets: true, sprints: true } },
      },
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json({ projects });
  } catch (error: any) {
    if (error.message === 'Unauthorized' || error.message === 'Forbidden') {
      return NextResponse.json({ error: error.message }, { status: 401 });
    }
    return NextResponse.json({ error: error?.message || 'Something went wrong' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const user = await requireSuperAdmin();
    const body = await req.json();
    const { name, description, key, color } = body;

    if (!name?.trim()) return NextResponse.json({ error: 'Project name is required' }, { status: 400 });
    if (key && !/^[A-Za-z0-9]{1,10}$/.test(key)) {
      return NextResponse.json({ error: 'Project key must be 1–10 letters or numbers' }, { status: 400 });
    }

    const projectKey = await getAvailableProjectKey(name.trim(), key || null);
    const project = await prisma.$transaction(async tx => {
      const created = await tx.project.create({
        data: {
          name: name.trim(),
          description: description?.trim() || null,
          key: projectKey,
          color: color || null,
          ownerId: user.id,
          members: { create: { userId: user.id, role: 'PROJECT_OWNER' } },
        },
        include: {
          owner: { select: { id: true, name: true, email: true, image: true } },
          _count: { select: { members: true, tickets: true, sprints: true } },
        },
      });
      return created;
    });

    return NextResponse.json({ data: project }, { status: 201 });
  } catch (error: any) {
    if (error?.message === 'Unauthorized' || error?.message === 'Forbidden') return NextResponse.json({ error: error.message }, { status: 401 });
    if (error?.code === 'P2002') return NextResponse.json({ error: 'A project with that key already exists. Please choose another key.' }, { status: 409 });
    console.error('Admin project creation failed:', error);
    return NextResponse.json({ error: 'Unable to create project. Please try again.' }, { status: 500 });
  }
}
