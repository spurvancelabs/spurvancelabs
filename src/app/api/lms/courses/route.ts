import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { requireInstructor, slugify } from '@/lib/lms/utils'

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

    const where: any = {}
    if (status) where.status = status
    if (categoryId) where.categoryId = categoryId
    if (instructorId) where.instructorId = instructorId
    if (search) where.title = { contains: search, mode: 'insensitive' }
    if (isCompleteParam === 'true') where.isComplete = true
    else if (isCompleteParam === 'false') where.isComplete = false
    if (!instructorId && !isCompleteParam) {
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
          _count: { select: { modules: true, enrollments: true } },
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
    const body = await req.json()
    const { title, description, thumbnail, categoryId, level, price, isFree } = body
    let slug = body.slug
    if (!slug) slug = slugify(title)

    const existing = await prisma.course.findUnique({ where: { slug } })
    if (existing) slug = `${slug}-${Date.now()}`

    const course = await prisma.course.create({
      data: {
        title,
        slug,
        description,
        thumbnail,
        categoryId,
        level,
        price: price ? parseFloat(price) : null,
        isFree: isFree ?? false,
        status: 'DRAFT',
        isComplete: false,
        instructorId: user.id,
      },
      include: {
        category: { select: { id: true, name: true, slug: true } },
      },
    })
    return NextResponse.json(course, { status: 201 })
  } catch (error: any) {
    if (error.message === 'Unauthorized' || error.message === 'Forbidden') return NextResponse.json({ error: error.message }, { status: 401 })
    return NextResponse.json({ error: 'Failed to create course' }, { status: 500 })
  }
}
