import { Request, Response, NextFunction } from "express";
export declare function rateLimitMiddleware(maxRequests?: number, windowMs?: number): (req: Request, res: Response, next: NextFunction) => Response<any, Record<string, any>> | undefined;
//# sourceMappingURL=rateLimit.middleware.d.ts.map