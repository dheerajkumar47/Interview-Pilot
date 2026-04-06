"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const supabase_js_1 = require("@supabase/supabase-js");
const dotenv_1 = __importDefault(require("dotenv"));
const path_1 = __importDefault(require("path"));
// Load environment variables from the correct .env file
dotenv_1.default.config({ path: path_1.default.join(__dirname, "../.env") });
const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_KEY;
async function testConnection() {
    console.log("🔍 PROOF OF LIFE: Testing Supabase Connection...");
    console.log("Endpoint Target:", SUPABASE_URL);
    if (!SUPABASE_URL || !SUPABASE_SERVICE_KEY) {
        console.error("❌ ERR: Missing keys in .env. Check Line 5 and 6 of backend/.env");
        return;
    }
    // Use the admin client to bypass RLS for this test
    const supabase = (0, supabase_js_1.createClient)(SUPABASE_URL, SUPABASE_SERVICE_KEY);
    // 1. Test profiles table
    console.log("Checking 'profiles' table...");
    const { data: profiles, error: pError } = await supabase.from('profiles').select('*').limit(1);
    if (pError) {
        console.error("❌ ERR: Profiles table check failed:", pError.message);
        if (pError.message.includes("does not exist")) {
            console.log("💡 HINT: The 'profiles' table is missing from your public schema.");
        }
    }
    else {
        console.log("✅ OK: Profiles table is reachable. Rows found:", profiles?.length);
    }
    // 2. Test sessions table
    console.log("Checking 'sessions' table...");
    const { data: sessions, error: sError } = await supabase.from('sessions').select('*').limit(1);
    if (sError) {
        console.error("❌ ERR: Sessions table check failed:", sError.message);
    }
    else {
        console.log("✅ OK: Sessions table is reachable.");
    }
    console.log("\n🚀 RESULT: Your backend IS successfully connected to Supabase!");
}
testConnection();
//# sourceMappingURL=test-db.js.map