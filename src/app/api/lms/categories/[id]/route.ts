import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { requireInstructor } from '@/lib/lms/utils'

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    const category = await prisma.category.findUnique({ where: { id }, include: { _count: { select: { courses: true } } } })
    if (!category) return NextResponse.json({ error: 'Category not found' }, { status: 404 })
    return NextResponse.json(category)
  } catch {
    return NextResponse.json({ error: 'Failed to fetch category' }, { status: 500 })
  }
}

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    await requireInstructor()
    const { id } = await params
    const body = await req.json()
    const { name, slug } = body
    if (name || slug) {
      const or: any[] = []
      if (name) or.push({ name })
      if (slug) or.push({ slug })
      const existing = await prisma.category.findFirst({
        where: {
          id: { not: id },
          OR: or,
        },
      })
      if (existing) {
        return NextResponse.json({ error: 'Category already exists' }, { status: 409 })
      }
    }
    const category = await prisma.category.update({ where: { id }, data: body })
    return NextResponse.json(category)
  } catch (error: any) {
    if (error.message === 'Unauthorized' || error.message === 'Forbidden') return NextResponse.json({ error: error.message }, { status: 401 })
    return NextResponse.json({ error: 'Failed to update category' }, { status: 500 })
  }
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    await requireInstructor()
    const { id } = await params
    await prisma.category.delete({ where: { id } })
    return NextResponse.json({ success: true })
  } catch (error: any) {
    if (error.message === 'Unauthorized' || error.message === 'Forbidden') return NextResponse.json({ error: error.message }, { status: 401 })
    return NextResponse.json({ error: 'Failed to delete category' }, { status: 500 })
  }
}
