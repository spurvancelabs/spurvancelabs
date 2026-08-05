import { NextResponse } from 'next/server'
import { z, ZodError } from 'zod'
import { getSupabaseServerClient } from '@/lib/supabase/server'
import { generateAccessToken, generateRefreshToken } from '@/lib/auth'
import { rateLimiter } from '@/lib/rate-limit'
import { NotificationTrigger } from '@/lib/notification/trigger'
import { ROLES } from '@/lib/lms/roles'

const loginSchema = z.object({
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

    // rate limit check
    if (rateLimiter.isBlocked(ip)) {
      return NextResponse.json(
        { error: 'Too many login attempts. Please try again later.' },
        { status: 429 }
      )
    }

    const body = await request.json()
    const { email, password } = loginSchema.parse(body)

    // ✅ Supabase login (ONLY AUTH LOGIC)
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

    const user = data.user

    rateLimiter.reset(ip)

    // JWT (your custom tokens if needed)
    const accessToken = await generateAccessToken({
      userId: user.id,
      email: user.email!,
    })

    const refreshToken = await generateRefreshToken({
      userId: user.id,
      email: user.email!,
    })

    const { data: userRecord } = await supabase
      .from('users')
      .select('type')
      .eq('id', user.id)
      .single();

    const { data: adminRecord } = await supabase
      .from('admin_users')
      .select('role')
      .eq('user_id', user.id)
      .single();

    if (adminRecord?.role) {
      rateLimiter.increment(ip);
      return NextResponse.json(
        { error: 'Invalid credentials' },
        { status: 401 }
      );
    }

    const role = userRecord?.type || ROLES.USER;

    const response = NextResponse.json(
      {
        message: 'Login successful',
        user: {
          id: user.id,
          email: user.email,
          role,
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

    // Create login notification (best effort)
    try {
      await NotificationTrigger.triggerNotification({
        user_id: user.id,
        type: 'info',
        title: 'Login Successful',
        message: 'Welcome back! You have logged in successfully.',
      });
    } catch (notificationError) {
      console.error('Failed to create notification:', notificationError);
    }

    return response
  } catch (error) {
    if (error instanceof ZodError) {
      return NextResponse.json(
        { error: 'Validation failed', issues: error.flatten().fieldErrors },
        { status: 400 }
      )
    }

    console.error('Login error:', error)

    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}