import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { requireSuperAdmin } from '@/lib/lms/utils';

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
