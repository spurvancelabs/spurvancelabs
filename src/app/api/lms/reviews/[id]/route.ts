import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { requireAuth } from '@/lib/lms/utils'
import { ROLES } from '@/lib/lms/roles'

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const user = await requireAuth()
    const { id } = await params
    const { rating, comment } = await req.json()

    const review = await prisma.review.findUnique({ where: { id } })
    if (!review) return NextResponse.json({ error: 'Review not found' }, { status: 404 })
    if (review.studentId !== user.id && user.role !== ROLES.ADMIN) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }
    if (rating && (rating < 1 || rating > 5)) {
      return NextResponse.json({ error: 'Rating must be between 1 and 5' }, { status: 400 })
    }

    const updated = await prisma.review.update({
      where: { id },
      data: { ...(rating && { rating }), ...(comment !== undefined && { comment }) },
    })

    return NextResponse.json(updated)
  } catch (error: any) {
    if (error.message === 'Unauthorized') return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    return NextResponse.json({ error: 'Failed to update review' }, { status: 500 })
  }
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const user = await requireAuth()
    const { id } = await params

    const review = await prisma.review.findUnique({ where: { id } })
    if (!review) return NextResponse.json({ error: 'Review not found' }, { status: 404 })
    if (review.studentId !== user.id && user.role !== ROLES.ADMIN) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    await prisma.review.delete({ where: { id } })
    return NextResponse.json({ message: 'Review deleted' })
  } catch (error: any) {
    if (error.message === 'Unauthorized') return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    return NextResponse.json({ error: 'Failed to delete review' }, { status: 500 })
  }
}
