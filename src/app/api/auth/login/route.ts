import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import bcrypt from 'bcryptjs'
import { z } from 'zod'
import { prisma } from '@/lib/prisma'
import { getJwtSecret, generateAccessToken, generateRefreshToken } from '@/lib/auth'
import { rateLimiter } from '@/lib/rate-limit'
import { notificationService } from '@/lib/notification-service'

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
})

type LoginBody = z.infer<typeof loginSchema>

export async function POST(request: Request) {
  try {
    const ip = (request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || 
               request.headers.get('x-real-ip') || 
               request.headers.get('cf-connecting-ip') || 
               'unknown') as string
    
    if (rateLimiter.isBlocked(ip)) {
      return NextResponse.json(
        { error: 'Too many login attempts. Please try again later.' },
        { status: 429 }
      )
    }

    const body = (await request.json()) as LoginBody
    const { email, password } = loginSchema.parse(body)

    const user = await prisma.user.findUnique({
      where: { email }
    })

    if (!user) {
      rateLimiter.increment(ip)
      return NextResponse.json(
        { error: 'Invalid credentials' },
        { status: 401 }
      )
    }

    if (user.lockedUntil && user.lockedUntil > new Date()) {
      return NextResponse.json(
        { error: 'Account is temporarily locked. Please try again later.' },
        { status: 423 }
      )
    }

    const isValid = await bcrypt.compare(password, user.password)
    if (!isValid) {
      rateLimiter.increment(ip)
      
      const failedAttempts = (user.failedAttempts || 0) + 1
      const updateData = { failedAttempts } as { failedAttempts: number; lockedUntil?: Date }
      
      if (failedAttempts >= 5) {
        updateData.lockedUntil = new Date(Date.now() + 30 * 60 * 1000)
      }
      
      await prisma.user.update({
        where: { id: user.id },
        data: updateData
      })

      return NextResponse.json(
        { error: 'Invalid credentials' },
        { status: 401 }
      )
    }

    rateLimiter.reset(ip)

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
      data: {
        refreshToken,
        failedAttempts: 0,
        lockedUntil: null,
        lastLoginAt: new Date()
      }
    })

    await prisma.auditLog.create({
      data: {
        userId: user.id,
        action: 'LOGIN',
        ip,
        userAgent: request.headers.get('user-agent')
      }
    })

    notificationService.notifyUserAction(user.id, 'LOGIN', { ip }).catch(console.error)

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
      { message: 'Login successful', user: { id: user.id, email: user.email } },
      { status: 200 }
    )
    
    response.headers.set('X-Content-Type-Options', 'nosniff')
    response.headers.set('X-Frame-Options', 'DENY')
    response.headers.set('X-XSS-Protection', '1; mode=block')
    
    return response
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
