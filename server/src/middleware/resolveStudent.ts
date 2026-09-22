import { Request, Response, NextFunction } from "express";
import { Student } from "../models/Student";
import { ApiError } from "../utils/ApiError";

// For STUDENT-role requests hitting "my ___" endpoints: resolves the logged-in
// user's Student document id and stores it on req.params.studentDocId so
// downstream controllers only ever query data scoped to that student.
export async function resolveOwnStudentId(req: Request, res: Response, next: NextFunction) {
  try {
    if (!req.auth || req.auth.role !== "STUDENT") throw new ApiError(403, "Students only");
    const student = await Student.findOne({ user: req.auth.userId });
    if (!student) throw new ApiError(404, "Student profile not found");
    req.params.studentDocId = String(student._id);
    next();
  } catch (err) {
    next(err);
  }
}
