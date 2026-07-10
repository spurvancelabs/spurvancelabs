import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { requireAdmin } from '@/lib/lms/utils'

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    const enrollment = await prisma.enrollment.findUnique({ where: { id }, include: { course: true } })
    if (!enrollment) return NextResponse.json({ error: 'Enrollment not found' }, { status: 404 })
    return NextResponse.json(enrollment)
  } catch {
    return NextResponse.json({ error: 'Failed to fetch enrollment' }, { status: 500 })
  }
}

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    await requireAdmin()
    const { id } = await params
    const body = await req.json()
    const enrollment = await prisma.enrollment.update({ where: { id }, data: body })
    return NextResponse.json(enrollment)
  } catch (error: any) {
    if (error.message === 'Unauthorized' || error.message === 'Forbidden') return NextResponse.json({ error: error.message }, { status: 401 })
    return NextResponse.json({ error: 'Failed to update enrollment' }, { status: 500 })
  }
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    await requireAdmin()
    const { id } = await params
    await prisma.enrollment.delete({ where: { id } })
    return NextResponse.json({ success: true })
  } catch (error: any) {
    if (error.message === 'Unauthorized' || error.message === 'Forbidden') return NextResponse.json({ error: error.message }, { status: 401 })
    return NextResponse.json({ error: 'Failed to delete enrollment' }, { status: 500 })
  }
}
