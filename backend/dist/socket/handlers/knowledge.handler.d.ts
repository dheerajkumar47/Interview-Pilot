import { Socket } from "socket.io";
import { InterviewState } from "../../agents/state";
export declare const handleKnowledgeStage: (socket: Socket, data: {
    sessionId: string;
    message: string;
    stage: string;
}, sessionData: InterviewState) => Promise<void>;
//# sourceMappingURL=knowledge.handler.d.ts.map