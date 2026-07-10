import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { requireAuth } from '@/lib/lms/utils'
import { getSupabaseAdminClient } from '@/lib/supabase/server'

export async function PUT(req: NextRequest) {
  try {
    const user = await requireAuth()
    const body = await req.json()

    if (body.name !== undefined) {
      if (!body.name.trim()) {
        return NextResponse.json({ error: 'Name is required' }, { status: 400 })
      }
      await prisma.user.update({
        where: { id: user.id },
        data: { name: body.name.trim() },
      })
    }

    if (body.image !== undefined) {
      await prisma.user.update({
        where: { id: user.id },
        data: { image: body.image || null },
      })
    }

    if (body.password) {
      if (!body.currentPassword) {
        return NextResponse.json({ error: 'Current password is required' }, { status: 400 })
      }
      if (body.password.length < 6) {
        return NextResponse.json({ error: 'Password must be at least 6 characters' }, { status: 400 })
      }

      const supabase = getSupabaseAdminClient()
      const { error: signInError } = await supabase.auth.signInWithPassword({
        email: user.email,
        password: body.currentPassword,
      })
      if (signInError) {
        return NextResponse.json({ error: 'Current password is incorrect' }, { status: 400 })
      }

      const { error } = await supabase.auth.admin.updateUserById(user.id, { password: body.password })
      if (error) {
        return NextResponse.json({ error: error.message }, { status: 400 })
      }
    }

    const updated = await prisma.user.findUnique({
      where: { id: user.id },
      select: { id: true, name: true, email: true, image: true },
    })

    return NextResponse.json(updated)
  } catch (error: any) {
    if (error.message === 'Unauthorized') return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    return NextResponse.json({ error: 'Failed to update settings' }, { status: 500 })
  }
}
