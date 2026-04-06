import express from "express";
import cors from "cors";
import http from "http";
import { Server as SocketServer } from "socket.io";
import dotenv from "dotenv";

// Load ENV first before ANY internal modules
dotenv.config();

import { setupSocketHandlers } from "./socket";
import sessionRoutes from "./routes/session.routes";
import resumeRoutes from "./routes/resume.routes";
import interviewRoutes from "./routes/interview.routes";

const app = express();
const server = http.createServer(app);
const io = new SocketServer(server, {
  cors: {
    origin: (origin, callback) => {
      if (!origin || 
          origin.includes("localhost") || 
          origin.includes("vercel.app") || 
          origin === process.env.FRONTEND_URL) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    methods: ["GET", "POST"],
    credentials: true
  },
});

// Middleware
const allowedOrigins = [process.env.FRONTEND_URL, "http://localhost:3000"].filter(Boolean) as string[];

app.use(cors({ 
  origin: (origin, callback) => {
    // 🌍 Allow localhost, Vercel deployments, and the configured production URL
    if (!origin || 
        origin.includes("localhost") || 
        origin.includes("vercel.app") || 
        origin === process.env.FRONTEND_URL) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  credentials: true
}));
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true }));

// Health check
app.get("/api/health", (req, res) => {
  res.json({ status: "ok", timestamp: new Date().toISOString(), agents: 4, subAgents: 8 });
});

// Routes
app.use("/api/sessions", sessionRoutes);
app.use("/api/resume", resumeRoutes);
app.use("/api/interview", interviewRoutes);

// Socket.io
setupSocketHandlers(io);

// Error handler
app.use((err: Error, req: express.Request, res: express.Response, next: express.NextFunction) => {
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

export { io };
