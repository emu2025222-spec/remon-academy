import { Request, Response, NextFunction } from "express";
import { ApiError } from "../utils/ApiError";
import { env } from "../config/env";

export function notFoundHandler(req: Request, res: Response) {
  res.status(404).json({ success: false, message: `Route not found: ${req.originalUrl}`, errors: [] });
}

export function errorHandler(err: unknown, req: Request, res: Response, next: NextFunction) {
  if (err instanceof ApiError) {
    return res.status(err.status).json({ success: false, message: err.message, errors: err.errors });
  }

  // Mongoose duplicate key
  if (typeof err === "object" && err !== null && (err as { code?: number }).code === 11000) {
    return res.status(409).json({ success: false, message: "Duplicate value — this record already exists.", errors: [] });
  }

  console.error("[UNHANDLED ERROR]", err);
  const message = env.nodeEnv === "development" && err instanceof Error ? err.message : "Internal server error";
  return res.status(500).json({ success: false, message, errors: [] });
}
