import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { requireAuth, requireAdmin } from '@/lib/lms/utils'
import { ROLES } from '@/lib/lms/roles'

export async function GET(req: NextRequest) {
  try {
    const user = await requireAuth()
    const where: any = user.role === ROLES.ADMIN ? {} : { studentId: user.id }
    const certificates = await prisma.certificate.findMany({
      where,
      orderBy: { issuedAt: 'desc' },
      include: {
        course: { select: { id: true, title: true, slug: true } },
      },
    })
    return NextResponse.json(certificates)
  } catch (error: any) {
    if (error.message === 'Unauthorized') return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    return NextResponse.json({ error: 'Failed to fetch certificates' }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  try {
    const user = await requireAuth()
    const body = await req.json()
    const { courseId } = body
    if (!courseId) return NextResponse.json({ error: 'courseId is required' }, { status: 400 })

    const enrollment = await prisma.enrollment.findUnique({
      where: { courseId_studentId: { courseId, studentId: user.id } },
    })
    if (!enrollment || enrollment.status !== 'COMPLETED') {
      return NextResponse.json({ error: 'Course not completed' }, { status: 400 })
    }

    const existing = await prisma.certificate.findUnique({
      where: { courseId_studentId: { courseId, studentId: user.id } },
    })
    if (existing) return NextResponse.json(existing)

    const certificate = await prisma.certificate.create({
      data: { courseId, studentId: user.id },
      include: { course: { select: { id: true, title: true, slug: true } } },
    })
    return NextResponse.json(certificate, { status: 201 })
  } catch (error: any) {
    if (error.message === 'Unauthorized') return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    return NextResponse.json({ error: 'Failed to issue certificate' }, { status: 500 })
  }
}
