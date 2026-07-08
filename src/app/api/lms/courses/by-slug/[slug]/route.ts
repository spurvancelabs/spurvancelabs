import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prisma'

export async function GET(req: NextRequest, { params }: { params: Promise<{ slug: string }> }) {
  try {
    const { slug } = await params
    const course = await prisma.course.findUnique({
      where: { slug },
      include: {
        category: { select: { id: true, name: true, slug: true } },
        modules: {
          orderBy: { sortOrder: 'asc' },
          include: {
            lessons: {
              orderBy: { sortOrder: 'asc' },
              where: { isPublished: true },
              include: {
                quizzes: { include: { _count: { select: { questions: true } } } },
              },
            },
          },
        },
        _count: { select: { modules: true, enrollments: true } },
      },
    })
    if (!course) return NextResponse.json({ error: 'Course not found' }, { status: 404 })
    return NextResponse.json(course)
  } catch {
    return NextResponse.json({ error: 'Failed to fetch course' }, { status: 500 })
  }
}
