import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { requireAuth } from '@/lib/lms/utils'

export async function GET() {
  try {
    const user = await requireAuth()

    const publicUser = await prisma.user.findUnique({
      where: { id: user.id },
      select: { id: true, email: true, name: true, type: true, createdAt: true },
    })

    const [enrollments, certificates, reviews, wishlistCount] = await Promise.all([
      prisma.enrollment.count({ where: { studentId: user.id } }),
      prisma.certificate.count({ where: { studentId: user.id } }),
      prisma.review.count({ where: { studentId: user.id } }),
      prisma.wishlist.count({ where: { studentId: user.id } }),
    ])

    const completedEnrollments = await prisma.enrollment.count({
      where: { studentId: user.id, status: 'COMPLETED' },
    })

    return NextResponse.json({
      ...publicUser,
      stats: {
        enrollments,
        completedEnrollments,
        certificates,
        reviews,
        wishlistCount,
      },
    })
  } catch (error: any) {
    if (error.message === 'Unauthorized') return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    return NextResponse.json({ error: 'Failed to fetch profile' }, { status: 500 })
  }
}
