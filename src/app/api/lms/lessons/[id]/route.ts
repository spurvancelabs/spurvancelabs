import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { requireInstructor } from '@/lib/lms/utils'

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    const lesson = await prisma.lesson.findUnique({
      where: { id },
      include: { quizzes: { include: { questions: { orderBy: { sortOrder: 'asc' } }, _count: { select: { attempts: true } } } } },
    })
    if (!lesson) return NextResponse.json({ error: 'Lesson not found' }, { status: 404 })
    return NextResponse.json(lesson)
  } catch {
    return NextResponse.json({ error: 'Failed to fetch lesson' }, { status: 500 })
  }
}

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    await requireInstructor()
    const { id } = await params
    const body = await req.json()
    const lesson = await prisma.lesson.update({ where: { id }, data: body })
    return NextResponse.json(lesson)
  } catch (error: any) {
    if (error.message === 'Unauthorized' || error.message === 'Forbidden') return NextResponse.json({ error: error.message }, { status: 401 })
    return NextResponse.json({ error: 'Failed to update lesson' }, { status: 500 })
  }
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    await requireInstructor()
    const { id } = await params
    await prisma.lesson.delete({ where: { id } })
    return NextResponse.json({ success: true })
  } catch (error: any) {
    if (error.message === 'Unauthorized' || error.message === 'Forbidden') return NextResponse.json({ error: error.message }, { status: 401 })
    return NextResponse.json({ error: 'Failed to delete lesson' }, { status: 500 })
  }
}
