import { createClient } from "@supabase/supabase-js";
import dotenv from "dotenv";
dotenv.config();

const supabaseAdmin = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_KEY!
);

async function wipeDatabase() {
  console.log("🔥 Starting full database wipe...");
  
  // Truncate public tables to ensure raw data is cleared
  const tables = ['reports', 'conversations', 'resumes', 'sessions', 'profiles'];
  for (const table of tables) {
    console.log(`Clearing ${table}...`);
    // Getting all IDs and deleting since there's no native truncate in JS client without RPC
    const { data } = await supabaseAdmin.from(table).select('id');
    if (data && data.length > 0) {
      const ids = data.map((x: any) => x.id);
      await supabaseAdmin.from(table).delete().in('id', ids);
    }
  }

  // Delete all users from Auth (this cascades to profiles but we did it manually above just in case)
  console.log("Clearing Auth Users...");
  const { data: { users }, error: listError } = await supabaseAdmin.auth.admin.listUsers();
  if (!listError && users) {
    for (const user of users) {
      await supabaseAdmin.auth.admin.deleteUser(user.id);
    }
  }
  
  console.log("✨ Database wipe complete!");
}

wipeDatabase().catch(console.error);
