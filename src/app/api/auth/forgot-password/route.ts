import { NextResponse } from 'next/server'
import { z, ZodError } from 'zod'
import crypto from 'crypto'
import { prisma } from '@/lib/prisma'
import { rateLimiter } from '@/lib/rate-limit'
import { sendEmail } from '@/lib/email'

const forgotPasswordSchema = z.object({
  email: z.string().email(),
})

type ForgotPasswordBody = z.infer<typeof forgotPasswordSchema>

function generateOTP(): string {
  return Math.floor(100000 + Math.random() * 900000).toString()
}

export async function POST(request: Request) {
  try {
    const ip = (request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || 
               request.headers.get('x-real-ip') || 
               request.headers.get('cf-connecting-ip') || 
               'unknown') as string
    
    if (rateLimiter.isBlocked(ip)) {
      return NextResponse.json(
        { error: 'Too many requests. Please try again later.' },
        { status: 429 }
      )
    }

    const body = (await request.json()) as ForgotPasswordBody
    const { email } = forgotPasswordSchema.parse(body)

    const user = await prisma.user.findUnique({
      where: { email }
    })

    if (!user) {
      return NextResponse.json(
        { message: 'If an account exists with that email, you will receive reset instructions.' },
        { status: 200 }
      )
    }

    const otp = generateOTP()
    const otpHash = crypto.createHash('sha256').update(otp).digest('hex')
    const expiry = new Date(Date.now() + 10 * 60 * 1000)

    await prisma.user.update({
      where: { id: user.id },
      data: {
        resetOTP: otpHash,
        resetOTPExpiry: expiry,
      }
    })

    rateLimiter.reset(ip)

    console.log('=== OTP DEBUG ===')
    console.log('To:', email)
    console.log('OTP:', otp)
    console.log('=================')

    try {
      const result = await sendEmail({
        to: email,
        subject: 'Your password reset OTP',
        html: `<p>Your password reset OTP is: <strong>${otp}</strong>. It expires in 10 minutes.</p>`,
      })
      if (!result.success) {
        console.error('Email send failed:', result.error)
      }
    } catch (emailError) {
      console.error('Email send error:', emailError)
    }

    return NextResponse.json(
      { 
        message: 'If an account exists with that email, you will receive reset instructions.',
        ...(process.env.NODE_ENV === 'development' ? { otp } : {})
      },
      { status: 200 }
    )
  } catch (error) {
    if (error instanceof ZodError) {
      return NextResponse.json(
        { error: 'Validation failed', issues: z.flattenError(error).fieldErrors },
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
