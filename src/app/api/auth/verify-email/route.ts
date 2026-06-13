import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { notificationService } from '@/lib/notification-service'

export async function GET(request: Request) {
  try {
    const searchParams = new URL(request.url).searchParams
    const token = searchParams.get('token')

    if (!token) {
      return NextResponse.redirect(new URL('/login?error=invalid_token', request.url))
    }

    const user = await prisma.user.findFirst({
      where: {
        emailVerifyToken: token,
        emailVerified: false
      }
    })

    if (!user) {
      return NextResponse.redirect(new URL('/login?error=invalid_or_verified', request.url))
    }

    await prisma.user.update({
      where: { id: user.id },
      data: {
        emailVerified: true,
        emailVerifyToken: null
      }
    })

    await prisma.auditLog.create({
      data: {
        userId: user.id,
        action: 'EMAIL_VERIFIED',
        ip: request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || 
            request.headers.get('x-real-ip') || 'unknown',
        userAgent: request.headers.get('user-agent')
      }
    })

    notificationService.notifyUserAction(user.id, 'EMAIL_VERIFIED').catch(console.error)

    return NextResponse.redirect(new URL('/login?message=email_verified', request.url))
  } catch (error) {
    console.error('Email verification error:', error)
    return NextResponse.redirect(new URL('/login?error=server_error', request.url))
  }
}
