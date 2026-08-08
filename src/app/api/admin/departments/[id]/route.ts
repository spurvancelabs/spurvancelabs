import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { requireSuperAdmin } from '@/lib/lms/utils';

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await requireSuperAdmin();

    const { id } = await params;
    const { name, description, color } = await req.json();

    const department = await prisma.department.findUnique({ where: { id } });
    if (!department) {
      return NextResponse.json({ error: 'Department not found' }, { status: 404 });
    }

    if (name?.trim()) {
      const duplicate = await prisma.department.findUnique({
        where: { projectId_name: { projectId: department.projectId, name: name.trim() } },
      });
      if (duplicate && duplicate.id !== id) {
        return NextResponse.json({ error: 'A department with this name already exists in the project' }, { status: 409 });
      }
    }

    const updated = await prisma.department.update({
      where: { id },
      data: {
        name: name?.trim() || department.name,
        description: description !== undefined ? description : department.description,
        color: color !== undefined ? color : department.color,
      },
    });

    return NextResponse.json({ department: updated });
  } catch (error: any) {
    if (error.message === 'Unauthorized' || error.message === 'Forbidden') {
      return NextResponse.json({ error: error.message }, { status: 401 });
    }
    return NextResponse.json({ error: error?.message || 'Something went wrong' }, { status: 500 });
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await requireSuperAdmin();

    const { id } = await params;
    const department = await prisma.department.findUnique({ where: { id } });
    if (!department) {
      return NextResponse.json({ error: 'Department not found' }, { status: 404 });
    }

    await prisma.department.delete({ where: { id } });

    return NextResponse.json({ success: true });
  } catch (error: any) {
    if (error.message === 'Unauthorized' || error.message === 'Forbidden') {
      return NextResponse.json({ error: error.message }, { status: 401 });
    }
    return NextResponse.json({ error: error?.message || 'Something went wrong' }, { status: 500 });
  }
}
