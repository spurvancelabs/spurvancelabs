import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { requireAuth } from '@/lib/lms/utils'
import { ROLES } from '@/lib/lms/roles'

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const user = await requireAuth()
    const { id } = await params
    const attempt = await prisma.quizAttempt.findUnique({ where: { id } })
    if (!attempt) return NextResponse.json({ error: 'Attempt not found' }, { status: 404 })
    if (attempt.studentId !== user.id && user.role !== ROLES.ADMIN) return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    return NextResponse.json(attempt)
  } catch (error: any) {
    if (error.message === 'Unauthorized') return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    return NextResponse.json({ error: 'Failed to fetch attempt' }, { status: 500 })
  }
}

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const user = await requireAuth()
    const { id } = await params
    const body = await req.json()
    const { answers } = body

    const attempt = await prisma.quizAttempt.findUnique({
      where: { id },
      include: { quiz: { include: { questions: { orderBy: { sortOrder: 'asc' } } } } },
    })
    if (!attempt) return NextResponse.json({ error: 'Attempt not found' }, { status: 404 })
    if (attempt.studentId !== user.id) return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    if (attempt.completedAt) return NextResponse.json({ error: 'Already submitted' }, { status: 400 })

    let score = 0
    let totalPoints = 0
    const graded = (answers as any[]).map((answer: any) => {
      const question = attempt.quiz.questions.find(q => q.id === answer.questionId)
      if (!question) return { ...answer, correct: false, points: 0 }
      totalPoints += question.points
      const isCorrect = JSON.stringify(answer.answer) === JSON.stringify(question.correctAnswer)
      if (isCorrect) score += question.points
      return { ...answer, correct: isCorrect, points: isCorrect ? question.points : 0 }
    })

    const pct = totalPoints > 0 ? Math.round((score / totalPoints) * 100) : 0
    const passed = pct >= attempt.quiz.passingScore

    const updated = await prisma.quizAttempt.update({
      where: { id },
      data: { answers: graded, score: pct, passed, completedAt: new Date() },
    })

    if (passed) {
      const lesson = await prisma.lesson.findUnique({
        where: { id: attempt.quiz.lessonId },
        include: { module: true },
      })
      if (lesson) {
        const allPublished = await prisma.lesson.count({
          where: { module: { courseId: lesson.module.courseId }, isPublished: true },
        })
        const completedLessons = await prisma.progress.count({
          where: { studentId: user.id, completed: true, lesson: { module: { courseId: lesson.module.courseId } } },
        })
        const pctProgress = allPublished > 0 ? Math.round(((completedLessons + 1) / allPublished) * 100) : 0
        await prisma.enrollment.updateMany({
          where: { courseId: lesson.module.courseId, studentId: user.id },
          data: { progress: pctProgress, ...(pctProgress >= 100 ? { status: 'COMPLETED', completedAt: new Date() } : {}) },
        })
      }
    }

    return NextResponse.json(updated)
  } catch (error: any) {
    if (error.message === 'Unauthorized') return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    return NextResponse.json({ error: 'Failed to submit quiz' }, { status: 500 })
  }
}
