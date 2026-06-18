import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { z, ZodError } from 'zod'
import { supabaseAdmin } from '@/lib/supabase/admin'
import { generateAccessToken, generateRefreshToken } from '@/lib/auth'
import { rateLimiter } from '@/lib/rate-limit'

const signupSchema = z.object({
  email: z.string().email(),
  password: z.string()
    .min(8, "Password must be at least 8 characters")
    .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
    .regex(/[0-9]/, "Password must contain at least one number")
    .regex(/[^A-Za-z0-9]/, "Password must contain at least one symbol"),
  name: z.string().min(1),
})
type SignupBody = z.infer<typeof signupSchema>

export async function POST(request: Request) {
  try {
    const ip = (request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || 
               request.headers.get('x-real-ip') || 
               request.headers.get('cf-connecting-ip') || 
               'unknown') as string
    
    if (rateLimiter.isBlocked(ip)) {
      return NextResponse.json(
        { error: 'Too many signup attempts. Please try again later.' },
        { status: 429 }
      )
    }

    const body = (await request.json()) as SignupBody
    const { email, password, name } = signupSchema.parse(body)

    console.log('Creating user:', { email, name })

    // Create user in Supabase Auth
    const { data: createData, error: createError } = await supabaseAdmin().auth.admin.createUser({
      email,
      password,
      email_confirm: true,
      user_metadata: {
        name,
        role: 'USER',
      }
    })

    if (createError) {
      console.error('Supabase auth error:', createError)
      
      // Check for existing user
      if (createError.message?.toLowerCase().includes('already')) {
        return NextResponse.json(
          { error: 'Email is already registered' },
          { status: 400 }
        )
      }
      
      return NextResponse.json(
        { error: 'Failed to create account. Please try again.' },
        { status: 500 }
      )
    }

    if (!createData?.user) {
      return NextResponse.json(
        { error: 'Failed to create user' },
        { status: 500 }
      )
    }

    const user = createData.user
    console.log('User created successfully:', user.id)

    // Generate tokens
    const accessToken = generateAccessToken({
      userId: user.id,
      email: user.email!,
    })

    const refreshToken = generateRefreshToken({
      userId: user.id,
      email: user.email!,
    })

    // Set cookies
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

    // Return success
    return NextResponse.json(
      { 
        message: 'Signup successful!',
        user: { 
          id: user.id, 
          email: user.email, 
          name: name 
        } 
      },
      { status: 201 }
    )

  } catch (error) {
    if (error instanceof ZodError) {
      return NextResponse.json(
        { error: 'Validation failed', issues: z.flattenError(error).fieldErrors },
        { status: 400 }
      )
    }
    
    console.error('Signup error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}