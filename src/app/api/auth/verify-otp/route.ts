import { NextResponse } from 'next/server'
import { z, ZodError } from 'zod'
import crypto from 'crypto'
import { prisma } from '@/lib/prisma'
import { rateLimiter } from '@/lib/rate-limit'

const verifyOTPSchema = z.object({
  email: z.string().email(),
  otp: z.string().length(6),
})

type VerifyOTPBody = z.infer<typeof verifyOTPSchema>

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

    const body = (await request.json()) as VerifyOTPBody
    const { email, otp } = verifyOTPSchema.parse(body)

    const otpHash = crypto.createHash('sha256').update(otp).digest('hex')

    const user = await prisma.user.findFirst({
      where: {
        email,
        resetOTP: otpHash,
        resetOTPExpiry: {
          gt: new Date()
        }
      }
    })

    if (!user) {
      rateLimiter.increment(ip)
      return NextResponse.json(
        { error: 'Invalid or expired OTP' },
        { status: 400 }
      )
    }

    rateLimiter.reset(ip)

    const resetToken = crypto.randomBytes(32).toString('hex')
    const resetTokenExpiry = new Date(Date.now() + 60 * 60 * 1000)

    await prisma.user.update({
      where: { id: user.id },
      data: {
        resetOTP: null,
        resetOTPExpiry: null,
        resetToken,
        resetTokenExpiry,
      }
    })

    return NextResponse.json(
      { message: 'OTP verified successfully', resetToken },
      { status: 200 }
    )
  } catch (error) {
    if (error instanceof ZodError) {
      return NextResponse.json(
        { error: 'Validation failed', issues: z.flattenError(error).fieldErrors },
        { status: 400 }
      )
    }
    console.error('Verify OTP error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}