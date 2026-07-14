import { NextResponse } from 'next/server'
import { z, ZodError } from 'zod'
import { supabaseAdmin } from '@/lib/supabase/admin'
import { rateLimiter } from '@/lib/rate-limit'
import { NotificationTrigger } from '@/lib/notification/trigger'

const resetPasswordSchema = z.object({
  token: z.string().min(1),
  password: z.string()
    .min(8, "Password must be at least 8 characters")
    .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
    .regex(/[0-9]/, "Password must contain at least one number")
    .regex(/[^A-Za-z0-9]/, "Password must contain at least one symbol"),
})

type ResetPasswordBody = z.infer<typeof resetPasswordSchema>

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

    const body = (await request.json()) as ResetPasswordBody
    const { token, password } = resetPasswordSchema.parse(body)

    const { data } = await supabaseAdmin().auth.admin.listUsers({ page: 1, perPage: 1000 })

    const user = data?.users?.find((u) => {
      const meta = (u as any).user_metadata || {}
      return meta.resetToken === token
    })

    if (!user) {
      rateLimiter.increment(ip)
      return NextResponse.json(
        { error: 'Invalid or expired reset token' },
        { status: 400 }
      )
    }

    const expiresAt = (user.user_metadata || {}).resetTokenExpiry
    if (expiresAt && new Date(expiresAt) < new Date()) {
      rateLimiter.increment(ip)
      return NextResponse.json(
        { error: 'Invalid or expired reset token' },
        { status: 400 }
      )
    }

    rateLimiter.reset(ip)

    await supabaseAdmin().auth.admin.updateUserById(user.id, {
      password,
      user_metadata: {
        ...user.user_metadata,
        resetToken: null,
        resetTokenExpiry: null,
      }
    })

    await supabaseAdmin()
      .from('audit_logs')
      .insert({
        user_id: user.id,
        action: 'PASSWORD_RESET',
        ip,
        user_agent: request.headers.get('user-agent'),
      })

    // Create password reset notification
    try {
      await NotificationTrigger.triggerNotification({
        user_id: user.id,
        type: 'success',
        title: 'Password Reset Successful',
        message: 'Your password has been changed successfully.',
      });
    } catch (notificationError) {
      console.error('Failed to create notification:', notificationError);
    }

    const response = NextResponse.json(
      { message: 'Password reset successful' },
      { status: 200 }
    )
    
    return response
  } catch (error) {
    if (error instanceof ZodError) {
      return NextResponse.json(
        { error: 'Validation failed', issues: error.flatten().fieldErrors },
        { status: 400 }
      )
    }
    console.error('Reset password error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
