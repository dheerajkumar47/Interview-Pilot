// Socket event handlers (separated from setup)
import type { Socket } from "socket.io";

export function handleInterviewMessage(socket: Socket, data: { sessionId: string; stage: string; message: string }) {
  // Event routing logic — delegated from socket/index.ts
  console.log(`📨 Message for session ${data.sessionId}, stage ${data.stage}`);
}
