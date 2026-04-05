import { Router } from "express";
import { createSession, getSession, updateSession, listSessions } from "../services/session.service";

const router = Router();

// Create new session
router.post("/", async (req, res) => {
  try {
    const session = await createSession(req.body);
    res.json({ success: true, session });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// Get all sessions
router.get("/", (req, res) => {
  const sessions = listSessions();
  res.json({ sessions });
});

// Get session by ID
router.get("/:id", async (req, res) => {
  const session = await getSession(req.params.id);
  if (!session) return res.status(404).json({ error: "Session not found" });
  res.json({ session });
});

// Update session
router.put("/:id", async (req, res) => {
  const session = await updateSession(req.params.id, req.body);
  if (!session) return res.status(404).json({ error: "Session not found" });
  res.json({ success: true, session });
});

export default router;
