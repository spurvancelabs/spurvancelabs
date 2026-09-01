import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { requireInstructor } from '@/lib/lms/utils'
import { isAdminRole } from '@/lib/lms/roles'
import { z } from 'zod'

const moduleCreateSchema = z.object({ courseId: z.string().uuid(), title: z.string().trim().min(1).max(300) })

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
        _count: { select: { lessons: true } },
      },
    })
    return NextResponse.json(modules)
  } catch {
    return NextResponse.json({ error: 'Failed to fetch modules' }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  try {
    const user = await requireInstructor()
    const { courseId, title } = moduleCreateSchema.parse(await req.json())
    const course = await prisma.course.findUnique({ where: { id: courseId }, select: { instructorId: true } })
    if (!course) return NextResponse.json({ error: 'Course not found' }, { status: 404 })
    if (!isAdminRole(user.role) && course.instructorId !== user.id) return NextResponse.json({ error: 'Forbidden' }, { status: 403 })

    const maxOrder = await prisma.module.findFirst({ where: { courseId }, orderBy: { sortOrder: 'desc' }, select: { sortOrder: true } })
    const sortOrder = (maxOrder?.sortOrder ?? -1) + 1

    const module = await prisma.module.create({
      data: { courseId, title, sortOrder },
      include: { lessons: true, _count: { select: { lessons: true } } },
    })
    return NextResponse.json(module, { status: 201 })
  } catch (error: any) {
    if (error instanceof z.ZodError) return NextResponse.json({ error: 'Invalid module data.' }, { status: 400 })
    if (error.message === 'Unauthorized') return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    if (error.message === 'Forbidden') return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    return NextResponse.json({ error: 'Failed to create module' }, { status: 500 })
  }
}
