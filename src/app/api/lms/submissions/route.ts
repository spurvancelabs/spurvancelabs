import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { requireAuth, requireInstructor } from '@/lib/lms/utils'

export async function POST(req: NextRequest) {
  try {
    const user = await requireAuth()
    const { lessonId, content } = await req.json()

    if (!lessonId || !content?.trim()) {
      return NextResponse.json({ error: 'lessonId and content are required' }, { status: 400 })
    }

    const lesson = await prisma.lesson.findUnique({
      where: { id: lessonId },
      select: { id: true, type: true, module: { select: { courseId: true } } },
    })

    if (!lesson || lesson.type !== 'ASSIGNMENT') {
      return NextResponse.json({ error: 'Invalid lesson' }, { status: 400 })
    }

    const enrolled = await prisma.enrollment.findUnique({
      where: { courseId_studentId: { courseId: lesson.module.courseId, studentId: user.id } },
    })

    if (!enrolled) {
      return NextResponse.json({ error: 'Not enrolled' }, { status: 403 })
    }

    const submission = await prisma.submission.upsert({
      where: { lessonId_studentId: { lessonId, studentId: user.id } },
      update: { content, status: 'SUBMITTED', submittedAt: new Date() },
      create: { lessonId, studentId: user.id, content },
    })

    return NextResponse.json(submission, { status: 201 })
  } catch (error: any) {
    if (error.message === 'Unauthorized' || error.message === 'Forbidden') {
      return NextResponse.json({ error: error.message }, { status: 401 })
    }
    return NextResponse.json({ error: 'Failed to submit assignment' }, { status: 500 })
  }
}

export async function GET(req: NextRequest) {
  try {
    const user = await requireInstructor()
    const { searchParams } = new URL(req.url)
    const lessonId = searchParams.get('lessonId')
    const courseId = searchParams.get('courseId')

    const where: any = {}
    if (lessonId) where.lessonId = lessonId

    if (courseId) {
      const courseLessonIds = await prisma.lesson.findMany({
        where: { module: { courseId }, type: 'ASSIGNMENT' },
        select: { id: true },
      })
      where.lessonId = { in: courseLessonIds.map(l => l.id) }
    }

    const submissions = await prisma.submission.findMany({
      where,
      include: {
        lesson: { select: { id: true, title: true, module: { select: { id: true, title: true, courseId: true } } } },
      },
      orderBy: { submittedAt: 'desc' },
    })

    const studentIds = [...new Set(submissions.map(s => s.studentId))]
    const students = studentIds.length > 0
      ? await prisma.user.findMany({
          where: { id: { in: studentIds } },
          select: { id: true, name: true, email: true },
        })
      : []
    const studentMap = new Map(students.map(s => [s.id, s]))

    const data = submissions.map(s => ({
      ...s,
      student: studentMap.get(s.studentId) ?? null,
    }))

    return NextResponse.json(data)
  } catch (error: any) {
    if (error.message === 'Unauthorized' || error.message === 'Forbidden') {
      return NextResponse.json({ error: error.message }, { status: 401 })
    }
    return NextResponse.json({ error: 'Failed to fetch submissions' }, { status: 500 })
  }
}
