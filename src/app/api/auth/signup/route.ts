import { NextResponse } from 'next/server'
import { z, ZodError } from 'zod'
import { supabaseAdmin } from '@/lib/supabase/admin'
import { rateLimiter } from '@/lib/rate-limit'
import { supabase } from '@/lib/supabase'
import { ROLES } from '@/lib/lms/roles'

const signupSchema = z.object({
  email: z.string().email(),
  password: z.string()
    .min(8, "Password must be at least 8 characters")
    .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
    .regex(/[0-9]/, "Password must contain at least one number")
    .regex(/[^A-Za-z0-9]/, "Password must contain at least one symbol"),
  name: z.string().min(1),
})
type SignupBody = z.infer<typeof signupSchema>

export async function POST(request: Request) {
  try {
    const ip =
      request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ||
      request.headers.get('x-real-ip') ||
      request.headers.get('cf-connecting-ip') ||
      'unknown'

    if (rateLimiter.isBlocked(ip)) {
      return NextResponse.json(
        { success: false, message: 'Too many signup attempts. Please try again later.' },
        { status: 429 }
      )
    }

    const body = (await request.json()) as SignupBody
    const { email, password, name } = signupSchema.parse(body)

    console.log('Creating user:', { email, name })

    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          name,
          role: ROLES.USER,
        },
emailRedirectTo: `${process.env.NEXT_PUBLIC_APP_URL}/verify-email`,
      },
    })

    // ❌ handle error ONCE only
    if (error) {
      console.error('Supabase auth error:', error)

      if (error.message?.toLowerCase().includes('already')) {
        return NextResponse.json(
          { success: false, message: 'Email is already registered' },
          { status: 400 }
        )
      }

      return NextResponse.json(
        { success: false, message: error.message || 'Failed to create account' },
        { status: 400 }
      )
    }

    if (!data?.user) {
      return NextResponse.json(
        { success: false, message: 'Failed to create user' },
        { status: 500 }
      )
    }

    // ✅ SUCCESS RESPONSE
    return NextResponse.json(
      {
        success: true,
        message: 'Verification email sent! Please check your inbox.',
        user: {
          id: data.user.id,
          email: data.user.email,
        },
      },
      { status: 200 }
    )

  } catch (error) {
    if (error instanceof ZodError) {
      return NextResponse.json(
        {
          success: false,
          message: 'Validation failed',
          issues: error.flatten().fieldErrors,
        },
        { status: 400 }
      )
    }

    console.error('Signup error:', error)

    return NextResponse.json(
      {
        success: false,
        message: 'Internal server error',
      },
      { status: 500 }
    )
  }
}