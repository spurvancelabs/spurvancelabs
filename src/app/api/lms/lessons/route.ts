import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { requireInstructor } from '@/lib/lms/utils'

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
    await requireInstructor()
    const body = await req.json()
    const { moduleId, title, type } = body
    if (!moduleId || !title) return NextResponse.json({ error: 'moduleId and title are required' }, { status: 400 })

    const result = await prisma.$transaction(async (tx) => {
      const module = await tx.module.findUnique({ where: { id: moduleId }, select: { id: true } })
      if (!module) return null

      const maxOrder = await tx.lesson.findFirst({
        where: { moduleId },
        orderBy: { sortOrder: 'desc' },
        select: { sortOrder: true },
      })
      const sortOrder = (maxOrder?.sortOrder ?? -1) + 1

      const lesson = await tx.lesson.create({
        data: { moduleId, title: title.trim(), type: type || 'TEXT', sortOrder },
        include: { quizzes: true },
      })
      const moduleLessonCount = await tx.lesson.count({ where: { moduleId } })

      return { lesson, moduleLessonCount }
    })

    if (!result) return NextResponse.json({ error: 'Module not found' }, { status: 404 })
    return NextResponse.json({ ...result.lesson, moduleLessonCount: result.moduleLessonCount }, { status: 201 })
  } catch (error: any) {
    if (error.message === 'Unauthorized' || error.message === 'Forbidden') return NextResponse.json({ error: error.message }, { status: 401 })
    return NextResponse.json({ error: 'Failed to create lesson' }, { status: 500 })
  }
}
