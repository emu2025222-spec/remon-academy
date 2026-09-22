import { Request, Response } from "express";
import { Gallery } from "../models/Gallery";
import { asyncHandler } from "../utils/asyncHandler";
import { success } from "../utils/apiResponse";
import { ApiError } from "../utils/ApiError";

export const listGallery = asyncHandler(async (req: Request, res: Response) => {
  const filter: Record<string, unknown> = {};
  if (req.query.category) filter.category = req.query.category;
  const images = await Gallery.find(filter).sort("-createdAt");
  return success(res, images);
});

export const uploadGalleryImageHandler = asyncHandler(async (req: Request, res: Response) => {
  if (!req.file) throw new ApiError(422, "An image file is required");
  const image = await Gallery.create({
    title: req.body.title,
    category: req.body.category,
    image: `/uploads/gallery/${req.file.filename}`,
  });
  return success(res, image, "Image uploaded successfully", 201);
});

export const deleteGalleryImage = asyncHandler(async (req: Request, res: Response) => {
  const image = await Gallery.findByIdAndDelete(req.params.id);
  if (!image) throw new ApiError(404, "Image not found");
  return success(res, {}, "Image deleted successfully");
});
