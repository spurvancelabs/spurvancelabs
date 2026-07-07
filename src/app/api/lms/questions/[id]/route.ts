import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { requireInstructor } from '@/lib/lms/utils'

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    await requireInstructor()
    const { id } = await params
    const body = await req.json()
    const question = await prisma.question.update({ where: { id }, data: body })
    return NextResponse.json(question)
  } catch (error: any) {
    if (error.message === 'Unauthorized' || error.message === 'Forbidden') return NextResponse.json({ error: error.message }, { status: 401 })
    return NextResponse.json({ error: 'Failed to update question' }, { status: 500 })
  }
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    await requireInstructor()
    const { id } = await params
    await prisma.question.delete({ where: { id } })
    return NextResponse.json({ success: true })
  } catch (error: any) {
    if (error.message === 'Unauthorized' || error.message === 'Forbidden') return NextResponse.json({ error: error.message }, { status: 401 })
    return NextResponse.json({ error: 'Failed to delete question' }, { status: 500 })
  }
}
