"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const session_service_1 = require("../services/session.service");
const router = (0, express_1.Router)();
// Create new session
router.post("/", async (req, res) => {
    try {
        const session = await (0, session_service_1.createSession)(req.body);
        res.json({ success: true, session });
    }
    catch (err) {
        res.status(500).json({ error: err.message });
    }
});
// Get all sessions
router.get("/", (req, res) => {
    const sessions = (0, session_service_1.listSessions)();
    res.json({ sessions });
});
// Get session by ID
router.get("/:id", async (req, res) => {
    const session = await (0, session_service_1.getSession)(req.params.id);
    if (!session)
        return res.status(404).json({ error: "Session not found" });
    res.json({ session });
});
// Update session
router.put("/:id", async (req, res) => {
    const session = await (0, session_service_1.updateSession)(req.params.id, req.body);
    if (!session)
        return res.status(404).json({ error: "Session not found" });
    res.json({ success: true, session });
});
// Delete session
router.delete("/:id", async (req, res) => {
    try {
        const { deleteSession } = require("../services/session.service");
        await deleteSession(req.params.id);
        res.json({ success: true, message: "Session deleted successfully" });
    }
    catch (err) {
        res.status(500).json({ error: err.message });
    }
});
exports.default = router;
//# sourceMappingURL=session.routes.js.map