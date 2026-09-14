import { NextRequest, NextResponse } from 'next/server';
import { getProjectAccess } from '@/lib/projects/access';
import prisma from '@/lib/prisma';
import { getAvailableProjectKey } from '@/lib/projects/key';

export async function GET() {
  try {
    const access = await getProjectAccess();
    if (access.ok === false) {
      return NextResponse.json({ error: 'Access denied' }, { status: access.status });
    }
    const userId = access.userId;

    const projects = await prisma.project.findMany({
      where: {
        OR: [
          { ownerId: userId },
          { members: { some: { userId } } },
        ],
      },
      include: {
        owner: { select: { id: true, name: true, email: true, image: true } },
        _count: { select: { members: true, tickets: true, sprints: true } },
      },
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json({ data: projects });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch projects' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const access = await getProjectAccess();
    if (access.ok === false) {
      return NextResponse.json({ error: 'Access denied' }, { status: access.status });
    }
    const userId = access.userId;

    const body = await req.json();
    const { name, description, key, color } = body;

    if (!name?.trim()) {
      return NextResponse.json({ error: 'Project name is required' }, { status: 400 });
    }
    if (key && !/^[A-Za-z0-9]{1,10}$/.test(key)) {
      return NextResponse.json({ error: 'Project key must be 1–10 letters or numbers' }, { status: 400 });
    }

    const projectKey = await getAvailableProjectKey(name.trim(), key || null);

    const project = await prisma.project.create({
      data: {
        name: name.trim(),
        description: description?.trim() || null,
        key: projectKey,
        color,
        ownerId: userId,
        members: {
          create: {
            userId,
            role: 'PROJECT_OWNER',
          },
        },
      },
      include: {
        owner: { select: { id: true, name: true, email: true, image: true } },
        _count: { select: { members: true, tickets: true, sprints: true } },
      },
    });

    return NextResponse.json({ data: project }, { status: 201 });
  } catch (error: any) {
    if (error?.code === 'P2002') {
      return NextResponse.json({ error: 'Project key already exists' }, { status: 409 });
    }
    return NextResponse.json({ error: 'Failed to create project' }, { status: 500 });
  }
}
