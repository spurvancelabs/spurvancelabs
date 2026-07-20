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

export async function GET() {
  try {
    const userId = await getAuthUserId();
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

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
    const userId = await getAuthUserId();
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json();
    const { name, description, key, color } = body;

    if (!name || !key) {
      return NextResponse.json({ error: 'Name and key are required' }, { status: 400 });
    }

    const existing = await prisma.project.findUnique({ where: { key } });
    if (existing) {
      return NextResponse.json({ error: 'Project key already exists' }, { status: 409 });
    }

    const project = await prisma.project.create({
      data: {
        name,
        description,
        key,
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
