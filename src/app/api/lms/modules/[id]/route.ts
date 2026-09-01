import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { requireInstructor } from '@/lib/lms/utils'
import { isAdminRole } from '@/lib/lms/roles'
import { z } from 'zod'

const moduleUpdateSchema = z.object({
  title: z.string().trim().min(1).max(300).optional(),
  sortOrder: z.number().int().min(0).optional(),
})

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    const module = await prisma.module.findUnique({ where: { id }, include: { lessons: { orderBy: { sortOrder: 'asc' } }, _count: { select: { lessons: true } } } })
    if (!module) return NextResponse.json({ error: 'Module not found' }, { status: 404 })
    return NextResponse.json(module)
  } catch {
    return NextResponse.json({ error: 'Failed to fetch module' }, { status: 500 })
  }
}

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const user = await requireInstructor()
    const { id } = await params
    const existing = await prisma.module.findUnique({ where: { id }, select: { course: { select: { instructorId: true } } } })
    if (!existing) return NextResponse.json({ error: 'Module not found' }, { status: 404 })
    if (!isAdminRole(user.role) && existing.course.instructorId !== user.id) return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    const body = moduleUpdateSchema.parse(await req.json())
    const module = await prisma.module.update({ where: { id }, data: body, include: { lessons: { orderBy: { sortOrder: 'asc' } }, _count: { select: { lessons: true } } } })
    return NextResponse.json(module)
  } catch (error: any) {
    if (error instanceof z.ZodError) return NextResponse.json({ error: 'Invalid module data.' }, { status: 400 })
    if (error.message === 'Unauthorized') return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    if (error.message === 'Forbidden') return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    return NextResponse.json({ error: 'Failed to update module' }, { status: 500 })
  }
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const user = await requireInstructor()
    const { id } = await params
    const existing = await prisma.module.findUnique({ where: { id }, select: { course: { select: { instructorId: true } } } })
    if (!existing) return NextResponse.json({ error: 'Module not found' }, { status: 404 })
    if (!isAdminRole(user.role) && existing.course.instructorId !== user.id) return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    await prisma.module.delete({ where: { id } })
    return NextResponse.json({ success: true })
  } catch (error: any) {
    if (error.message === 'Unauthorized') return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    if (error.message === 'Forbidden') return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    return NextResponse.json({ error: 'Failed to delete module' }, { status: 500 })
  }
}
