import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { requireAuth } from '@/lib/lms/utils'

export async function GET(req: NextRequest) {
  try {
    const user = await requireAuth()
    const { searchParams } = new URL(req.url)
    const quizId = searchParams.get('quizId')
    if (!quizId) return NextResponse.json({ error: 'quizId is required' }, { status: 400 })

    const attempts = await prisma.quizAttempt.findMany({
      where: { quizId, studentId: user.id },
      orderBy: { createdAt: 'desc' },
    })
    return NextResponse.json(attempts)
  } catch (error: any) {
    if (error.message === 'Unauthorized') return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    return NextResponse.json({ error: 'Failed to fetch attempts' }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  try {
    const user = await requireAuth()
    const body = await req.json()
    const { quizId } = body
    if (!quizId) return NextResponse.json({ error: 'quizId is required' }, { status: 400 })

    const quiz = await prisma.quiz.findUnique({ where: { id: quizId } })
    if (!quiz) return NextResponse.json({ error: 'Quiz not found' }, { status: 404 })

    const attemptCount = await prisma.quizAttempt.count({ where: { quizId, studentId: user.id } })
    if (attemptCount >= quiz.maxAttempts) return NextResponse.json({ error: 'Max attempts reached' }, { status: 429 })

    const attempt = await prisma.quizAttempt.create({
      data: { quizId, studentId: user.id },
    })
    return NextResponse.json(attempt, { status: 201 })
  } catch (error: any) {
    if (error.message === 'Unauthorized') return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    return NextResponse.json({ error: 'Failed to start quiz' }, { status: 500 })
  }
}
