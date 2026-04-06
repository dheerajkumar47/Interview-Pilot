import { Socket } from "socket.io";
import { InterviewState } from "../../agents/state";
export declare const handleTechnicalStage: (socket: Socket, data: {
    sessionId: string;
    message: string;
}, sessionData: InterviewState) => Promise<void>;
//# sourceMappingURL=technical.handler.d.ts.map