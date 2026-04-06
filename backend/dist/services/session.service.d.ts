import { InterviewState } from "../agents/state";
export declare function createSession(data: Partial<InterviewState>): Promise<InterviewState>;
export declare function getSession(id: string): Promise<InterviewState | undefined>;
export declare function updateSession(id: string, updates: Partial<InterviewState>): Promise<InterviewState | undefined>;
export declare function deleteSession(id: string): Promise<void>;
export declare function listSessions(): InterviewState[];
//# sourceMappingURL=session.service.d.ts.map