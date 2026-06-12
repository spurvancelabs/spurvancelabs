// src/app/api/auth/forgot-password/route.js
import { NextResponse } from 'next/server'
import { z, ZodError } from 'zod'
import crypto from 'crypto'
import { Resend } from 'resend'
import { prisma } from '@/lib/prisma'

const forgotPasswordSchema = z.object({
  email: z.string().email(),
})

const resend = new Resend(process.env.RESEND_API_KEY)

export async function POST(request) {
  try {
    const body = await request.json()
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

    const token = crypto.randomBytes(32).toString('hex')
    const expiry = new Date(Date.now() + 60 * 60 * 1000)

    await prisma.user.update({
      where: { id: user.id },
      data: {
        resetToken: token,
        resetTokenExpiry: expiry,
      }
    })

    const resetUrl = `${request.nextUrl.origin}/reset-password?token=${token}`

    await resend.emails.send({
      from: 'onboarding@resend.dev',
      to: email,
      subject: 'Reset your password',
      html: `<p>Click <a href="${resetUrl}">here</a> to reset your password. This link expires in 1 hour.</p>`,
    })

    return NextResponse.json(
      { message: 'If an account exists with that email, you will receive reset instructions.' },
      { status: 200 }
    )
  } catch (error) {
    if (error instanceof z.ZodError) {
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
