import { Request, Response, NextFunction } from "express";
import { verifyToken, JwtPayload } from "../utils/jwt";
import { ApiError } from "../utils/ApiError";
import { env } from "../config/env";
import { User } from "../models/User";

declare global {
  namespace Express {
    interface Request {
      auth?: JwtPayload;
    }
  }
}

export async function requireAuth(req: Request, res: Response, next: NextFunction) {
  try {
    const token = req.cookies?.[env.cookieName] || req.headers.authorization?.replace("Bearer ", "");
    if (!token) throw new ApiError(401, "Not authenticated");

    const payload = verifyToken(token);
    const user = await User.findById(payload.userId);
    if (!user || !user.isActive) throw new ApiError(401, "Session invalid or account deactivated");

    req.auth = payload;
    next();
  } catch (err) {
    next(new ApiError(401, "Invalid or expired session. Please log in again."));
  }
}

export function requireRole(...roles: Array<"ADMIN" | "STUDENT">) {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.auth || !roles.includes(req.auth.role)) {
      return next(new ApiError(403, "You do not have permission to perform this action"));
    }
    next();
  };
}
