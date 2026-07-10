import { NextResponse } from 'next/server'
import { getSupabaseAdminClient, getSupabaseServerClient } from '@/lib/supabase/server'
import { ROLES } from '@/lib/lms/roles'
import { generateAccessToken, generateRefreshToken } from '@/lib/auth'

export async function GET(request: Request) {
  try {
    const url = new URL(request.url)
    const code = url.searchParams.get('code')

    if (!code) {
      return NextResponse.redirect('/login')
    }

    const tokenRes = await fetch('https://oauth2.googleapis.com/token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        code,
        client_id: process.env.GOOGLE_CLIENT_ID!,
        client_secret: process.env.GOOGLE_CLIENT_SECRET!,
        redirect_uri: `${process.env.NEXT_PUBLIC_APP_URL}/api/auth/google/callback`,
        grant_type: 'authorization_code',
      }),
    })

    const tokenData = await tokenRes.json()

    const userRes = await fetch('https://www.googleapis.com/oauth2/v3/userinfo', {
      headers: {
        Authorization: `Bearer ${tokenData.access_token}`,
      },
    })

    const googleUser = await userRes.json()

    const supabase = getSupabaseAdminClient()

    const { data: existingUser } = await supabase
      .from('users')
      .select('*')
      .eq('email', googleUser.email)
      .single()

    let userId = existingUser?.id

    if (!existingUser) {
      const { data: newUser } = await supabase
        .from('users')
        .insert({
          email: googleUser.email,
          name: googleUser.name,
          image: googleUser.picture,
          provider: 'google',
          provider_id: googleUser.sub,
          email_verified: true,
          type: ROLES.USER,
        })
        .select()
        .single()

      if (!newUser) {
        return NextResponse.redirect('/login?error=signup_failed')
      }
      userId = newUser.id
    }

    const accessToken = await generateAccessToken({
      userId: userId!,
      email: googleUser.email,
    })

    const refreshToken = await generateRefreshToken({
      userId: userId!,
      email: googleUser.email,
    })

    const response = NextResponse.redirect(`${process.env.NEXT_PUBLIC_APP_URL}/dashboard`)

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
    console.error('Google callback error:', error)
    return NextResponse.redirect('/login?error=server_error')
  }
}
