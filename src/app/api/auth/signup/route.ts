import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { z, ZodError } from 'zod'
import bcrypt from 'bcryptjs'
import crypto from 'crypto'
import { prisma } from '@/lib/prisma'
import { generateAccessToken, generateRefreshToken } from '@/lib/auth'
import { rateLimiter } from '@/lib/rate-limit'
import { notificationService } from '@/lib/notification-service'

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
    const ip = (request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || 
               request.headers.get('x-real-ip') || 
               request.headers.get('cf-connecting-ip') || 
               'unknown') as string
    
    if (rateLimiter.isBlocked(ip)) {
      return NextResponse.json(
        { error: 'Too many signup attempts. Please try again later.' },
        { status: 429 }
      )
    }

    const body = (await request.json()) as SignupBody
    const { email, password, name } = signupSchema.parse(body)

    const existingUser = await prisma.user.findUnique({
      where: { email }
    })

    if (existingUser) {
      return NextResponse.json(
        { error: 'Email is already registered' },
        { status: 400 }
      )
    }

    const hashedPassword = await bcrypt.hash(password, 12)

    const emailVerifyToken = crypto.randomBytes(32).toString('hex')

    const user = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        name,
        emailVerifyToken,
      }
    })

    rateLimiter.reset(ip)

    const verifyUrl = `${request.headers.get('referer')?.split('/').slice(0, 3).join('/') || new URL(request.url).origin}/verify-email?token=${encodeURIComponent(emailVerifyToken)}`

    let emailSent = true
    try {
      const { sendEmail } = await import('@/lib/email')
      const emailResult = await sendEmail({
        to: email,
        subject: 'Verify your email',
        html: `<p>Please verify your email by clicking <a href="${verifyUrl}">here</a>.</p>`,
      })
      if (!emailResult.success) {
        emailSent = false
        console.error('Email send failed:', emailResult.error)
      }
    } catch (emailError) {
      emailSent = false
      console.error('Email send error:', emailError)
    }

    const accessToken = generateAccessToken({ 
      userId: user.id, 
      email: user.email 
    })

    const refreshToken = generateRefreshToken({ 
      userId: user.id, 
      email: user.email 
    })

    await prisma.user.update({
      where: { id: user.id },
      data: { refreshToken }
    })

    await prisma.auditLog.create({
      data: {
        userId: user.id,
        action: 'SIGNUP',
        ip,
        userAgent: request.headers.get('user-agent')
      }
    })

    notificationService.create(user.id, {
      title: 'Welcome!',
      message: 'Your account has been created successfully.',
      priority: 'HIGH',
      type: 'SUCCESS'
    }).catch(console.error)

    const cookieStore = await cookies()
    cookieStore.set("token", accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: "strict",
      maxAge: 15 * 60,
      path: "/",
    })

    cookieStore.set("refreshToken", refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60,
      path: "/",
    })

    const response = NextResponse.json(
      { 
        message: emailSent 
          ? 'Signup successful. Please check your email to verify your account.' 
          : 'Signup successful. Verification email may not have been sent (check console).',
        user: { id: user.id, email: user.email, name: user.name } 
      },
      { status: 201 }
    )
    
    response.headers.set('X-Content-Type-Options', 'nosniff')
    response.headers.set('X-Frame-Options', 'DENY')
    response.headers.set('X-XSS-Protection', '1; mode=block')
    
    return response
  } catch (error) {
    if (error instanceof ZodError) {
      return NextResponse.json(
        { error: 'Validation failed', issues: z.flattenError(error).fieldErrors },
        { status: 400 }
      )
    }
    console.error('Signup error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
