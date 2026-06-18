import { createClient, type SupabaseClient } from '@supabase/supabase-js'

const projectUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const projectAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

if (!projectUrl || !projectAnonKey) {
  throw new Error('Missing Supabase environment variables')
}

// Singleton instance
let browserClient: SupabaseClient | null = null;

// Client-side Supabase client (for browser usage)
export function createBrowserClient(): SupabaseClient {
  if (!browserClient) {
    browserClient = createClient(projectUrl, projectAnonKey, {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
        detectSessionInUrl: true,
        storageKey: 'supabase-auth-token' // Single storage key
      },
      db: {
        schema: 'public'
      },
      global: {
        headers: {
          'X-Client-Info': 'my-nextjs-app'
        }
      }
    });
  }
  return browserClient;
}

// Default export for easy importing
export const supabase = createBrowserClient();