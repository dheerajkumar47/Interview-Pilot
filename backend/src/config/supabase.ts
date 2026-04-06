import { createClient } from "@supabase/supabase-js";
import dotenv from "dotenv";

// Load environment variables IMMEDIATELY to prevent hoisting issues
dotenv.config();

const SUPABASE_URL = process.env.SUPABASE_URL || "https://xyz.supabase.co";
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_KEY || process.env.SUPABASE_SERVICE_ROLE_KEY || "placeholder";

// Create client decisively; if env vars are missing, this will help trace the issue
export const supabaseAdmin = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY);
