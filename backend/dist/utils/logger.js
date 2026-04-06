"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.logger = void 0;
exports.log = log;
// Logger utility
function log(level, message, data) {
    const timestamp = new Date().toISOString();
    const emoji = { info: "ℹ️", warn: "⚠️", error: "❌" };
    console.log(`${emoji[level]} [${timestamp}] ${message}`, data || "");
}
exports.logger = {
    info: (msg, data) => log("info", msg, data),
    warn: (msg, data) => log("warn", msg, data),
    error: (msg, data) => log("error", msg, data),
};
//# sourceMappingURL=logger.js.map