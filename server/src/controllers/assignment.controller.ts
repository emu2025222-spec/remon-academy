import { Request, Response } from "express";
import { Assignment } from "../models/Assignment";
import { AssignmentSubmission } from "../models/AssignmentSubmission";
import { Student } from "../models/Student";
import { makeCrudControllers } from "../utils/crudFactory";
import { asyncHandler } from "../utils/asyncHandler";
import { success } from "../utils/apiResponse";
import { ApiError } from "../utils/ApiError";

const base = makeCrudControllers(Assignment, { searchFields: ["title", "subject"], populate: "course" });

export const listAssignments = base.list;
export const getAssignment = base.getOne;
export const createAssignment = base.create;
export const updateAssignment = base.update;
export const deleteAssignment = base.remove;

export const listAssignmentsForStudent = asyncHandler(async (req: Request, res: Response) => {
  const student = await Student.findById(req.params.studentDocId);
  if (!student || !student.course) return success(res, []);
  const assignments = await Assignment.find({ course: student.course }).sort("-deadline");
  return success(res, assignments);
});

export const submitAssignment = asyncHandler(async (req: Request, res: Response) => {
  if (!req.file) throw new ApiError(422, "A file upload is required");
  const filePath = `/uploads/assignments/${req.file.filename}`;

  const submission = await AssignmentSubmission.findOneAndUpdate(
    { assignment: req.params.id, student: req.params.studentDocId },
    { file: filePath, submittedAt: new Date() },
    { new: true, upsert: true }
  );
  return success(res, submission, "Assignment submitted successfully");
});

export const listSubmissionsForAssignment = asyncHandler(async (req: Request, res: Response) => {
  const submissions = await AssignmentSubmission.find({ assignment: req.params.id }).populate("student", "fullName studentId");
  return success(res, submissions);
});

export const gradeSubmission = asyncHandler(async (req: Request, res: Response) => {
  const { grade, feedback } = req.body;
  const submission = await AssignmentSubmission.findByIdAndUpdate(req.params.submissionId, { grade, feedback }, { new: true });
  if (!submission) throw new ApiError(404, "Submission not found");
  return success(res, submission, "Submission graded");
});
