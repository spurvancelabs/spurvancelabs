import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { requireSuperAdmin } from '@/lib/lms/utils';

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string; userId: string }> }
) {
  try {
    await requireSuperAdmin();

    const { id, userId } = await params;

    const existing = await prisma.departmentMember.findUnique({
      where: { departmentId_userId: { departmentId: id, userId } },
    });
    if (!existing) {
      return NextResponse.json({ error: 'Membership not found' }, { status: 404 });
    }

    await prisma.departmentMember.delete({
      where: { departmentId_userId: { departmentId: id, userId } },
    });

    return NextResponse.json({ success: true });
  } catch (error: any) {
    if (error.message === 'Unauthorized' || error.message === 'Forbidden') {
      return NextResponse.json({ error: error.message }, { status: 401 });
    }
    return NextResponse.json({ error: error?.message || 'Something went wrong' }, { status: 500 });
  }
}
