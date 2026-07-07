import { NextResponse } from 'next/server'
import { z, ZodError } from 'zod'
import { supabaseAdmin } from '@/lib/supabase/admin'
import { rateLimiter } from '@/lib/rate-limit'

const forgotPasswordSchema = z.object({
  email: z.string().email(),
})

function generateOTP(): string {
  return Math.floor(100000 + Math.random() * 900000).toString()
}

export async function POST(request: Request) {
  try {
    const ip =
      request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ||
      request.headers.get('x-real-ip') ||
      request.headers.get('cf-connecting-ip') ||
      'unknown'

    if (rateLimiter.isBlocked(ip)) {
      return NextResponse.json(
        { error: 'Too many requests. Please try again later.' },
        { status: 429 }
      )
    }

    const body = await request.json()
    const { email } = forgotPasswordSchema.parse(body)

    // ✅ FIX: correct destructuring
    const { data, error } = await supabaseAdmin().auth.admin.listUsers()

    if (error) {
      return NextResponse.json(
        { error: 'Failed to fetch users' },
        { status: 500 }
      )
    }

    const user = data.users.find(
      (u) => u.email?.toLowerCase() === email.toLowerCase()
    )

    rateLimiter.reset(ip)

    // ⚠️ Always return same response (security best practice)
    if (!user) {
      return NextResponse.json(
        {
          message:
            'If an account exists with that email, you will receive reset instructions.',
        },
        { status: 200 }
      )
    }

    const otp = generateOTP()
    const expiry = new Date(Date.now() + 10 * 60 * 1000).toISOString()

    await supabaseAdmin().auth.admin.updateUserById(user.id, {
      user_metadata: {
        ...user.user_metadata,
        resetOTP: otp,
        resetOTPExpiry: expiry,
      },
    })

    try {
      const { sendEmail } = await import('@/lib/email')

      await sendEmail({
        to: email,
        subject: 'Your password reset OTP',
        html: `<p>Your OTP is: <strong>${otp}</strong>. It expires in 10 minutes.</p>`,
      })
    } catch (emailError) {
      console.error('Email error:', emailError)
    }

    return NextResponse.json(
      {
        message:
          'If an account exists with that email, you will receive reset instructions.',
      },
      { status: 200 }
    )
  } catch (error) {
    if (error instanceof ZodError) {
      return NextResponse.json(
        {
          error: 'Validation failed',
          issues: error.flatten().fieldErrors,
        },
        { status: 400 }
      )
    }

    console.error('Forgot password error:', error)

    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}