import { Router } from "express";

const router = Router();

// Auth routes (placeholder — Supabase handles auth)
router.post("/login", (req, res) => {
  const { email, password } = req.body;
  // TODO: Supabase auth
  res.json({ success: true, user: { id: "demo", email }, token: "demo_token" });
});

router.post("/signup", (req, res) => {
  const { name, email, password } = req.body;
  res.json({ success: true, user: { id: `user_${Date.now()}`, name, email }, token: "demo_token" });
});

router.post("/logout", (req, res) => {
  res.json({ success: true });
});

export default router;
