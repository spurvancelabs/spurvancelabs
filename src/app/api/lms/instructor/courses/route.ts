import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { requireInstructor } from '@/lib/lms/utils'

export async function GET(req: NextRequest) {
  try {
    await requireInstructor()
    const { searchParams } = new URL(req.url)
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '20')
    const status = searchParams.get('status')
    const search = searchParams.get('search')
    const isCompleteParam = searchParams.get('isComplete')

    const where: any = {}
    if (status) where.status = status
    if (search) where.title = { contains: search, mode: 'insensitive' }
    if (isCompleteParam === 'true') where.isComplete = true
    else if (isCompleteParam === 'false') where.isComplete = false

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
  } catch (error: any) {
    if (error.message === 'Unauthorized' || error.message === 'Forbidden') {
      return NextResponse.json({ error: error.message }, { status: 401 })
    }
    return NextResponse.json({ error: 'Failed to fetch courses' }, { status: 500 })
  }
}
