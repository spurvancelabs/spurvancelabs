import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { requireInstructor } from '@/lib/lms/utils'

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const user = await requireInstructor()
    const { id } = await params
    const { grade, feedback } = await req.json()

    if (grade !== undefined && (grade < 0 || grade > 100)) {
      return NextResponse.json({ error: 'Grade must be between 0 and 100' }, { status: 400 })
    }

    const submission = await prisma.submission.findUnique({
      where: { id },
      include: { lesson: { select: { module: { select: { courseId: true } } } } },
    })

    if (!submission) {
      return NextResponse.json({ error: 'Submission not found' }, { status: 404 })
    }

    const course = await prisma.course.findUnique({
      where: { id: submission.lesson.module.courseId },
      select: { instructorId: true },
    })

    if (course?.instructorId !== user.id) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    const updated = await prisma.submission.update({
      where: { id },
      data: {
        grade: grade ?? null,
        feedback: feedback ?? null,
        status: grade !== undefined ? 'GRADED' : 'SUBMITTED',
        gradedBy: user.id,
        gradedAt: grade !== undefined ? new Date() : null,
      },
    })

    return NextResponse.json(updated)
  } catch (error: any) {
    if (error.message === 'Unauthorized' || error.message === 'Forbidden') {
      return NextResponse.json({ error: error.message }, { status: 401 })
    }
    return NextResponse.json({ error: 'Failed to update submission' }, { status: 500 })
  }
}
