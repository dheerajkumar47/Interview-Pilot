"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createSession = createSession;
exports.getSession = getSession;
exports.updateSession = updateSession;
exports.deleteSession = deleteSession;
exports.listSessions = listSessions;
// Session service — manage interview sessions
const state_1 = require("../agents/state");
const supabase_1 = require("../config/supabase");
const crypto_1 = require("crypto");
const memorySessions = new Map();
async function createSession(data) {
    const id = data.sessionId || (0, crypto_1.randomUUID)();
    const state = (0, state_1.createInitialState)({ sessionId: id, ...data });
    // 🛡️ [EPHEMERAL POD] Skip DB insert for Practice/Resume-Only modes
    const isEphemeral = state.sessionMode === 'technical_only' || state.sessionMode === 'resume_only';
    if (supabase_1.supabaseAdmin && !isEphemeral) {
        if (data.userId) {
            try {
                await supabase_1.supabaseAdmin.from('profiles').upsert({ id: data.userId, full_name: 'User' }, { onConflict: 'id' });
            }
            catch (e) {
                console.error('⚠️ Profile upsert:', e.message);
            }
        }
        try {
            const { error } = await supabase_1.supabaseAdmin.from('sessions').insert({
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
                conversation_history: state.conversationHistory || {},
            });
            if (error) {
                console.error('⚠️ Supabase insert error:', error.message);
            }
        }
        catch (dbError) {
            console.error('❌ Database failure in createSession:', dbError.message);
        }
    }
    else if (isEphemeral) {
        console.log(`🛡️ [SESSION SERVICE] Ephemeral Mode Enabled (${state.sessionMode}). Skipping DB persistence.`);
    }
    memorySessions.set(id, state);
    return state;
}
async function getSession(id) {
    if (memorySessions.has(id))
        return memorySessions.get(id);
    // 🛡️ [GUARD] Avoid "invalid input syntax for type uuid" for temporary/practice sessions
    const isUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(id);
    if (!isUuid)
        return undefined;
    if (supabase_1.supabaseAdmin) {
        const { data } = await supabase_1.supabaseAdmin.from('sessions').select('*').eq('id', id).single();
        if (data) {
            const state = (0, state_1.createInitialState)({
                sessionId: data.id,
                userId: data.user_id,
                jobTitle: data.job_title,
                jobDescription: data.job_description,
                company: data.company_name,
                experience: data.experience_required,
                roleType: data.role_type,
                currentStage: data.status === 'created' ? 'resume' : data.status,
                sessionMode: data.session_mode || 'full',
                resumeText: data.resume_text,
                resumeAnalysis: data.resume_analysis,
                conversationHistory: data.conversation_history || {},
                scores: data.scores || { resume: 0, initial: 0, technical: 0, knowledge: 0, hr: 0, overall: data.overall_score || 0 },
            });
            memorySessions.set(data.id, state);
            return state;
        }
    }
    return undefined;
}
async function updateSession(id, updates) {
    const session = memorySessions.get(id);
    if (!session)
        return undefined;
    const updated = { ...session, ...updates };
    memorySessions.set(id, updated);
    const isEphemeral = session.sessionMode === 'technical_only' || session.sessionMode === 'resume_only';
    if (supabase_1.supabaseAdmin && !isEphemeral) {
        // 🧮 Merge scores to prevent zero-overwrites (Sticky Scores)
        const existingScores = session.scores || {};
        const updatedScores = { ...existingScores, ...(updates.scores || {}) };
        // Ensure we don't overwrite a positive score with 0 unless explicitly intended
        Object.keys(existingScores).forEach(key => {
            const oldScore = existingScores[key];
            const newScore = updatedScores[key];
            if (oldScore > 0 && (!newScore || newScore === 0)) {
                updatedScores[key] = oldScore;
            }
        });
        const s = updatedScores;
        const resumeScore = s.resume || 0;
        const initialScore = s.initial || 0;
        const technicalScore = s.technical || 0;
        const knowledgeScore = s.knowledge || 0;
        const hrScore = s.hr || 0;
        const weightedOverall = Math.round((resumeScore * 0.20) +
            (initialScore * 0.20) +
            (technicalScore * 0.40) +
            (knowledgeScore * 0.10) +
            (hrScore * 0.10));
        const { error } = await supabase_1.supabaseAdmin.from('sessions').update({
            status: updated.currentStage,
            overall_score: weightedOverall,
            match_score: resumeScore,
            scores: updatedScores,
            conversation_history: updated.conversationHistory,
            updated_at: new Date().toISOString(),
        }).eq('id', id);
        if (error) {
            console.error('⚠️ Supabase update error:', error.message);
            throw error;
        }
        // Update the memory session with the calculated score and merged scores
        updated.scores = updatedScores;
        updated.scores.overall = weightedOverall;
    }
    return updated;
}
async function deleteSession(id) {
    memorySessions.delete(id);
    if (supabase_1.supabaseAdmin) {
        try {
            await supabase_1.supabaseAdmin.from('sessions').delete().eq('id', id);
        }
        catch (e) {
            console.error('⚠️ Supabase delete error:', e.message);
        }
    }
}
function listSessions() {
    return Array.from(memorySessions.values());
}
//# sourceMappingURL=session.service.js.map