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
        thumbnail: true,
        level: true,
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

    const pendingCourses = courses.filter(c => c.status === 'DRAFT').length

    const completionRate = totalEnrollments > 0
      ? Math.round((completedEnrollments / totalEnrollments) * 100)
      : 0

    const avgRatings = courses.map(c => {
      const ratings = c.reviews.map(r => r.rating)
      const avg = ratings.length ? (ratings.reduce((a, b) => a + b, 0) / ratings.length) : 0
      return { courseId: c.id, avgRating: Math.round(avg * 10) / 10, count: ratings.length }
    })

    const topCourses = [...courses]
      .sort((a, b) => b._count.enrollments - a._count.enrollments)
      .slice(0, 5)
      .map(c => ({
        id: c.id,
        title: c.title,
        slug: c.slug,
        status: c.status,
        thumbnail: c.thumbnail,
        level: c.level,
        enrollmentCount: c._count.enrollments,
        moduleCount: c._count.modules,
        avgRating: avgRatings.find(r => r.courseId === c.id)?.avgRating ?? 0,
        reviewCount: avgRatings.find(r => r.courseId === c.id)?.count ?? 0,
      }))

    const recentEnrollments = await prisma.enrollment.findMany({
      where: { courseId: { in: courseIds } },
      select: {
        id: true,
        studentId: true,
        status: true,
        enrolledAt: true,
        course: { select: { id: true, title: true } },
      },
      orderBy: { enrolledAt: 'desc' },
      take: 5,
    })

    const recentReviews = await prisma.review.findMany({
      where: { courseId: { in: courseIds } },
      select: {
        id: true,
        studentId: true,
        rating: true,
        comment: true,
        createdAt: true,
        course: { select: { id: true, title: true } },
      },
      orderBy: { createdAt: 'desc' },
      take: 5,
    })

    const allStudentIds = [
      ...new Set([
        ...recentEnrollments.map(e => e.studentId),
        ...recentReviews.map(r => r.studentId),
      ]),
    ]

    const students = allStudentIds.length > 0
      ? await prisma.user.findMany({
          where: { id: { in: allStudentIds } },
          select: { id: true, name: true, email: true, image: true },
        })
      : []

    const studentMap = new Map(students.map(s => [s.id, s]))

    const reviewsWithStudent = recentReviews.map(r => ({
      ...r,
      student: studentMap.get(r.studentId) ?? null,
    }))

    const activity: any[] = []

    for (const e of recentEnrollments) {
      const student = studentMap.get(e.studentId)
      activity.push({
        type: 'enrollment',
        message: `${student?.name || 'A student'} enrolled in "${e.course.title}"`,
        date: e.enrolledAt,
        courseId: e.course.id,
      })
    }

    for (const r of recentReviews) {
      const student = studentMap.get(r.studentId)
      activity.push({
        type: 'review',
        message: `${student?.name || 'A student'} reviewed "${r.course.title}" (${r.rating}★)`,
        date: r.createdAt,
        courseId: r.course.id,
      })
    }

    activity.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    const recentActivity = activity.slice(0, 10)

    return NextResponse.json({
      totalCourses: courses.length,
      publishedCourses: courses.filter(c => c.status === 'PUBLISHED').length,
      totalEnrollments,
      activeEnrollments,
      completedEnrollments,
      pendingCourses,
      completionRate,
      totalRevenue: courses.reduce((sum, c) => sum + Number(c.price ?? 0) * c._count.enrollments, 0),
      avgRatings,
      topCourses,
      recentActivity,
      recentReviews: reviewsWithStudent,
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
