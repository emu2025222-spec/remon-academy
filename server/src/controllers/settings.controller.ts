import { Request, Response } from "express";
import { WebsiteSettings } from "../models/WebsiteSettings";
import { asyncHandler } from "../utils/asyncHandler";
import { success } from "../utils/apiResponse";

export const getSettings = asyncHandler(async (req: Request, res: Response) => {
  let settings = await WebsiteSettings.findOne();
  if (!settings) settings = await WebsiteSettings.create({});
  return success(res, settings);
});

export const updateSettings = asyncHandler(async (req: Request, res: Response) => {
  let settings = await WebsiteSettings.findOne();
  if (!settings) {
    settings = await WebsiteSettings.create(req.body);
  } else {
    Object.assign(settings, req.body);
    await settings.save();
  }
  return success(res, settings, "Settings updated successfully");
});
