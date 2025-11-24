import { createClient } from '@supabase/supabase-js'

// These will load from your .env.local file
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

// Create a single instance to reuse (Performance Optimization)
export const supabase = createClient(supabaseUrl, supabaseAnonKey)