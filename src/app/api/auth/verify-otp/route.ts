import { NextResponse } from 'next/server'
import { z, ZodError } from 'zod'
import crypto from 'crypto'
import { supabaseAdmin } from '@/lib/supabase/admin'
import { rateLimiter } from '@/lib/rate-limit'

const verifyOTPSchema = z.object({
  email: z.string().email(),
  otp: z.string().length(6),
})

type VerifyOTPBody = z.infer<typeof verifyOTPSchema>

function verifyOTP(otp: string, storedHash: string): boolean {
  const [salt, hash] = storedHash.split(':')
  if (!salt || !hash) return false
  const verifyHash = crypto.scryptSync(otp, salt, 64).toString('hex')
  return hash === verifyHash
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

    const body = (await request.json()) as VerifyOTPBody
    const { email, otp } = verifyOTPSchema.parse(body)

    const { data } = await supabaseAdmin().auth.admin.listUsers({ page: 1, perPage: 1000 })

    const user = data?.users?.find((u) => u.email?.toLowerCase() === email.toLowerCase())

    if (!user) {
      rateLimiter.increment(ip)
      return NextResponse.json(
        { error: 'Invalid or expired OTP' },
        { status: 400 }
      )
    }

    const storedOTP = (user.user_metadata || {}).resetOTP
    const expiry = (user.user_metadata || {}).resetOTPExpiry

    const otpValid = storedOTP && verifyOTP(otp, storedOTP)
    if (!otpValid || !expiry || new Date(expiry) < new Date()) {
      rateLimiter.increment(ip)
      return NextResponse.json(
        { error: 'Invalid or expired OTP' },
        { status: 400 }
      )
    }

    rateLimiter.reset(ip)

    const resetToken = crypto.randomBytes(32).toString('hex')
    const resetTokenExpiry = new Date(Date.now() + 60 * 60 * 1000).toISOString()

    await supabaseAdmin().auth.admin.updateUserById(user.id, {
      user_metadata: {
        ...user.user_metadata,
        resetOTP: null,
        resetOTPExpiry: null,
        resetToken,
        resetTokenExpiry,
      }
    })

    return NextResponse.json(
      { message: 'OTP verified successfully. Check your email for the reset link.' },
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
