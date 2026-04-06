"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createInitialState = createInitialState;
function createInitialState(overrides = {}) {
    return {
        sessionId: "",
        userId: "",
        jobDescription: "",
        jobTitle: "",
        company: "",
        experience: "",
        skills: [],
        roleType: "developer",
        candidateLevel: "beginner",
        resumeText: "",
        parsedResume: null,
        resumeAnalysis: null,
        shortlistStatus: null,
        currentStage: "resume",
        sessionMode: "full",
        conversationHistory: {},
        scores: { resume: 0, initial: 0, technical: 0, knowledge: 0, hr: 0, overall: 0 },
        questionCount: {},
        language: "en",
        report: null,
        startedAt: new Date().toISOString(),
        completedAt: null,
        ...overrides,
    };
}
//# sourceMappingURL=state.js.map