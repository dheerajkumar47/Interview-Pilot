"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.rateLimitMiddleware = rateLimitMiddleware;
const requestCounts = {};
function rateLimitMiddleware(maxRequests = 60, windowMs = 60000) {
    return (req, res, next) => {
        const key = req.ip || "unknown";
        const now = Date.now();
        if (!requestCounts[key] || now > requestCounts[key].resetAt) {
            requestCounts[key] = { count: 0, resetAt: now + windowMs };
        }
        requestCounts[key].count++;
        if (requestCounts[key].count > maxRequests) {
            return res.status(429).json({ error: "Too many requests. Please try again later." });
        }
        next();
    };
}
//# sourceMappingURL=rateLimit.middleware.js.map