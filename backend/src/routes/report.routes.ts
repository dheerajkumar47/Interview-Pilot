import { Router } from "express";
import { generateReport } from "../services/report.service";

const router = Router();

router.post("/:sessionId", (req, res) => {
  const { scores } = req.body;
  const report = generateReport(scores || { resume: 0, technical: 0, knowledge: 0, hr: 0 });
  res.json({ success: true, report });
});

export default router;
