import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { requireAuth } from '@/lib/lms/utils'

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const courseId = searchParams.get('courseId')

    const where: any = {}
    if (courseId) where.courseId = courseId

    const reviews = await prisma.review.findMany({
      where,
      orderBy: { createdAt: 'desc' },
    })

    const studentIds = [...new Set(reviews.map(r => r.studentId))]
    const publicUsers = await prisma.user.findMany({
      where: { id: { in: studentIds } },
      select: { id: true, name: true },
    })
    const userMap = Object.fromEntries(publicUsers.map(u => [u.id, u.name]))

    const data = reviews.map(r => ({
      id: r.id,
      courseId: r.courseId,
      rating: r.rating,
      comment: r.comment,
      createdAt: r.createdAt,
      student: {
        id: r.studentId,
        name: userMap[r.studentId] || r.studentId || 'Anonymous',
      },
    }))

    const stats = courseId ? await prisma.review.aggregate({
      where: { courseId },
      _avg: { rating: true },
      _count: { rating: true },
    }) : null

    return NextResponse.json({ reviews: data, stats: stats ? { avgRating: stats._avg.rating || 0, total: stats._count.rating } : null })
  } catch (error: any) {
    console.error('Reviews GET error:', error)
    return NextResponse.json({ error: 'Failed to fetch reviews' }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  try {
    const user = await requireAuth()
    const { courseId, rating, comment } = await req.json()

    if (!courseId || !rating) {
      return NextResponse.json({ error: 'courseId and rating are required' }, { status: 400 })
    }
    if (rating < 1 || rating > 5) {
      return NextResponse.json({ error: 'Rating must be between 1 and 5' }, { status: 400 })
    }

    const existing = await prisma.review.findUnique({
      where: { courseId_studentId: { courseId, studentId: user.id } },
    })
    if (existing) {
      return NextResponse.json({ error: 'You already reviewed this course' }, { status: 409 })
    }

    const enrollment = await prisma.enrollment.findFirst({
      where: { courseId, studentId: user.id },
    })
    if (!enrollment) {
      return NextResponse.json({ error: 'You must be enrolled to review' }, { status: 403 })
    }

    const review = await prisma.review.create({
      data: { courseId, studentId: user.id, rating, comment },
    })

    return NextResponse.json(review, { status: 201 })
  } catch (error: any) {
    if (error.message === 'Unauthorized') return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    console.error('Reviews POST error:', error)
    return NextResponse.json({ error: 'Failed to create review' }, { status: 500 })
  }
}
