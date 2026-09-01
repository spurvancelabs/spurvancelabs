import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { requireInstructor, getAuthUser } from '@/lib/lms/utils'
import { isAdminRole } from '@/lib/lms/roles'
import { z } from 'zod'

const lessonUpdateSchema = z.object({
  title: z.string().trim().min(1).max(300).optional(),
  type: z.enum(['TEXT', 'VIDEO', 'QUIZ', 'ASSIGNMENT']).optional(),
  description: z.string().trim().max(10000).optional().nullable(),
  content: z.unknown().optional().nullable(),
  videoUrl: z.string().url().max(500).optional().nullable(),
  duration: z.number().int().min(0).max(100000).optional().nullable(),
  sortOrder: z.number().int().min(0).optional(),
  isPublished: z.boolean().optional(),
})

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    const lesson = await prisma.lesson.findUnique({
      where: { id },
      include: { quizzes: { include: { questions: { orderBy: { sortOrder: 'asc' } }, _count: { select: { attempts: true } } } } },
    })
    if (!lesson) return NextResponse.json({ error: 'Lesson not found' }, { status: 404 })

    let data: any = { ...lesson }

    if (lesson.type === 'ASSIGNMENT') {
      const user = await getAuthUser()
      if (user) {
        const submission = await prisma.submission.findUnique({
          where: { lessonId_studentId: { lessonId: id, studentId: user.id } },
        })
        data.submission = submission
      }
    }

    return NextResponse.json(data)
  } catch {
    return NextResponse.json({ error: 'Failed to fetch lesson' }, { status: 500 })
  }
}

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const user = await requireInstructor()
    const { id } = await params
    const body = lessonUpdateSchema.parse(await req.json())
    const existing = await prisma.lesson.findUnique({ where: { id }, select: { type: true, videoUrl: true, isPublished: true, module: { select: { course: { select: { instructorId: true } } } } } })
    if (!existing) return NextResponse.json({ error: 'Lesson not found' }, { status: 404 })
    if (!isAdminRole(user.role) && existing.module.course.instructorId !== user.id) return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    const nextType = body.type ?? existing.type
    const nextVideoUrl = body.videoUrl !== undefined ? body.videoUrl : existing.videoUrl
    const nextPublished = body.isPublished ?? existing.isPublished
    if (nextType === 'VIDEO' && !nextVideoUrl && nextPublished) {
      return NextResponse.json({ error: 'A video URL is required before publishing a VIDEO lesson.' }, { status: 400 })
    }
    const data = {
      ...body,
      videoUrl: nextType === 'VIDEO' ? (nextVideoUrl ?? null) : null,
    }
    const lesson = await prisma.lesson.update({ where: { id }, data })
    return NextResponse.json(lesson)
  } catch (error: any) {
    if (error instanceof z.ZodError) return NextResponse.json({ error: 'Invalid lesson data.' }, { status: 400 })
    if (error.message === 'Unauthorized') return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    if (error.message === 'Forbidden') return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    return NextResponse.json({ error: 'Failed to update lesson' }, { status: 500 })
  }
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const user = await requireInstructor()
    const { id } = await params
    const existing = await prisma.lesson.findUnique({ where: { id }, select: { module: { select: { course: { select: { instructorId: true } } } } } })
    if (!existing) return NextResponse.json({ error: 'Lesson not found' }, { status: 404 })
    if (!isAdminRole(user.role) && existing.module.course.instructorId !== user.id) return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    await prisma.lesson.delete({ where: { id } })
    return NextResponse.json({ success: true })
  } catch (error: any) {
    if (error.message === 'Unauthorized') return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    if (error.message === 'Forbidden') return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    return NextResponse.json({ error: 'Failed to delete lesson' }, { status: 500 })
  }
}
