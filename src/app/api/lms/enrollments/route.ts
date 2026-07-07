import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { requireAuth, requireAdmin } from '@/lib/lms/utils'

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const courseId = searchParams.get('courseId')
    const studentId = searchParams.get('studentId')
    const status = searchParams.get('status')

    const where: any = {}
    if (courseId) where.courseId = courseId
    if (studentId) where.studentId = studentId
    if (status) where.status = status

    const enrollments = await prisma.enrollment.findMany({
      where,
      orderBy: { enrolledAt: 'desc' },
      include: {
        course: { select: { id: true, title: true, slug: true, thumbnail: true } },
        student: { select: { id: true, email: true } },
      },
    })
    return NextResponse.json(enrollments)
  } catch {
    return NextResponse.json({ error: 'Failed to fetch enrollments' }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  try {
    const user = await requireAuth()
    const body = await req.json()
    const { courseId } = body
    if (!courseId) return NextResponse.json({ error: 'courseId is required' }, { status: 400 })

    const existing = await prisma.enrollment.findUnique({
      where: { courseId_studentId: { courseId, studentId: user.id } },
    })
    if (existing) return NextResponse.json({ error: 'Already enrolled' }, { status: 409 })

    const enrollment = await prisma.enrollment.create({
      data: { courseId, studentId: user.id },
      include: { course: { select: { id: true, title: true, slug: true } } },
    })
    return NextResponse.json(enrollment, { status: 201 })
  } catch (error: any) {
    if (error.message === 'Unauthorized' || error.message === 'Forbidden') return NextResponse.json({ error: error.message }, { status: 401 })
    return NextResponse.json({ error: 'Failed to enroll' }, { status: 500 })
  }
}
