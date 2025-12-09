// src/lib/supabase/admin.ts
/**
 * Supabase Admin Client Initialization.
 *
 * This file initializes and exports a Supabase client instance with
 * service role key for administrative tasks.
 */
import { createClient } from "@supabase/supabase-js";

export function createAdminClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    },
  );
}
