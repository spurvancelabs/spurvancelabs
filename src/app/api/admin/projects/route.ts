import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { requireSuperAdmin, ensurePublicUserRecord } from '@/lib/lms/utils'
import { z } from 'zod'

const projectCreateSchema = z.object({
  name: z.string().trim().min(1).max(300),
  key: z.string().trim().min(1).max(10).regex(/^[A-Za-z0-9_-]+$/),
  description: z.string().trim().max(5000).optional().nullable(),
  color: z.string().regex(/^#[0-9A-Fa-f]{6}$/).optional().nullable(),
})

export async function GET() {
  try {
    await requireSuperAdmin()

    const projects = await prisma.project.findMany({
      include: {
        owner: { select: { id: true, name: true, email: true, image: true } },
        _count: { select: { members: true, tickets: true, sprints: true } },
      },
      orderBy: { createdAt: 'desc' },
    })

    return NextResponse.json({ projects })
  } catch (error: any) {
    if (error.message === 'Unauthorized') return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    if (error.message === 'Forbidden') return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    console.error('Failed to fetch admin projects', error)
    return NextResponse.json({ error: 'Failed to fetch projects' }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  try {
    const user = await requireSuperAdmin()
    const body = projectCreateSchema.parse(await req.json())
    const key = body.key.toUpperCase()

    await ensurePublicUserRecord(user.id, { email: user.email, name: user.name, image: user.image })

    const existing = await prisma.project.findUnique({ where: { key } })
    if (existing) return NextResponse.json({ error: 'Project key already exists.' }, { status: 409 })

    const project = await prisma.project.create({
      data: {
        name: body.name,
        key,
        description: body.description || null,
        color: body.color || '#6366f1',
        ownerId: user.id,
        members: { create: { userId: user.id, role: 'PROJECT_OWNER' } },
      },
      include: {
        owner: { select: { id: true, name: true, email: true, image: true } },
        _count: { select: { members: true, tickets: true, sprints: true } },
      },
    })

    return NextResponse.json({ data: project }, { status: 201 })
  } catch (error: any) {
    if (error instanceof z.ZodError) return NextResponse.json({ error: 'Please provide a valid project name, key, description, and color.' }, { status: 400 })
    if (error.message === 'Unauthorized') return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    if (error.message === 'Forbidden') return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    if (error?.code === 'P2002') return NextResponse.json({ error: 'Project key already exists.' }, { status: 409 })
    console.error('Failed to create admin project', error)
    return NextResponse.json({ error: 'Unable to create the project. Please try again.' }, { status: 500 })
  }
}
