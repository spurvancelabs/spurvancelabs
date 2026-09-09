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
    const { moduleId, title, type, quiz } = body
    const lessonType: string = type || 'TEXT'
    if (!moduleId || !title) return NextResponse.json({ error: 'moduleId and title are required' }, { status: 400 })
    if (lessonType === 'QUIZ' && !(quiz?.title && String(quiz.title).trim())) {
      return NextResponse.json({ error: 'Quiz title is required to create a quiz lesson' }, { status: 400 })
    }

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
        data: { moduleId, title: title.trim(), type: lessonType, sortOrder },
        include: { quizzes: true },
      })

      if (lessonType === 'QUIZ') {
        await tx.quiz.create({
          data: {
            lessonId: lesson.id,
            title: String(quiz.title).trim(),
            description: quiz.description ? String(quiz.description).trim() : null,
            passingScore: Number.isFinite(Number(quiz.passingScore)) ? Number(quiz.passingScore) : 70,
            timeLimit: quiz.timeLimit ? Number(quiz.timeLimit) : null,
            maxAttempts: Number.isFinite(Number(quiz.maxAttempts)) ? Number(quiz.maxAttempts) : 1,
            shuffleQuestions: Boolean(quiz.shuffleQuestions ?? false),
            showResults: Boolean(quiz.showResults ?? true),
          },
        })
      }

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
