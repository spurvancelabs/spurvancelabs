import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { requireInstructor, slugify } from '@/lib/lms/utils'
import { ROLES } from '@/lib/lms/roles'

const courseInclude = {
  instructor: { select: { id: true, email: true } },
  category: { select: { id: true, name: true, slug: true } },
  modules: {
    orderBy: { sortOrder: 'asc' as const },
    include: {
      lessons: {
        orderBy: { sortOrder: 'asc' as const },
        include: {
          quizzes: { include: { _count: { select: { questions: true, attempts: true } } } },
        },
      },
    },
  },
  _count: { select: { modules: true, enrollments: true } },
}

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    const course = await prisma.course.findUnique({ where: { id }, include: courseInclude })
    if (!course) return NextResponse.json({ error: 'Course not found' }, { status: 404 })
    return NextResponse.json(course)
  } catch {
    return NextResponse.json({ error: 'Failed to fetch course' }, { status: 500 })
  }
}

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const user = await requireInstructor()
    const { id } = await params

    const existing = await prisma.course.findUnique({ where: { id } })
    if (!existing) return NextResponse.json({ error: 'Course not found' }, { status: 404 })
    if (user.role !== ROLES.ADMIN && existing.instructorId !== user.id) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    const body = await req.json()
    if (body.status === 'PUBLISHED' && user.role !== ROLES.ADMIN) {
      return NextResponse.json({ error: 'Only admins can publish courses' }, { status: 403 })
    }
    const data: any = { ...body }
    if (body.title && !body.slug) data.slug = slugify(body.title)
    if (body.price) data.price = parseFloat(body.price)
    if (body.status === 'PUBLISHED' && existing.status !== 'PUBLISHED') data.publishedAt = new Date()

    const course = await prisma.course.update({ where: { id }, data, include: courseInclude })
    return NextResponse.json(course)
  } catch (error: any) {
    if (error.message === 'Unauthorized' || error.message === 'Forbidden') return NextResponse.json({ error: error.message }, { status: 401 })
    return NextResponse.json({ error: 'Failed to update course' }, { status: 500 })
  }
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const user = await requireInstructor()
    const { id } = await params
    const existing = await prisma.course.findUnique({ where: { id } })
    if (!existing) return NextResponse.json({ error: 'Course not found' }, { status: 404 })
    if (user.role !== ROLES.ADMIN && existing.instructorId !== user.id) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }
    await prisma.course.delete({ where: { id } })
    return NextResponse.json({ success: true })
  } catch (error: any) {
    if (error.message === 'Unauthorized' || error.message === 'Forbidden') return NextResponse.json({ error: error.message }, { status: 401 })
    return NextResponse.json({ error: 'Failed to delete course' }, { status: 500 })
  }
}
