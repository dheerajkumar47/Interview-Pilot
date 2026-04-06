"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.io = void 0;
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const http_1 = __importDefault(require("http"));
const socket_io_1 = require("socket.io");
const dotenv_1 = __importDefault(require("dotenv"));
// Load ENV first before ANY internal modules
dotenv_1.default.config();
const socket_1 = require("./socket");
const session_routes_1 = __importDefault(require("./routes/session.routes"));
const resume_routes_1 = __importDefault(require("./routes/resume.routes"));
const interview_routes_1 = __importDefault(require("./routes/interview.routes"));
const app = (0, express_1.default)();
const server = http_1.default.createServer(app);
const io = new socket_io_1.Server(server, {
    cors: {
        origin: (origin, callback) => {
            if (!origin ||
                origin.includes("localhost") ||
                origin.includes("vercel.app") ||
                origin === process.env.FRONTEND_URL) {
                callback(null, true);
            }
            else {
                callback(new Error("Not allowed by CORS"));
            }
        },
        methods: ["GET", "POST"],
        credentials: true
    },
});
exports.io = io;
// Middleware
const allowedOrigins = [process.env.FRONTEND_URL, "http://localhost:3000"].filter(Boolean);
app.use((0, cors_1.default)({
    origin: (origin, callback) => {
        // 🌍 Allow localhost, Vercel deployments, and the configured production URL
        const cleanFrontendUrl = process.env.FRONTEND_URL?.replace(/\/$/, "");
        if (!origin ||
            origin.includes("localhost") ||
            origin.includes("vercel.app") ||
            origin === cleanFrontendUrl) {
            callback(null, true);
        }
        else {
            callback(new Error("Not allowed by CORS"));
        }
    },
    credentials: true
}));
app.use(express_1.default.json({ limit: "10mb" }));
app.use(express_1.default.urlencoded({ extended: true }));
// Health check
app.get("/api/health", (req, res) => {
    res.json({ status: "ok", timestamp: new Date().toISOString(), agents: 4, subAgents: 8 });
});
// Routes
app.use("/api/sessions", session_routes_1.default);
app.use("/api/resume", resume_routes_1.default);
app.use("/api/interview", interview_routes_1.default);
// Socket.io
(0, socket_1.setupSocketHandlers)(io);
// Error handler
app.use((err, req, res, next) => {
    console.error("Error:", err.message);
    res.status(500).json({ error: "Internal server error", message: err.message });
});
// Start server
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
    console.log(`
╔══════════════════════════════════════════╗
║   🚀 InterviewPilot Backend Server      ║
║   Running on port ${PORT}                   ║
║                                          ║
║   🔍 Agent 1: Resume Analyst       ✓    ║
║   💻 Agent 2: Technical Interviewer ✓    ║
║   📚 Agent 3: Knowledge Assessor   ✓    ║
║   🤝 Agent 4: HR Coach             ✓    ║
║                                          ║
║   8 Sub-Agents: Active                   ║
╚══════════════════════════════════════════╝
  `);
});
//# sourceMappingURL=index.js.map