import { NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase/admin'
import { rateLimiter } from '@/lib/rate-limit'
import { NotificationTrigger } from '@/lib/notification/trigger'

export async function GET(request: Request) {
  try {
    const ip =
      request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ||
      request.headers.get('x-real-ip') ||
      request.headers.get('cf-connecting-ip') ||
      'unknown'

    if (rateLimiter.isBlocked(ip)) {
      return NextResponse.redirect(new URL('/login?error=rate_limited', request.url))
    }

    const searchParams = new URL(request.url).searchParams
    const token = searchParams.get('token')

    if (!token) {
      return NextResponse.redirect(new URL('/login?error=invalid_token', request.url))
    }

    const { data } = await supabaseAdmin().auth.admin.listUsers({ page: 1, perPage: 1000 })

    const user = data?.users?.find((u) => {
      const meta = (u as any).user_metadata || {}
      return meta.emailVerifyToken === token && !(u as any).email_confirmed_at
    })

    if (!user) {
      rateLimiter.increment(ip)
      return NextResponse.redirect(new URL('/login?error=invalid_or_verified', request.url))
    }

    rateLimiter.reset(ip)

    await supabaseAdmin().auth.admin.updateUserById(user.id, {
      email_confirm: true,
      user_metadata: {
        ...user.user_metadata,
        emailVerifyToken: null,
      }
    })

    await supabaseAdmin()
      .from('audit_logs')
      .insert({
        user_id: user.id,
        action: 'EMAIL_VERIFIED',
        ip: request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || 
            request.headers.get('x-real-ip') || 'unknown',
        user_agent: request.headers.get('user-agent'),
      })

    // Create email verified notification
    try {
      await NotificationTrigger.triggerNotification({
        user_id: user.id,
        type: 'success',
        title: 'Email Verified',
        message: 'Your email has been successfully verified!',
      });
    } catch (notificationError) {
      console.error('Failed to create notification:', notificationError);
    }

    return NextResponse.redirect(new URL('/login?message=email_verified', request.url))
  } catch (error) {
    console.error('Email verification error:', error)
    return NextResponse.redirect(new URL('/login?error=server_error', request.url))
  }
}
