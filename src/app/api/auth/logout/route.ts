import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { supabaseAdmin } from '@/lib/supabase/admin'
import { verifyToken } from '@/lib/auth'
import { NotificationTrigger } from '@/lib/notification/trigger'

export async function POST(request: Request) {
  try {
    const ip = (request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || 
               request.headers.get('x-real-ip') || 'unknown') as string

    const cookieStore = await cookies()
    const token = cookieStore.get("token")?.value
    
    if (token) {
      try {
        const decoded = verifyToken(token)
        if (decoded?.userId) {
          await supabaseAdmin().auth.admin.updateUserById(decoded.userId, {
            user_metadata: {
              refreshToken: null,
            }
          })
          
          await supabaseAdmin()
            .from('audit_logs')
            .insert({
              user_id: decoded.userId,
              action: 'LOGOUT',
              ip,
              user_agent: request.headers.get('user-agent'),
            })

          // Create logout notification (best effort)
          try {
            await NotificationTrigger.triggerNotification({
              user_id: decoded.userId,
              type: 'info',
              title: 'Logged Out',
              message: 'You have been logged out successfully.',
            });
          } catch (notificationError) {
            console.error('Failed to create notification:', notificationError);
          }
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
