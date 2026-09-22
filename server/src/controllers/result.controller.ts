import { Request, Response } from "express";
import { Result } from "../models/Result";
import { makeCrudControllers } from "../utils/crudFactory";
import { asyncHandler } from "../utils/asyncHandler";
import { success } from "../utils/apiResponse";

const base = makeCrudControllers(Result, { searchFields: ["examName", "subject"], populate: "student" });

export const listResults = base.list;
export const getResult = base.getOne;
export const createResult = base.create;
export const updateResult = base.update;
export const deleteResult = base.remove;

export const listResultsByStudent = asyncHandler(async (req: Request, res: Response) => {
  const results = await Result.find({ student: req.params.studentId }).sort("-examDate");
  return success(res, results);
});

export const myResults = asyncHandler(async (req: Request, res: Response) => {
  const results = await Result.find({ student: req.params.studentDocId }).sort("-examDate");
  const gpaValues = results.map((r) => r.gpa);
  const averageGpa = gpaValues.length ? gpaValues.reduce((a, b) => a + b, 0) / gpaValues.length : 0;
  return success(res, { results, averageGpa: Number(averageGpa.toFixed(2)) });
});
