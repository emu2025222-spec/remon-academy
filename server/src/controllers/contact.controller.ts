import { Request, Response } from "express";
import { ContactMessage } from "../models/ContactMessage";
import { asyncHandler } from "../utils/asyncHandler";
import { success } from "../utils/apiResponse";
import { ApiError } from "../utils/ApiError";

export const submitContactMessage = asyncHandler(async (req: Request, res: Response) => {
  const message = await ContactMessage.create(req.body);
  return success(res, message, "Your message has been sent. We will get back to you soon.", 201);
});

export const listContactMessages = asyncHandler(async (req: Request, res: Response) => {
  const page = Math.max(1, Number(req.query.page) || 1);
  const limit = Math.min(100, Math.max(1, Number(req.query.limit) || 10));
  const [data, total] = await Promise.all([
    ContactMessage.find().sort("-createdAt").skip((page - 1) * limit).limit(limit),
    ContactMessage.countDocuments(),
  ]);
  return success(res, { data, total, page, limit, totalPages: Math.ceil(total / limit) || 1 });
});

export const markMessageRead = asyncHandler(async (req: Request, res: Response) => {
  const message = await ContactMessage.findByIdAndUpdate(req.params.id, { isRead: true }, { new: true });
  if (!message) throw new ApiError(404, "Message not found");
  return success(res, message);
});

export const deleteContactMessage = asyncHandler(async (req: Request, res: Response) => {
  const message = await ContactMessage.findByIdAndDelete(req.params.id);
  if (!message) throw new ApiError(404, "Message not found");
  return success(res, {}, "Message deleted");
});
