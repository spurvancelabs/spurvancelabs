import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { requireInstructor } from '@/lib/lms/utils'

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const quizId = searchParams.get('quizId')
    if (!quizId) return NextResponse.json({ error: 'quizId is required' }, { status: 400 })

    const questions = await prisma.question.findMany({
      where: { quizId },
      orderBy: { sortOrder: 'asc' },
    })
    return NextResponse.json(questions)
  } catch {
    return NextResponse.json({ error: 'Failed to fetch questions' }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  try {
    await requireInstructor()
    const body = await req.json()
    const { quizId, type, question, options, correctAnswer, points } = body
    if (!quizId || !type || !question) return NextResponse.json({ error: 'quizId, type, and question are required' }, { status: 400 })

    const maxOrder = await prisma.question.findFirst({ where: { quizId }, orderBy: { sortOrder: 'desc' }, select: { sortOrder: true } })
    const sortOrder = (maxOrder?.sortOrder ?? -1) + 1

    const q = await prisma.question.create({
      data: { quizId, type, question, options: options ?? [], correctAnswer: correctAnswer ?? '', points: points ?? 1, sortOrder },
    })
    return NextResponse.json(q, { status: 201 })
  } catch (error: any) {
    if (error.message === 'Unauthorized' || error.message === 'Forbidden') return NextResponse.json({ error: error.message }, { status: 401 })
    return NextResponse.json({ error: 'Failed to create question' }, { status: 500 })
  }
}
