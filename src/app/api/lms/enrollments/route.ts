import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { requireAuth, requireAdmin } from '@/lib/lms/utils'
import { AdminNotificationService } from '@/lib/admin-notifications/service'

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const courseId = searchParams.get('courseId')
    const studentId = searchParams.get('studentId')
    const status = searchParams.get('status')
    const search = searchParams.get('search')

    const where: any = {}
    if (courseId) where.courseId = courseId
    if (studentId) where.studentId = studentId
    if (status) where.status = status

    if (search) {
      const matched = await prisma.user.findMany({
        where: {
          OR: [
            { name: { contains: search, mode: 'insensitive' } },
            { email: { contains: search, mode: 'insensitive' } },
          ],
        },
        select: { id: true },
        take: 100,
      })
      if (matched.length === 0) return NextResponse.json([])
      where.studentId = { in: matched.map(u => u.id) }
    }

    const enrollments = await prisma.enrollment.findMany({
      where,
      orderBy: { enrolledAt: 'desc' },
      include: {
        course: { select: { id: true, title: true, slug: true, thumbnail: true } },
      },
    })

    const studentIds = [...new Set(enrollments.map(e => e.studentId))]
    const students = studentIds.length > 0
      ? await prisma.user.findMany({
          where: { id: { in: studentIds } },
          select: { id: true, name: true, email: true },
        })
      : []
    const studentMap = new Map(students.map(s => [s.id, s]))

    const data = enrollments.map(e => ({
      ...e,
      student: studentMap.get(e.studentId) ?? null,
    }))

    return NextResponse.json(data)
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

    try {
      await AdminNotificationService.notifyAdmins({
        type: 'enrollment',
        title: 'New course enrollment',
        message: `${user.name || user.email} enrolled in "${enrollment.course.title}"`,
        priority: 'medium',
        link: `/lms/instructor/courses/${courseId}`,
      });
    } catch (notificationError) {
      console.error('Failed to notify admins about enrollment:', notificationError);
    }

    return NextResponse.json(enrollment, { status: 201 })
  } catch (error: any) {
    if (error.message === 'Unauthorized' || error.message === 'Forbidden') return NextResponse.json({ error: error.message }, { status: 401 })
    return NextResponse.json({ error: 'Failed to enroll' }, { status: 500 })
  }
}
