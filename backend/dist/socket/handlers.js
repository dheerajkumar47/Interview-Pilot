"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.handleInterviewMessage = handleInterviewMessage;
function handleInterviewMessage(socket, data) {
    // Event routing logic — delegated from socket/index.ts
    console.log(`📨 Message for session ${data.sessionId}, stage ${data.stage}`);
}
//# sourceMappingURL=handlers.js.map