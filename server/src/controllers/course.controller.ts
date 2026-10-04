import { Request, Response } from "express";
import { Course } from "../models/Course";
import { makeCrudControllers } from "../utils/crudFactory";
import { asyncHandler } from "../utils/asyncHandler";
import { success } from "../utils/apiResponse";
import { ApiError } from "../utils/ApiError";
import { slugify } from "../utils/slugify";

const base = makeCrudControllers(Course, { searchFields: ["title", "subject", "classLevel"], populate: "teacher" });

export const listCourses = base.list;
export const getCourse = base.getOne;
export const updateCourse = base.update;
export const deleteCourse = base.remove;

export const createCourse = asyncHandler(async (req: Request, res: Response) => {
  const slug = slugify(req.body.title);
  const exists = await Course.findOne({ slug });
  const finalSlug = exists ? `${slug}-${Date.now().toString().slice(-5)}` : slug;
  const course = await Course.create({ ...req.body, slug: finalSlug });
  return success(res, course, "Course created successfully", 201);
});

export const getCourseBySlug = asyncHandler(async (req: Request, res: Response) => {
  const course = await Course.findOne({ slug: req.params.slug, isPublished: true }).populate("teacher");
  if (!course) throw new ApiError(404, "Course not found");
  return success(res, course);
});

export const listPublishedCourses = asyncHandler(async (req: Request, res: Response) => {
  const filter: Record<string, unknown> = { isPublished: true };
  if (req.query.classLevel) filter.classLevel = req.query.classLevel;
  const courses = await Course.find(filter).populate("teacher", "name designation").sort("-createdAt");
  return success(res, courses);
});

export const togglePublishCourse = asyncHandler(async (req: Request, res: Response) => {
  const course = await Course.findById(req.params.id);
  if (!course) throw new ApiError(404, "Course not found");
  course.isPublished = !course.isPublished;
  await course.save();
  return success(res, course, `Course ${course.isPublished ? "published" : "unpublished"}`);
});
