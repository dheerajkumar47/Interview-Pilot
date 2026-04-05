import { Request, Response, NextFunction } from "express";

const requestCounts: Record<string, { count: number; resetAt: number }> = {};

export function rateLimitMiddleware(maxRequests = 60, windowMs = 60000) {
  return (req: Request, res: Response, next: NextFunction) => {
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
