import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { requireInstructor, slugify } from '@/lib/lms/utils'
import { z } from 'zod'

const courseCreateSchema = z.object({
  title: z.string().trim().min(1).max(300),
  slug: z.string().trim().min(1).max(300).regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/).optional(),
  description: z.string().trim().max(10000).optional().nullable(),
  thumbnail: z.string().url().max(500).optional().nullable(),
  categoryId: z.string().uuid().optional().nullable(),
  level: z.string().trim().max(50).optional().nullable(),
  duration: z.number().int().min(0).max(100000).optional().nullable(),
  price: z.union([z.number().finite().min(0), z.string().trim().regex(/^\d+(?:\.\d{1,2})?$/)]).optional().nullable(),
  isFree: z.boolean().optional(),
  status: z.enum(['DRAFT', 'PUBLISHED', 'ARCHIVED']).optional(),
})

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '20')
    const status = searchParams.get('status')
    const categoryId = searchParams.get('categoryId')
    const instructorId = searchParams.get('instructorId')
    const search = searchParams.get('search')
    const isCompleteParam = searchParams.get('isComplete')
    const scope = searchParams.get('scope')

    const where: any = {}
    if (status) where.status = status
    if (categoryId) where.categoryId = categoryId
    if (instructorId) where.instructorId = instructorId
    if (search) where.title = { contains: search, mode: 'insensitive' }
    if (isCompleteParam === 'true') where.isComplete = true
    else if (isCompleteParam === 'false') where.isComplete = false
    if (scope !== 'admin' && !instructorId && !isCompleteParam) {
      where.OR = [
        { status: { not: 'DRAFT' } },
        { isComplete: true },
      ]
    }

    const [courses, total] = await Promise.all([
      prisma.course.findMany({
        where,
        skip: (page - 1) * limit,
        take: limit,
        orderBy: { createdAt: 'desc' },
        include: {
          category: { select: { id: true, name: true, slug: true } },
          _count: { select: { modules: true, lessons: true, enrollments: true } },
        },
      }),
      prisma.course.count({ where }),
    ])

    return NextResponse.json({ data: courses, total, page, limit })
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch courses' }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  try {
    const user = await requireInstructor()
    const body = courseCreateSchema.parse(await req.json())
    const { title, description, thumbnail, categoryId, level, price, isFree, status } = body
    let slug = body.slug
    if (!slug) slug = slugify(title)

    const existing = await prisma.course.findUnique({ where: { slug } })
    if (existing) slug = `${slug}-${Date.now()}`

    const courseStatus = status === 'PUBLISHED' ? 'PUBLISHED' : 'DRAFT'

    const course = await prisma.course.create({
      data: {
        title,
        slug,
        description,
        thumbnail,
        categoryId,
        level,
        price: price == null ? null : Number(price),
        isFree: isFree ?? false,
        status: courseStatus,
        publishedAt: courseStatus === 'PUBLISHED' ? new Date() : undefined,
        isComplete: false,
        instructorId: user.id,
      },
      include: {
        category: { select: { id: true, name: true, slug: true } },
      },
    })
    return NextResponse.json(course, { status: 201 })
  } catch (error: any) {
    if (error instanceof z.ZodError) return NextResponse.json({ error: 'Invalid course data.' }, { status: 400 })
    if (error.message === 'Unauthorized') return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    if (error.message === 'Forbidden') return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    return NextResponse.json({ error: 'Failed to create course' }, { status: 500 })
  }
}
