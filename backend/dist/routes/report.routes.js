"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const report_service_1 = require("../services/report.service");
const router = (0, express_1.Router)();
router.post("/:sessionId", (req, res) => {
    const { scores } = req.body;
    const report = (0, report_service_1.generateReport)(scores || { resume: 0, technical: 0, knowledge: 0, hr: 0 });
    res.json({ success: true, report });
});
exports.default = router;
//# sourceMappingURL=report.routes.js.map