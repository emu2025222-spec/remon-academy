import { Request, Response } from "express";
import { Schedule } from "../models/Schedule";
import { Student } from "../models/Student";
import { makeCrudControllers } from "../utils/crudFactory";
import { asyncHandler } from "../utils/asyncHandler";
import { success } from "../utils/apiResponse";

const base = makeCrudControllers(Schedule, { populate: ["course", "teacher"] });

export const listSchedule = base.list;
export const getSchedule = base.getOne;
export const createSchedule = base.create;
export const updateSchedule = base.update;
export const deleteSchedule = base.remove;

export const myClassSchedule = asyncHandler(async (req: Request, res: Response) => {
  const student = await Student.findById(req.params.studentDocId);
  if (!student || !student.course) return success(res, []);
  const schedule = await Schedule.find({ course: student.course }).populate("teacher", "name").sort("day");
  return success(res, schedule);
});
