"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.authMiddleware = authMiddleware;
// Placeholder auth middleware — will integrate with Supabase JWT verification
function authMiddleware(req, res, next) {
    const token = req.headers.authorization?.replace("Bearer ", "");
    // TODO: Verify JWT with Supabase
    if (!token && process.env.NODE_ENV === "production") {
        return res.status(401).json({ error: "Unauthorized" });
    }
    // For development, allow all requests
    next();
}
//# sourceMappingURL=auth.middleware.js.map