import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { requireAdmin } from '@/lib/lms/utils'

export async function GET() {
  try {
    await requireAdmin()

    const [totalCourses, publishedCourses, totalEnrollments, activeEnrollments, completedEnrollments, recentEnrollments] = await Promise.all([
      prisma.course.count(),
      prisma.course.count({ where: { status: 'PUBLISHED' } }),
      prisma.enrollment.count(),
      prisma.enrollment.count({ where: { status: 'ACTIVE' } }),
      prisma.enrollment.count({ where: { status: 'COMPLETED' } }),
      prisma.enrollment.findMany({
        take: 10,
        orderBy: { enrolledAt: 'desc' },
        include: {
          course: { select: { id: true, title: true, slug: true } },
          student: { select: { id: true, email: true } },
        },
      }),
    ])

    const enrollmentsByCourse = await prisma.enrollment.groupBy({
      by: ['courseId'],
      _count: true,
      orderBy: { _count: { courseId: 'desc' } },
      take: 10,
    })

    const courseIds = enrollmentsByCourse.map((e: { courseId: string }) => e.courseId)
    const courses = await prisma.course.findMany({
      where: { id: { in: courseIds } },
      select: { id: true, title: true },
    })
    const courseMap = new Map(courses.map((c: { id: string, title: string }) => [c.id, c.title]))

    const avgProgress = await prisma.enrollment.aggregate({
      _avg: { progress: true },
    })

    return NextResponse.json({
      totalCourses,
      publishedCourses,
      totalEnrollments,
      activeEnrollments,
      completedEnrollments,
      avgProgress: Math.round(avgProgress._avg.progress ?? 0),
      recentEnrollments,
      enrollmentsByCourse: enrollmentsByCourse.map((e: { courseId: string, _count: number }) => ({
        courseId: e.courseId,
        courseTitle: courseMap.get(e.courseId) || 'Unknown',
        count: e._count,
      })),
    })
  } catch (error: any) {
    if (error.message === 'Unauthorized' || error.message === 'Forbidden') {
      return NextResponse.json({ error: error.message }, { status: 401 })
    }
    return NextResponse.json({ error: 'Failed to fetch stats' }, { status: 500 })
  }
}
