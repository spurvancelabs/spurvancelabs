import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { requireInstructor, requireAuth } from '@/lib/lms/utils'
import { ROLES } from '@/lib/lms/roles'

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const user = await requireAuth()
    const { id } = await params
    const quiz = await prisma.quiz.findUnique({
      where: { id },
      include: {
        questions: {
          orderBy: { sortOrder: 'asc' },
          select: user.role === ROLES.ADMIN || user.role === ROLES.INSTRUCTOR
            ? undefined
            : { id: true, type: true, question: true, options: true, points: true, sortOrder: true },
        },
        _count: { select: { attempts: true } },
      },
    })
    if (!quiz) return NextResponse.json({ error: 'Quiz not found' }, { status: 404 })
    return NextResponse.json(quiz)
  } catch (error: any) {
    if (error.message === 'Unauthorized') return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    return NextResponse.json({ error: 'Failed to fetch quiz' }, { status: 500 })
  }
}

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    await requireInstructor()
    const { id } = await params
    const body = await req.json()
    const quiz = await prisma.quiz.update({ where: { id }, data: body })
    return NextResponse.json(quiz)
  } catch (error: any) {
    if (error.message === 'Unauthorized' || error.message === 'Forbidden') return NextResponse.json({ error: error.message }, { status: 401 })
    return NextResponse.json({ error: 'Failed to update quiz' }, { status: 500 })
  }
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    await requireInstructor()
    const { id } = await params
    await prisma.quiz.delete({ where: { id } })
    return NextResponse.json({ success: true })
  } catch (error: any) {
    if (error.message === 'Unauthorized' || error.message === 'Forbidden') return NextResponse.json({ error: error.message }, { status: 401 })
    return NextResponse.json({ error: 'Failed to delete quiz' }, { status: 500 })
  }
}
