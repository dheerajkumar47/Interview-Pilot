import { Socket } from "socket.io";
import { InterviewState } from "../../agents/state";
export declare const handleHRStage: (socket: Socket, data: {
    sessionId: string;
    message: string;
}, sessionData: InterviewState) => Promise<void>;
//# sourceMappingURL=hr.handler.d.ts.map