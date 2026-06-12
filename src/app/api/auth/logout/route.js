// src/app/api/auth/logout/route.js
import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { prisma } from '@/lib/prisma'
import { verifyToken, getJwtSecret } from '@/lib/auth'
import { notificationService } from '@/lib/notification-service'

export async function POST(request) {
  try {
    const ip = request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || 
               request.headers.get('x-real-ip') || 'unknown'

    const cookieStore = await cookies()
    const token = cookieStore.get("token")?.value
    
    if (token) {
      try {
        const decoded = verifyToken(token)
        if (decoded?.userId) {
          await prisma.user.update({
            where: { id: decoded.userId },
            data: { refreshToken: null }
          })
          
          await prisma.auditLog.create({
            data: {
              userId: decoded.userId,
              action: 'LOGOUT',
              ip,
              userAgent: request.headers.get('user-agent')
            }
          })

          notificationService.notifyUserAction(decoded.userId, 'LOGOUT', { ip }).catch(console.error)
        }
      } catch {}
    }
    
    cookieStore.delete("token")
    cookieStore.delete("refreshToken")
    
    const response = NextResponse.json({ message: 'Logged out successfully' })
    response.headers.set('X-Content-Type-Options', 'nosniff')
    response.headers.set('X-Frame-Options', 'DENY')
    response.headers.set('X-XSS-Protection', '1; mode=block')
    
    return response
  } catch (error) {
    const cookieStore = await cookies()
    cookieStore.delete("token")
    cookieStore.delete("refreshToken")
    return NextResponse.json({ message: 'Logged out successfully' })
  }
}