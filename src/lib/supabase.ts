// src/lib/supabase.ts
/**
 * Supabase Client Initialization.
 *
 * This file initializes and exports a Supabase client instance for client-side interactions.
 */
import { createClient } from "@supabase/supabase-js";
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
export const supabase = createClient(supabaseUrl, supabaseAnonKey);
