import { createClient, type SupabaseClient } from '@supabase/supabase-js'

const projectUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const projectAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

if (!projectUrl || !projectAnonKey) {
  throw new Error('Missing Supabase environment variables')
}

// Singleton instances
let serverClient: SupabaseClient | null = null
let adminClient: SupabaseClient | null = null

// For server-side operations
export function getSupabaseServerClient(): SupabaseClient {
  if (!serverClient) {
    serverClient = createClient(projectUrl, projectAnonKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },  
    })
  }
  return serverClient
}

export function getSupabaseAdminClient(): SupabaseClient {
  if (!adminClient) {
    const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY!
    if (!serviceRoleKey) {
      throw new Error('Missing Supabase service role key')
    }
    adminClient = createClient(projectUrl, serviceRoleKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    })
  }
  return adminClient
}