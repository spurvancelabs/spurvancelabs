import { NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase/admin'
import { generateAccessToken, generateRefreshToken } from '@/lib/auth'

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { access_token, refresh_token } = body

    if (!access_token) {
      return NextResponse.json(
        { error: 'Access token required' },
        { status: 400 }
      )
    }

    const { data, error } = await supabaseAdmin().auth.getUser(access_token)

    if (error || !data.user) {
      return NextResponse.json(
        { error: 'Invalid token' },
        { status: 401 }
      )
    }

    const user = data.user

    const accessToken = await generateAccessToken({
      userId: user.id,
      email: user.email!,
    })

    const refreshToken = await generateRefreshToken({
      userId: user.id,
      email: user.email!,
    })

    const response = NextResponse.json(
      {
        message: 'Session created',
        user: {
          id: user.id,
          email: user.email,
        },
      },
      { status: 200 }
    )

    response.cookies.set('token', accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 15 * 60,
      path: '/',
    })

    response.cookies.set('refreshToken', refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60,
      path: '/',
    })

    return response
  } catch (error) {
    console.error('Session creation error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
