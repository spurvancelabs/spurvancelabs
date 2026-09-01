import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { requireInstructor } from '@/lib/lms/utils'
import { isAdminRole } from '@/lib/lms/roles'
import { z } from 'zod'

const lessonCreateSchema = z.object({
  moduleId: z.string().uuid(),
  title: z.string().trim().min(1).max(300),
  type: z.enum(['TEXT', 'VIDEO', 'QUIZ', 'ASSIGNMENT']).default('TEXT'),
  description: z.string().trim().max(10000).optional().nullable(),
  content: z.unknown().optional().nullable(),
  videoUrl: z.string().url().max(500).optional().nullable(),
  duration: z.number().int().min(0).max(100000).optional().nullable(),
  isPublished: z.boolean().optional(),
})

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const moduleId = searchParams.get('moduleId')
    if (!moduleId) return NextResponse.json({ error: 'moduleId is required' }, { status: 400 })

    const lessons = await prisma.lesson.findMany({
      where: { moduleId },
      orderBy: { sortOrder: 'asc' },
      include: { _count: { select: { quizzes: true } } },
    })
    return NextResponse.json(lessons)
  } catch {
    return NextResponse.json({ error: 'Failed to fetch lessons' }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  try {
    const user = await requireInstructor()
    const body = lessonCreateSchema.parse(await req.json())
    const parentModule = await prisma.module.findUnique({ where: { id: body.moduleId }, select: { course: { select: { instructorId: true } } } })
    if (!parentModule) return NextResponse.json({ error: 'Module not found' }, { status: 404 })
    if (!isAdminRole(user.role) && parentModule.course.instructorId !== user.id) return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    const { moduleId, title, type, description, content, videoUrl, duration, isPublished } = body
    if (type === 'VIDEO' && !videoUrl && isPublished) {
      return NextResponse.json({ error: 'A video URL is required before publishing a VIDEO lesson.' }, { status: 400 })
    }
    if ((type === 'TEXT' || type === 'ASSIGNMENT') && content == null) {
      return NextResponse.json({ error: 'Lesson content is required for this lesson type.' }, { status: 400 })
    }

    const maxOrder = await prisma.lesson.findFirst({ where: { moduleId }, orderBy: { sortOrder: 'desc' }, select: { sortOrder: true } })
    const sortOrder = (maxOrder?.sortOrder ?? -1) + 1

    const lesson = await prisma.lesson.create({
      data: { moduleId, title, type, description: description ?? null, content: content ?? null, videoUrl: type === 'VIDEO' ? (videoUrl ?? null) : null, duration: duration ?? null, isPublished: isPublished ?? false, sortOrder },
      include: { quizzes: true },
    })
    return NextResponse.json(lesson, { status: 201 })
  } catch (error: any) {
    if (error instanceof z.ZodError) return NextResponse.json({ error: 'Invalid lesson data.' }, { status: 400 })
    if (error.message === 'Unauthorized') return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    if (error.message === 'Forbidden') return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    return NextResponse.json({ error: 'Failed to create lesson' }, { status: 500 })
  }
}
