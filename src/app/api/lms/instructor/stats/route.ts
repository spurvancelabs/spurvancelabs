import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { requireInstructor } from '@/lib/lms/utils'

export async function GET() {
  try {
    const user = await requireInstructor()
    const instructorId = user.id

    const courses = await prisma.course.findMany({
      where: { instructorId },
      select: {
        id: true,
        title: true,
        slug: true,
        status: true,
        price: true,
        createdAt: true,
        _count: { select: { enrollments: true, modules: true, reviews: true } },
        reviews: { select: { rating: true } },
      },
      orderBy: { createdAt: 'desc' },
    })

    const courseIds = courses.map(c => c.id)

    const totalEnrollments = await prisma.enrollment.count({
      where: { courseId: { in: courseIds } },
    })

    const completedEnrollments = await prisma.enrollment.count({
      where: { courseId: { in: courseIds }, status: 'COMPLETED' },
    })

    const activeEnrollments = await prisma.enrollment.count({
      where: { courseId: { in: courseIds }, status: 'ACTIVE' },
    })

    const totalRevenue = courses.reduce((sum, c) => sum + Number(c.price ?? 0) * c._count.enrollments, 0)

    const avgRatings = courses.map(c => {
      const ratings = c.reviews.map(r => r.rating)
      const avg = ratings.length ? (ratings.reduce((a, b) => a + b, 0) / ratings.length) : 0
      return { courseId: c.id, avgRating: Math.round(avg * 10) / 10, count: ratings.length }
    })

    return NextResponse.json({
      totalCourses: courses.length,
      publishedCourses: courses.filter(c => c.status === 'PUBLISHED').length,
      totalEnrollments,
      activeEnrollments,
      completedEnrollments,
      totalRevenue,
      avgRatings,
      courses: courses.map(c => ({
        ...c,
        reviews: undefined,
      })),
    })
  } catch (error: any) {
    if (error.message === 'Unauthorized') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
    return NextResponse.json({ error: 'Failed to fetch stats' }, { status: 500 })
  }
}
