import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { requireAuth } from '@/lib/lms/utils'

export async function GET() {
  try {
    const user = await requireAuth()
    const items = await prisma.wishlist.findMany({
      where: { studentId: user.id },
      include: {
        course: {
          include: {
            category: { select: { name: true, slug: true } },
            instructor: { select: { id: true, email: true } },
            _count: { select: { modules: true, enrollments: true } },
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    })
    return NextResponse.json(items)
  } catch (error: any) {
    if (error.message === 'Unauthorized') return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    return NextResponse.json({ error: 'Failed to fetch wishlist' }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  try {
    const user = await requireAuth()
    const { courseId } = await req.json()

    if (!courseId) return NextResponse.json({ error: 'courseId is required' }, { status: 400 })

    const existing = await prisma.wishlist.findUnique({
      where: { studentId_courseId: { studentId: user.id, courseId } },
    })
    if (existing) {
      await prisma.wishlist.delete({ where: { id: existing.id } })
      return NextResponse.json({ wishlisted: false, message: 'Removed from wishlist' })
    }

    const item = await prisma.wishlist.create({
      data: { studentId: user.id, courseId },
    })
    return NextResponse.json({ wishlisted: true, item }, { status: 201 })
  } catch (error: any) {
    if (error.message === 'Unauthorized') return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    return NextResponse.json({ error: 'Failed to update wishlist' }, { status: 500 })
  }
}
