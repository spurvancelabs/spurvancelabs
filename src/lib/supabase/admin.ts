const projectUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY!

if (!projectUrl || !serviceRoleKey) {
  throw new Error('Missing Supabase service role environment variables')
}

import { createClient } from '@supabase/supabase-js'

export const supabaseAdmin = () => {
  return createClient(projectUrl, serviceRoleKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  })
}

