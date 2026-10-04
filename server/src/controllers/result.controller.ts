import { Request, Response } from "express";

import { Result } from "../models/Result";
import { makeCrudControllers } from "../utils/crudFactory";
import { asyncHandler } from "../utils/asyncHandler";
import { success } from "../utils/apiResponse";

const base = makeCrudControllers(Result, {
  searchFields: ["examName", "subject"],
  populate: ["student", "course"],
});

export const listResults = base.list;

export const getResult = base.getOne;

export const createResult = base.create;

export const updateResult = base.update;

export const deleteResult = base.remove;

/*
 * List all results for a specific student.
 */
export const listResultsByStudent = asyncHandler(
  async (req: Request, res: Response) => {
    const results = await Result.find({
      student: req.params.studentId,
    })
      .populate("student", "fullName studentId")
      .populate(
        "course",
        "title subject classLevel duration fee schedule"
      )
      .sort("-examDate");

    return success(res, results);
  }
);

/*
 * Student's own results.
 *
 * Returns:
 * - all results
 * - average GPA
 * - exam-wise grouping
 *
 * Old results without a course are also supported.
 */
export const myResults = asyncHandler(
  async (req: Request, res: Response) => {
    const results = await Result.find({
      student: req.params.studentDocId,
    })
      .populate("student", "fullName studentId")
      .populate(
        "course",
        "title subject classLevel duration fee schedule"
      )
      .sort("-examDate");

    /*
     * Calculate average GPA.
     */
    const gpaValues = results
      .map((result) => Number(result.gpa))
      .filter((gpa) => !Number.isNaN(gpa));

    const averageGpa = gpaValues.length
      ? gpaValues.reduce(
          (total, gpa) => total + gpa,
          0
        ) / gpaValues.length
      : 0;

    /*
     * Group results by exam.
     */
    const examMap = new Map<
      string,
      {
        examName: string;
        examDate: Date;
        results: typeof results;
      }
    >();

    for (const result of results) {
      const examName = result.examName;

      if (!examMap.has(examName)) {
        examMap.set(examName, {
          examName,
          examDate: result.examDate,
          results: [],
        });
      }

      examMap.get(examName)!.results.push(result);
    }

    /*
     * Convert exam map to array.
     */
    const exams = Array.from(examMap.values()).map(
      (exam) => {
        const examResults = exam.results;

        const totalMarks = examResults.reduce(
          (sum, result) =>
            sum + Number(result.totalMarks || 0),
          0
        );

        const obtainedMarks = examResults.reduce(
          (sum, result) =>
            sum + Number(result.obtainedMarks || 0),
          0
        );

        const examGpas = examResults
          .map((result) => Number(result.gpa))
          .filter((gpa) => !Number.isNaN(gpa));

        const examAverageGpa = examGpas.length
          ? examGpas.reduce(
              (sum, gpa) => sum + gpa,
              0
            ) / examGpas.length
          : 0;

        return {
          examName: exam.examName,
          examDate: exam.examDate,
          subjectCount: examResults.length,
          totalMarks,
          obtainedMarks,
          averageGpa: Number(
            examAverageGpa.toFixed(2)
          ),
        };
      }
    );

    return success(res, {
      results,

      averageGpa: Number(
        averageGpa.toFixed(2)
      ),

      exams,
    });
  }
);