import { NextRequest, NextResponse } from 'next/server';
import { isProjectReadOnlyRole } from '@/lib/lms/permissions';
import { getProjectAccess } from '@/lib/projects/access';
import prisma from '@/lib/prisma';
import { canProject, isValidProjectRole } from '@/lib/projects/permissions';
import type { ProjectRole } from '@prisma/client';

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

    const members = await prisma.projectMember.findMany({
      where: { projectId },
      include: {
        user: { select: { id: true, name: true, email: true, image: true } },
      },
      orderBy: { createdAt: 'asc' },
    });

    return NextResponse.json({ data: members });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch members' }, { status: 500 });
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
    if (isProjectReadOnlyRole(access.role)) {
      return NextResponse.json({ error: 'Access denied' }, { status: 403 });
    }
    const userId = access.userId;

    const { projectId } = await params;

    const requesterMember = await prisma.projectMember.findUnique({
      where: { projectId_userId: { projectId, userId } },
      select: { role: true },
    });
    const isOwner = await prisma.project.findFirst({
      where: { id: projectId, ownerId: userId },
      select: { id: true },
    });

    const role = isOwner ? 'PROJECT_OWNER' : requesterMember?.role;
    if (!canProject(role, 'manage_members')) {
      return NextResponse.json({ error: 'Only project owner can add members' }, { status: 403 });
    }

    const body = await req.json();
    const { email, role: newRole } = body;

    if (!email) {
      return NextResponse.json({ error: 'Email is required' }, { status: 400 });
    }

    const finalRole = (newRole && isValidProjectRole(newRole) ? newRole : 'DEVELOPER') as ProjectRole;

    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    const existing = await prisma.projectMember.findUnique({
      where: { projectId_userId: { projectId, userId: user.id } },
    });
    if (existing) {
      return NextResponse.json({ error: 'User is already a member' }, { status: 409 });
    }

    const member = await prisma.projectMember.create({
      data: {
        projectId,
        userId: user.id,
        role: finalRole,
      },
      include: {
        user: { select: { id: true, name: true, email: true, image: true } },
      },
    });

    return NextResponse.json({ data: member }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to add member' }, { status: 500 });
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ projectId: string }> }
) {
  try {
const access = await getProjectAccess();
    if (access.ok === false) {
      return NextResponse.json({ error: 'Access denied' }, { status: access.status });
    }
    if (isProjectReadOnlyRole(access.role)) {
      return NextResponse.json({ error: 'Access denied' }, { status: 403 });
    }
    const userId = access.userId;

    const { projectId } = await params;
    const body = await req.json();
    const { userId: targetUserId } = body;

    if (!targetUserId) {
      return NextResponse.json({ error: 'userId is required' }, { status: 400 });
    }

    if (targetUserId === userId) {
      return NextResponse.json({ error: 'Cannot remove yourself' }, { status: 400 });
    }

    const requesterMember = await prisma.projectMember.findUnique({
      where: { projectId_userId: { projectId, userId } },
      select: { role: true },
    });
    const isOwner = await prisma.project.findFirst({
      where: { id: projectId, ownerId: userId },
      select: { id: true },
    });

    const role = isOwner ? 'PROJECT_OWNER' : requesterMember?.role;
    if (!canProject(role, 'manage_members')) {
      return NextResponse.json({ error: 'Only project owner can remove members' }, { status: 403 });
    }

    const existing = await prisma.projectMember.findUnique({
      where: { projectId_userId: { projectId, userId: targetUserId } },
    });
    if (!existing) {
      return NextResponse.json({ error: 'Member not found' }, { status: 404 });
    }

    await prisma.projectMember.delete({
      where: { projectId_userId: { projectId, userId: targetUserId } },
    });

    return NextResponse.json({ message: 'Member removed' });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to remove member' }, { status: 500 });
  }
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ projectId: string }> }
) {
  try {
const access = await getProjectAccess();
    if (access.ok === false) {
      return NextResponse.json({ error: 'Access denied' }, { status: access.status });
    }
    if (isProjectReadOnlyRole(access.role)) {
      return NextResponse.json({ error: 'Access denied' }, { status: 403 });
    }
    const userId = access.userId;

    const { projectId } = await params;
    const body = await req.json();
    const { userId: targetUserId, role: newRole } = body;

    if (!targetUserId) {
      return NextResponse.json({ error: 'userId is required' }, { status: 400 });
    }

    if (!isValidProjectRole(newRole)) {
      return NextResponse.json({ error: 'Invalid project role' }, { status: 400 });
    }

    const requesterMember = await prisma.projectMember.findUnique({
      where: { projectId_userId: { projectId, userId } },
      select: { role: true },
    });
    const isOwner = await prisma.project.findFirst({
      where: { id: projectId, ownerId: userId },
      select: { id: true },
    });

    const role = isOwner ? 'PROJECT_OWNER' : requesterMember?.role;
    if (!canProject(role, 'manage_members')) {
      return NextResponse.json({ error: 'Only project owner can change roles' }, { status: 403 });
    }

    const project = await prisma.project.findUnique({
      where: { id: projectId },
      select: { ownerId: true },
    });

    if (project && project.ownerId === targetUserId && newRole !== 'PROJECT_OWNER') {
      return NextResponse.json({ error: 'Cannot change the project owner\u2019s role' }, { status: 400 });
    }

    const existing = await prisma.projectMember.findUnique({
      where: { projectId_userId: { projectId, userId: targetUserId } },
    });
    if (!existing) {
      return NextResponse.json({ error: 'Member not found' }, { status: 404 });
    }

    const member = await prisma.projectMember.update({
      where: { projectId_userId: { projectId, userId: targetUserId } },
      data: { role: newRole as ProjectRole },
      include: {
        user: { select: { id: true, name: true, email: true, image: true } },
      },
    });

    return NextResponse.json({ data: member });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update member role' }, { status: 500 });
  }
}
