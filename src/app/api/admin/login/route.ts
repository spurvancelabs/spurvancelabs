import { NextResponse } from 'next/server'
import { z, ZodError } from 'zod'
import { getSupabaseServerClient, getSupabaseAdminClient } from '@/lib/supabase/server'
import { generateAccessToken, generateRefreshToken } from '@/lib/auth'
import { rateLimiter } from '@/lib/rate-limit'
import { ROLES, hasMinRole } from '@/lib/lms/roles'

const adminLoginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
})

export async function POST(request: Request) {
  try {
    const ip =
      request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ||
      request.headers.get('x-real-ip') ||
      request.headers.get('cf-connecting-ip') ||
      'unknown'

    if (rateLimiter.isBlocked(ip)) {
      return NextResponse.json(
        { error: 'Too many login attempts. Please try again later.' },
        { status: 429 }
      )
    }

    const body = await request.json()
    const { email, password } = adminLoginSchema.parse(body)

    const supabase = getSupabaseServerClient()
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    if (error || !data.user) {
      rateLimiter.increment(ip)
      return NextResponse.json(
        { error: 'Invalid credentials' },
        { status: 401 }
      )
    }

    const adminSupabase = getSupabaseAdminClient()
    const { data: adminUser } = await adminSupabase
      .from('admin_users')
      .select('role')
      .eq('user_id', data.user.id)
      .single()

    if (!adminUser?.role || !hasMinRole(adminUser.role, ROLES.VIEWER)) {
      rateLimiter.increment(ip)
      return NextResponse.json(
        { error: 'Access denied. Admin privileges required.' },
        { status: 403 }
      )
    }

    rateLimiter.reset(ip)

    const accessToken = await generateAccessToken({
      userId: data.user.id,
      email: data.user.email!,
      role: adminUser.role,
    })

    const refreshToken = await generateRefreshToken({
      userId: data.user.id,
      email: data.user.email!,
      role: adminUser.role,
    })

    const response = NextResponse.json(
      {
        message: 'Admin login successful',
        user: {
          id: data.user.id,
          email: data.user.email,
          role: adminUser.role,
        },
      },
      { status: 200 }
    )

    response.cookies.set('token', accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 15 * 60,
      path: '/',
    })

    response.cookies.set('refreshToken', refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60,
      path: '/',
    })

    return response
  } catch (error) {
    if (error instanceof ZodError) {
      return NextResponse.json(
        { error: 'Validation failed', issues: error.flatten().fieldErrors },
        { status: 400 }
      )
    }

    console.error('Admin login error:', error)

    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
