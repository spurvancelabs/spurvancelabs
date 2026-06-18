const projectUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const projectAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

if (!projectUrl || !projectAnonKey) {
  throw new Error('Missing Supabase environment variables')
}

interface User {
  id: string
  email?: string
}

export const createClient = (user: User | null = null) => {
  if (typeof window === 'undefined') {
    return user ? { id: user.id } : null
  }
  const { createMiddlewareClient } = require('@supabase/ssr')
  return createMiddlewareClient({ projectUrl, projectAnonKey })
}