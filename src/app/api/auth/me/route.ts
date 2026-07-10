import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { verifyToken } from '@/lib/auth'
import { getSupabaseAdminClient } from '@/lib/supabase/server'
import { ROLES } from '@/lib/lms/roles'

export async function GET() {
  try {
    const cookieStore = await cookies()
    const token = cookieStore.get('token')?.value

    if (!token) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const payload = await verifyToken(token)
    if (!payload) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const supabase = getSupabaseAdminClient()

    const { data: user } = await supabase
      .from('users')
      .select('id,name,email,type')
      .eq('id', payload.userId)
      .single()

    const { data: adminUser } = await supabase
      .from('admin_users')
      .select('role')
      .eq('user_id', payload.userId)
      .single()

    if (!user && !adminUser) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    if (!user) {
      return NextResponse.json({
        id: payload.userId,
        name: null,
        email: payload.email,
        image: null,
        role: adminUser!.role,
      })
    }

    let role = user.type ?? ROLES.USER

    if (adminUser?.role) {
      role = adminUser.role
    }

    return NextResponse.json({
      id: user.id,
      name: user.name,
      email: user.email,
      role,
    })
  } catch (error) {
    return NextResponse.json(
      { error: 'Unauthorized' },
      { status: 401 }
    )
  }
}
