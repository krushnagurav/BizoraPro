// src/lib/supabase/client.ts
/**
 * Supabase Client Initialization.
 *
 * This file initializes and exports a Supabase client instance for client-side interactions.
 */
import { createBrowserClient } from "@supabase/ssr";

export function createClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  );
}
