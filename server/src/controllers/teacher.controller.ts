import { Request, Response } from "express";
import { Teacher } from "../models/Teacher";
import { makeCrudControllers } from "../utils/crudFactory";
import { asyncHandler } from "../utils/asyncHandler";
import { success } from "../utils/apiResponse";

const base = makeCrudControllers(Teacher, { searchFields: ["name", "designation"] });

export const listTeachers = base.list;
export const getTeacher = base.getOne;
export const createTeacher = base.create;
export const updateTeacher = base.update;
export const deleteTeacher = base.remove;

export const listActiveTeachers = asyncHandler(async (req: Request, res: Response) => {
  const teachers = await Teacher.find({ isActive: true }).sort("-createdAt");
  return success(res, teachers);
});

export const toggleTeacherActive = asyncHandler(async (req: Request, res: Response) => {
  const teacher = await Teacher.findById(req.params.id);
  if (!teacher) return success(res, {}, "Teacher not found", 404);
  teacher.isActive = !teacher.isActive;
  await teacher.save();
  return success(res, teacher, `Teacher ${teacher.isActive ? "activated" : "deactivated"}`);
});
