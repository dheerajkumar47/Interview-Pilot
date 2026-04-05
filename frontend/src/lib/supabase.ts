import { createClient } from "@supabase/supabase-js";

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || "https://fzkodbxnhhsfwtgkgsng.supabase.co";
const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";

console.log("📡 Initializing Supabase Frontend Client:", SUPABASE_URL);

// Create client with better resilience settings
export const supabase = SUPABASE_URL ? createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true
  },
  global: {
    headers: { 'x-application-name': 'interview-pilot' }
  }
}) : null;

if (!supabase) {
    console.error("❌ SUPABASE CLIENT FAILED TO INITIALIZE: Check your .env.local file!");
}

export { SUPABASE_URL, SUPABASE_ANON_KEY };
