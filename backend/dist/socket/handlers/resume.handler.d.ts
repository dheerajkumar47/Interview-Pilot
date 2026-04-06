import { Socket } from "socket.io";
import { InterviewState } from "../../agents/state";
export declare const handleResumeStage: (socket: Socket, data: {
    sessionId: string;
    message: string;
}, sessionData: InterviewState) => Promise<void>;
/**
 * Trigger proactive greeting for resume stage
 */
export declare const triggerResumeGreeting: (socket: Socket, sessionId: string, sessionData: InterviewState) => Promise<void>;
//# sourceMappingURL=resume.handler.d.ts.map