import { NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase/admin'

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

    const { data: existingUser } = await supabaseAdmin()
      .from('users')
      .select('*')
      .eq('email', googleUser.email)
      .single()

    if (!existingUser) {
      const { data: newUser } = await supabaseAdmin()
        .from('users')
        .insert({
          email: googleUser.email,
          name: googleUser.name,
          image: googleUser.picture,
          provider: 'google',
          provider_id: googleUser.sub,
          email_verified: true,
        })
        .select()
        .single()

      if (!newUser) {
        return NextResponse.redirect('/login?error=signup_failed')
      }
    }

    return NextResponse.redirect(`${process.env.NEXT_PUBLIC_APP_URL}/dashboard`)
  } catch (error) {
    console.error('Google callback error:', error)
    return NextResponse.redirect('/login?error=server_error')
  }
}
