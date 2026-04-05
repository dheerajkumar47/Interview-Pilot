// Session service — manage interview sessions
import { createInitialState, InterviewState } from "../agents/state";
import { supabaseAdmin } from "../config/supabase";
import { randomUUID } from "crypto";

const memorySessions: Map<string, InterviewState> = new Map();

export async function createSession(data: Partial<InterviewState>): Promise<InterviewState> {
  const id = data.sessionId || randomUUID();
  const state = createInitialState({ sessionId: id, ...data });

  if (supabaseAdmin && data.userId) {
    try {
      await supabaseAdmin.from('profiles').upsert(
        { id: data.userId, full_name: 'User' },
        { onConflict: 'id' }
      );
    } catch (e: any) { console.error('⚠️ Profile upsert:', e.message); }
  }

  if (supabaseAdmin) {
    try {
      await supabaseAdmin.from('sessions').insert({
        id,
        user_id: data.userId || null,
        job_title: data.jobTitle || 'Unspecified Role',
        company_name: data.company || '',
        job_description: data.jobDescription || '',
        experience_required: data.experience || '',
        role_type: data.roleType || 'developer',
        resume_text: data.resumeText || '',
        resume_analysis: data.resumeAnalysis || null,
        status: 'created',
        overall_score: 0,
        match_score: 0,
        session_mode: state.sessionMode || 'full',
      });
    } catch (e: any) { console.error('⚠️ Supabase insert error:', e.message); }
  }

  memorySessions.set(id, state);
  return state;
}

export async function getSession(id: string): Promise<InterviewState | undefined> {
  if (memorySessions.has(id)) return memorySessions.get(id);

  if (supabaseAdmin) {
    const { data } = await supabaseAdmin.from('sessions').select('*').eq('id', id).single();
    if (data) {
      const state = createInitialState({
        sessionId: data.id,
        userId: data.user_id,
        jobTitle: data.job_title,
        jobDescription: data.job_description,
        company: data.company_name,
        experience: data.experience_required,
        roleType: data.role_type,
        currentStage: data.status === 'created' ? 'resume' : (data.status as any),
        sessionMode: (data.session_mode as any) || 'full',
        resumeText: data.resume_text,
        resumeAnalysis: data.resume_analysis,
        scores: data.scores || { resume: 0, initial: 0, technical: 0, knowledge: 0, hr: 0, overall: data.overall_score || 0 },
      });
      memorySessions.set(data.id, state);
      return state;
    }
  }
  return undefined;
}

export async function updateSession(id: string, updates: Partial<InterviewState>): Promise<InterviewState | undefined> {
  const session = memorySessions.get(id);
  if (!session) return undefined;

  const updated = { ...session, ...updates };
  memorySessions.set(id, updated);

  if (supabaseAdmin) {
    try {
      const overallScore = updated.scores?.overall || 0;
      const matchScore = updated.scores?.resume || 0;
      await supabaseAdmin.from('sessions').update({
        status: updated.currentStage,
        overall_score: overallScore,
        match_score: matchScore,
        scores: updated.scores,
        updated_at: new Date().toISOString(),
      }).eq('id', id);
    } catch (e: any) { console.error('⚠️ Supabase update error:', e.message); }
  }
  return updated;
}

export async function deleteSession(id: string): Promise<void> {
  memorySessions.delete(id);
  if (supabaseAdmin) {
    try {
      await supabaseAdmin.from('sessions').delete().eq('id', id);
    } catch (e: any) { console.error('⚠️ Supabase delete error:', e.message); }
  }
}

export function listSessions(): InterviewState[] {
  return Array.from(memorySessions.values());
}
