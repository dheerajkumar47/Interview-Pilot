"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.errorMiddleware = errorMiddleware;
function errorMiddleware(err, req, res, _next) {
    console.error(`[ERROR] ${req.method} ${req.path}:`, err.message);
    res.status(500).json({
        error: "Internal server error",
        message: process.env.NODE_ENV === "development" ? err.message : "Something went wrong",
    });
}
//# sourceMappingURL=error.middleware.js.map