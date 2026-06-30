import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { z } from 'zod'
import { supabaseAdmin } from '@/lib/supabase/admin'
import { generateAccessToken, generateRefreshToken } from '@/lib/auth'
import { rateLimiter } from '@/lib/rate-limit'
import { NotificationTrigger } from '@/lib/notification/trigger'

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
    const { data, error } = await supabaseAdmin()
      .auth.signInWithPassword({
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
    const accessToken = generateAccessToken({
      userId: user.id,
      email: user.email!,
    })

    const refreshToken = generateRefreshToken({
      userId: user.id,
      email: user.email!,
    })

    // cookies
    const cookieStore = await cookies()

    cookieStore.set('token', accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 15 * 60,
      path: '/',
    })

    cookieStore.set('refreshToken', refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
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

    const { data: userRecord } = await supabaseAdmin()
      .from('users')
      .select('role')
      .eq('id', user.id)
      .single();

    return NextResponse.json(
      {
        message: 'Login successful',
        user: {
          id: user.id,
          email: user.email,
          role: userRecord?.role || 'USER',
        },
      },
      { status: 200 }
    )
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Validation failed', issues: z.flattenError(error).fieldErrors },
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