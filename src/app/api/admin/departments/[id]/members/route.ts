import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { requireSuperAdmin } from '@/lib/lms/utils';

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await requireSuperAdmin();

    const { id } = await params;
    const { userId } = await req.json();

    if (!userId) {
      return NextResponse.json({ error: 'userId is required' }, { status: 400 });
    }

    const department = await prisma.department.findUnique({ where: { id } });
    if (!department) {
      return NextResponse.json({ error: 'Department not found' }, { status: 404 });
    }

    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    const existing = await prisma.departmentMember.findUnique({
      where: { departmentId_userId: { departmentId: id, userId } },
    });
    if (existing) {
      return NextResponse.json({ error: 'User is already a member of this department' }, { status: 409 });
    }

    await prisma.departmentMember.create({
      data: { departmentId: id, userId },
    });

    return NextResponse.json({ success: true }, { status: 201 });
  } catch (error: any) {
    if (error.message === 'Unauthorized' || error.message === 'Forbidden') {
      return NextResponse.json({ error: error.message }, { status: 401 });
    }
    return NextResponse.json({ error: error?.message || 'Something went wrong' }, { status: 500 });
  }
}
