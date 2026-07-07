import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { requireAuth } from '@/lib/lms/utils'

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const user = await requireAuth()
    const { id } = await params

    const item = await prisma.wishlist.findUnique({ where: { id } })
    if (!item) return NextResponse.json({ error: 'Not found' }, { status: 404 })
    if (item.studentId !== user.id) return NextResponse.json({ error: 'Forbidden' }, { status: 403 })

    await prisma.wishlist.delete({ where: { id } })
    return NextResponse.json({ message: 'Removed from wishlist' })
  } catch (error: any) {
    if (error.message === 'Unauthorized') return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    return NextResponse.json({ error: 'Failed to remove' }, { status: 500 })
  }
}
