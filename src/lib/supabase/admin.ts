import { createClient } from "@supabase/supabase-js";

// ⚠️ WARNING: This client has FULL ACCESS to everything.
// Never use this in Client Components. Only Server Actions.
export function createAdminClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!, // You need to add this to .env.local
    {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    },
  );
}
