import { supabaseAdmin } from "./config/supabase";

async function cleanupSessions() {
  console.log("🧹 [CLEANUP] Starting junk session removal...");

  try {
    // 1. Delete sessions with 0 match_score (These are the "hi"/"test" scans)
    const { data: deletedMatch, error: errorMatch } = await supabaseAdmin
      .from('sessions')
      .delete()
      .eq('match_score', 0)
      .eq('status', 'created');

    if (errorMatch) throw errorMatch;

    // 2. Delete Practice Simulation sessions that NEVER STARTED (empty history)
    const { data, error: fetchError } = await supabaseAdmin
      .from('sessions')
      .select('id, conversation_history')
      .eq('job_title', 'Unspecified Role');

    if (fetchError) throw fetchError;

    const idsToDelete = data
      ?.filter(s => Object.keys(s.conversation_history || {}).length === 0)
      .map(s => s.id);

    if (idsToDelete && idsToDelete.length > 0) {
      const { error: delError } = await supabaseAdmin
        .from('sessions')
        .delete()
        .in('id', idsToDelete);
      
      if (delError) throw delError;
      console.log(`✅ [CLEANUP] Deleted ${idsToDelete.length} empty practice sessions.`);
    }

    console.log("✅ [CLEANUP] Junk removal complete.");
  } catch (err: any) {
    console.error("❌ [CLEANUP] Error:", err.message);
  }
}

cleanupSessions();
