import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { verifyToken } from '@/lib/auth';
import prisma from '@/lib/prisma';
import { logActivity } from '@/lib/projects/utils';

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB

async function getAuthUserId(): Promise<string | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get('token')?.value;
  if (!token) return null;
  const payload = await verifyToken(token);
  if (!payload?.userId) return null;
  return payload.userId;
}

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ projectId: string; ticketId: string }> }
) {
  try {
    const userId = await getAuthUserId();
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { projectId, ticketId } = await params;

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

    const ticket = await prisma.ticket.findFirst({
      where: { id: ticketId, projectId },
      select: { id: true },
    });

    if (!ticket) {
      return NextResponse.json({ error: 'Ticket not found' }, { status: 404 });
    }

    const attachments = await prisma.ticketAttachment.findMany({
      where: { ticketId },
      include: {
        user: { select: { id: true, name: true, email: true } },
      },
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json({ data: attachments });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch attachments' }, { status: 500 });
  }
}

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ projectId: string; ticketId: string }> }
) {
  try {
    const userId = await getAuthUserId();
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { projectId, ticketId } = await params;

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

    const ticket = await prisma.ticket.findFirst({
      where: { id: ticketId, projectId },
      select: { id: true },
    });

    if (!ticket) {
      return NextResponse.json({ error: 'Ticket not found' }, { status: 404 });
    }

    const contentType = req.headers.get('content-type') || '';

    let fileName: string;
    let fileUrl: string;
    let fileSize: number;
    let mimeType: string | null;

    if (contentType.includes('multipart/form-data')) {
      const formData = await req.formData();
      const file = formData.get('file') as File | null;

      if (!file) {
        return NextResponse.json({ error: 'No file provided' }, { status: 400 });
      }

      if (file.size > MAX_FILE_SIZE) {
        return NextResponse.json({ error: 'File too large (max 5MB)' }, { status: 400 });
      }

      const bytes = await file.arrayBuffer();
      const base64 = Buffer.from(bytes).toString('base64');
      const dataUri = `data:${file.type};base64,${base64}`;

      fileName = file.name;
      fileUrl = dataUri;
      fileSize = file.size;
      mimeType = file.type || null;
    } else {
      const body = await req.json();
      fileName = body.fileName;
      fileUrl = body.fileUrl;
      fileSize = body.fileSize;
      mimeType = body.mimeType || null;

      if (!fileName || !fileUrl || fileSize === undefined) {
        return NextResponse.json({ error: 'fileName, fileUrl, and fileSize are required' }, { status: 400 });
      }
    }

    const attachment = await prisma.ticketAttachment.create({
      data: {
        ticketId,
        userId,
        fileName,
        fileUrl,
        fileSize,
        mimeType,
      },
    });

    await logActivity(ticketId, userId, 'ATTACHED', 'file', '', fileName);

    return NextResponse.json({ data: attachment }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to add attachment' }, { status: 500 });
  }
}
