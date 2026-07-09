import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { requireInstructor } from '@/lib/lms/utils'

export async function GET() {
  try {
    const user = await requireInstructor()

    const publicUser = await prisma.user.findUnique({
      where: { id: user.id },
      select: { id: true, email: true, name: true, image: true, type: true, createdAt: true },
    })

    const [courses, totalEnrollments, completedEnrollments, reviews] = await Promise.all([
      prisma.course.findMany({
        where: { instructorId: user.id },
        select: {
          id: true,
          title: true,
          slug: true,
          status: true,
          thumbnail: true,
          level: true,
          category: true,
          _count: { select: { enrollments: true, modules: true } },
        },
        orderBy: { createdAt: 'desc' },
      }),
      prisma.enrollment.count({
        where: { course: { instructorId: user.id } },
      }),
      prisma.enrollment.count({
        where: { course: { instructorId: user.id }, status: 'COMPLETED' },
      }),
      prisma.review.aggregate({
        where: { course: { instructorId: user.id } },
        _avg: { rating: true },
        _count: { rating: true },
      }),
    ])

    return NextResponse.json({
      ...publicUser,
      role: user.role,
      stats: {
        totalCourses: courses.length,
        totalEnrollments,
        completedEnrollments,
        avgRating: reviews._avg.rating ?? 0,
        totalReviews: reviews._count.rating,
        totalStudents: await prisma.enrollment.groupBy({
          by: ['studentId'],
          where: { course: { instructorId: user.id } },
          _count: { studentId: true },
        }).then(g => g.length),
      },
      courses,
    })
  } catch (error: any) {
    if (error.message === 'Unauthorized') return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    return NextResponse.json({ error: 'Failed to fetch instructor profile' }, { status: 500 })
  }
}
