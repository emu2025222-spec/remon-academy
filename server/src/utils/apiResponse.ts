import { Response } from "express";

export function success(res: Response, data: unknown = {}, message = "OK", status = 200) {
  return res.status(status).json({ success: true, message, data });
}

export function failure(res: Response, message = "Something went wrong", status = 400, errors: unknown[] = []) {
  return res.status(status).json({ success: false, message, errors });
}
