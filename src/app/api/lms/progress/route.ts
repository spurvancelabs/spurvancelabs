import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { requireAuth } from '@/lib/lms/utils'

export async function GET(req: NextRequest) {
  try {
    const user = await requireAuth()
    const { searchParams } = new URL(req.url)
    const courseId = searchParams.get('courseId')

    const where: any = { studentId: user.id }
    if (courseId) {
      const lessons = await prisma.lesson.findMany({
        where: { module: { courseId } },
        select: { id: true },
      })
      where.lessonId = { in: lessons.map(l => l.id) }
    }

    const progress = await prisma.progress.findMany({ where })
    return NextResponse.json(progress)
  } catch (error: any) {
    if (error.message === 'Unauthorized') return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    return NextResponse.json({ error: 'Failed to fetch progress' }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  try {
    const user = await requireAuth()
    const body = await req.json()
    const { lessonId } = body
    if (!lessonId) return NextResponse.json({ error: 'lessonId is required' }, { status: 400 })

    const progress = await prisma.progress.upsert({
      where: { studentId_lessonId: { studentId: user.id, lessonId } },
      update: { completed: true, completedAt: new Date() },
      create: { studentId: user.id, lessonId, completed: true, completedAt: new Date() },
    })

    const lesson = await prisma.lesson.findUnique({
      where: { id: lessonId },
      include: { module: { include: { course: true } } },
    })
    if (lesson) {
      const allLessons = await prisma.lesson.count({
        where: { module: { courseId: lesson.module.courseId }, isPublished: true },
      })
      const completedLessons = await prisma.progress.count({
        where: { studentId: user.id, completed: true, lesson: { module: { courseId: lesson.module.courseId } } },
      })
      const pct = allLessons > 0 ? Math.round((completedLessons / allLessons) * 100) : 0
      await prisma.enrollment.updateMany({
        where: { courseId: lesson.module.courseId, studentId: user.id },
        data: { progress: pct, ...(pct >= 100 ? { status: 'COMPLETED', completedAt: new Date() } : {}) },
      })
    }

    return NextResponse.json(progress, { status: 201 })
  } catch (error: any) {
    if (error.message === 'Unauthorized') return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    return NextResponse.json({ error: 'Failed to update progress' }, { status: 500 })
  }
}
