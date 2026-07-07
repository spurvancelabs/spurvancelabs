import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { requireInstructor } from '@/lib/lms/utils'

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const courseId = searchParams.get('courseId')
    if (!courseId) return NextResponse.json({ error: 'courseId is required' }, { status: 400 })

    const modules = await prisma.module.findMany({
      where: { courseId },
      orderBy: { sortOrder: 'asc' },
      include: {
        lessons: { orderBy: { sortOrder: 'asc' }, include: { _count: { select: { quizzes: true } } } },
      },
    })
    return NextResponse.json(modules)
  } catch {
    return NextResponse.json({ error: 'Failed to fetch modules' }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  try {
    await requireInstructor()
    const body = await req.json()
    const { courseId, title } = body
    if (!courseId || !title) return NextResponse.json({ error: 'courseId and title are required' }, { status: 400 })

    const maxOrder = await prisma.module.findFirst({ where: { courseId }, orderBy: { sortOrder: 'desc' }, select: { sortOrder: true } })
    const sortOrder = (maxOrder?.sortOrder ?? -1) + 1

    const module = await prisma.module.create({
      data: { courseId, title, sortOrder },
      include: { lessons: true },
    })
    return NextResponse.json(module, { status: 201 })
  } catch (error: any) {
    if (error.message === 'Unauthorized' || error.message === 'Forbidden') return NextResponse.json({ error: error.message }, { status: 401 })
    return NextResponse.json({ error: 'Failed to create module' }, { status: 500 })
  }
}
