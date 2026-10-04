import { Request, Response } from "express";
import { Notice } from "../models/Notice";
import { asyncHandler } from "../utils/asyncHandler";
import { success } from "../utils/apiResponse";
import { ApiError } from "../utils/ApiError";
import { slugify } from "../utils/slugify";

export const listNoticesAdmin = asyncHandler(async (req: Request, res: Response) => {
  const page = Math.max(1, Number(req.query.page) || 1);
  const limit = Math.min(100, Math.max(1, Number(req.query.limit) || 10));
  const filter: Record<string, unknown> = {};
  if (req.query.category) filter.category = req.query.category;

  const [data, total] = await Promise.all([
    Notice.find(filter).populate("author", "fullName").sort("-date").skip((page - 1) * limit).limit(limit),
    Notice.countDocuments(filter),
  ]);
  return success(res, { data, total, page, limit, totalPages: Math.ceil(total / limit) || 1 });
});

export const listPublishedNotices = asyncHandler(async (req: Request, res: Response) => {
  const filter: Record<string, unknown> = { isPublished: true };
  if (req.query.category) filter.category = req.query.category;
  const notices = await Notice.find(filter).sort("-date");
  return success(res, notices);
});

export const getNoticeBySlug = asyncHandler(async (req: Request, res: Response) => {
  const notice = await Notice.findOne({ slug: req.params.slug, isPublished: true });
  if (!notice) throw new ApiError(404, "Notice not found");
  return success(res, notice);
});

export const getNotice = asyncHandler(async (req: Request, res: Response) => {
  const notice = await Notice.findById(req.params.id).populate("author", "fullName");
  if (!notice) throw new ApiError(404, "Notice not found");
  return success(res, notice);
});

export const createNotice = asyncHandler(async (req: Request, res: Response) => {
  const slug = `${slugify(req.body.title)}-${Date.now().toString().slice(-5)}`;
  const notice = await Notice.create({ ...req.body, slug, author: req.body.author });
  return success(res, notice, "Notice created successfully", 201);
});

export const updateNotice = asyncHandler(async (req: Request, res: Response) => {
  const notice = await Notice.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
  if (!notice) throw new ApiError(404, "Notice not found");
  return success(res, notice, "Notice updated successfully");
});

export const deleteNotice = asyncHandler(async (req: Request, res: Response) => {
  const notice = await Notice.findByIdAndDelete(req.params.id);
  if (!notice) throw new ApiError(404, "Notice not found");
  return success(res, {}, "Notice deleted successfully");
});

export const togglePublishNotice = asyncHandler(async (req: Request, res: Response) => {
  const notice = await Notice.findById(req.params.id);
  if (!notice) throw new ApiError(404, "Notice not found");
  notice.isPublished = !notice.isPublished;
  await notice.save();
  return success(res, notice, `Notice ${notice.isPublished ? "published" : "unpublished"}`);
});
