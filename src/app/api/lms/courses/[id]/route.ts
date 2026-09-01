import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { requireInstructor, slugify } from '@/lib/lms/utils'
import { isAdminRole } from '@/lib/lms/roles'
import { z } from 'zod'

const courseUpdateSchema = z.object({
  title: z.string().trim().min(1).max(300).optional(),
  slug: z.string().trim().min(1).max(300).regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/).optional(),
  description: z.string().trim().max(10000).optional().nullable(),
  thumbnail: z.string().url().max(500).optional().nullable(),
  categoryId: z.string().uuid().optional().nullable(),
  level: z.string().trim().max(50).optional().nullable(),
  duration: z.number().int().min(0).max(100000).optional().nullable(),
  price: z.union([z.number().finite().min(0), z.string().trim().regex(/^\d+(?:\.\d{1,2})?$/)]).optional().nullable(),
  isFree: z.boolean().optional(),
  status: z.enum(['DRAFT', 'PUBLISHED', 'ARCHIVED']).optional(),
  isComplete: z.boolean().optional(),
})

const courseInclude = {
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
  _count: { select: { modules: true, lessons: true, enrollments: true } },
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
    if (!isAdminRole(user.role) && existing.instructorId !== user.id) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    const body = courseUpdateSchema.parse(await req.json())
    if (body.status === 'PUBLISHED' && !isAdminRole(user.role)) {
      return NextResponse.json({ error: 'Only admins can publish courses' }, { status: 403 })
    }
    const data: {
      title?: string; slug?: string; description?: string | null; thumbnail?: string | null;
      categoryId?: string | null; level?: string | null; duration?: number | null; price?: number | null;
      isFree?: boolean; status?: 'DRAFT' | 'PUBLISHED' | 'ARCHIVED'; isComplete?: boolean; publishedAt?: Date | null
    } = { ...body, price: body.price == null ? body.price : Number(body.price) }
    if (body.title && !body.slug) data.slug = slugify(body.title)
    if (body.status === 'PUBLISHED' && existing.status !== 'PUBLISHED') data.publishedAt = new Date()
    if (body.status && body.status !== 'PUBLISHED' && existing.status === 'PUBLISHED') data.publishedAt = null

    const course = await prisma.course.update({ where: { id }, data, include: courseInclude })
    return NextResponse.json(course)
  } catch (error: any) {
    if (error instanceof z.ZodError) return NextResponse.json({ error: 'Invalid course data.' }, { status: 400 })
    if (error.message === 'Unauthorized') return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    if (error.message === 'Forbidden') return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    return NextResponse.json({ error: 'Failed to update course' }, { status: 500 })
  }
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const user = await requireInstructor()
    const { id } = await params
    const existing = await prisma.course.findUnique({ where: { id } })
    if (!existing) return NextResponse.json({ error: 'Course not found' }, { status: 404 })
    if (!isAdminRole(user.role) && existing.instructorId !== user.id) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }
    await prisma.course.delete({ where: { id } })
    return NextResponse.json({ success: true })
  } catch (error: any) {
    if (error.message === 'Unauthorized') return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    if (error.message === 'Forbidden') return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    return NextResponse.json({ error: 'Failed to delete course' }, { status: 500 })
  }
}
