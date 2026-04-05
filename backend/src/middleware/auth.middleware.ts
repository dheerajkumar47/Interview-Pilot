import { Request, Response, NextFunction } from "express";

// Placeholder auth middleware — will integrate with Supabase JWT verification
export function authMiddleware(req: Request, res: Response, next: NextFunction) {
  const token = req.headers.authorization?.replace("Bearer ", "");
  // TODO: Verify JWT with Supabase
  if (!token && process.env.NODE_ENV === "production") {
    return res.status(401).json({ error: "Unauthorized" });
  }
  // For development, allow all requests
  next();
}
