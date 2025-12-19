import { createServerClient } from "@supabase/ssr"
import { cookies } from "next/headers"

import { createClient as createSupabaseClient } from "@supabase/supabase-js"

/**
 * Create a Supabase client for server-side operations
 * IMPORTANT: Always create a new client - do not store in global variable
 */
export async function createClient() {
  const cookieStore = await cookies()

  return createServerClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!, {
    cookies: {
      getAll() {
        return cookieStore.getAll()
      },
      setAll(cookiesToSet) {
        try {
          cookiesToSet.forEach(({ name, value, options }) => cookieStore.set(name, value, options))
        } catch {
          // This can be ignored if you have middleware refreshing user sessions.
        }
      },
    },
  })
}

// This is only used for database migrations and admin operations, not for user sessions
export const supabaseServer = createSupabaseClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  },
)
