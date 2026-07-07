import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { requireInstructor } from '@/lib/lms/utils'

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const lessonId = searchParams.get('lessonId')
    if (!lessonId) return NextResponse.json({ error: 'lessonId is required' }, { status: 400 })

    const quiz = await prisma.quiz.findFirst({
      where: { lessonId },
      include: { questions: { orderBy: { sortOrder: 'asc' } }, _count: { select: { attempts: true } } },
    })
    if (!quiz) return NextResponse.json({ error: 'Quiz not found' }, { status: 404 })
    return NextResponse.json(quiz)
  } catch {
    return NextResponse.json({ error: 'Failed to fetch quiz' }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  try {
    await requireInstructor()
    const body = await req.json()
    const { lessonId, title, passingScore, timeLimit, maxAttempts, shuffleQuestions, showResults } = body
    if (!lessonId || !title) return NextResponse.json({ error: 'lessonId and title are required' }, { status: 400 })

    const quiz = await prisma.quiz.create({
      data: { lessonId, title, passingScore: passingScore ?? 70, timeLimit, maxAttempts: maxAttempts ?? 1, shuffleQuestions: shuffleQuestions ?? false, showResults: showResults ?? true },
    })
    return NextResponse.json(quiz, { status: 201 })
  } catch (error: any) {
    if (error.message === 'Unauthorized' || error.message === 'Forbidden') return NextResponse.json({ error: error.message }, { status: 401 })
    return NextResponse.json({ error: 'Failed to create quiz' }, { status: 500 })
  }
}
