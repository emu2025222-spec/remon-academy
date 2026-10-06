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

/**
 * Admin:
 * Get all results of a specific student.
 */
export const listResultsByStudent = asyncHandler(
  async (req: Request, res: Response) => {
    const results = await Result.find({
      student: req.params.studentId,
    })
      .populate(
        "student",
        "fullName studentId phone class group"
      )
      .populate(
        "course",
        "title subject classLevel duration fee schedule"
      )
      .sort({
        examDate: -1,
        createdAt: -1,
      });

    return success(res, results);
  }
);

/**
 * Admin:
 * Full result history.
 *
 * Supported filters:
 * ?course=
 * ?student=
 * ?examName=
 * ?subject=
 * ?examDate=
 *
 * This endpoint intentionally returns ALL matching
 * result records without normal pagination so that
 * the Admin Result History can work like Attendance History.
 */
export const resultHistory = asyncHandler(
  async (req: Request, res: Response) => {
    const {
      course,
      student,
      examName,
      subject,
      examDate,
    } = req.query;

    const filter: Record<string, unknown> = {};

    // -------------------------------------------------
    // COURSE FILTER
    // -------------------------------------------------

    if (
      typeof course === "string" &&
      course.trim()
    ) {
      filter.course =
        course.trim();
    }

    // -------------------------------------------------
    // STUDENT FILTER
    // -------------------------------------------------

    if (
      typeof student === "string" &&
      student.trim()
    ) {
      filter.student =
        student.trim();
    }

    // -------------------------------------------------
    // EXAM NAME FILTER
    // -------------------------------------------------

    if (
      typeof examName === "string" &&
      examName.trim()
    ) {
      filter.examName = {
        $regex:
          examName.trim(),
        $options: "i",
      };
    }

    // -------------------------------------------------
    // SUBJECT FILTER
    // -------------------------------------------------

    if (
      typeof subject === "string" &&
      subject.trim()
    ) {
      filter.subject = {
        $regex:
          subject.trim(),
        $options: "i",
      };
    }

    // -------------------------------------------------
    // EXAM DATE FILTER
    // -------------------------------------------------

    if (
      typeof examDate === "string" &&
      examDate.trim()
    ) {
      const start =
        new Date(
          `${examDate.trim()}T00:00:00.000`
        );

      const end =
        new Date(
          `${examDate.trim()}T23:59:59.999`
        );

      if (
        !Number.isNaN(
          start.getTime()
        ) &&
        !Number.isNaN(
          end.getTime()
        )
      ) {
        filter.examDate = {
          $gte: start,
          $lte: end,
        };
      }
    }

    const results = await Result.find(
      filter
    )
      .populate(
        "student",
        "fullName studentId phone class group"
      )
      .populate(
        "course",
        "title subject classLevel duration fee schedule"
      )
      .sort({
        examDate: -1,
        createdAt: -1,
      });

    // -------------------------------------------------
    // SUMMARY
    // -------------------------------------------------

    const totalRecords =
      results.length;

    const totalMarks =
      results.reduce(
        (sum, result) =>
          sum +
          Number(
            result.totalMarks || 0
          ),
        0
      );

    const obtainedMarks =
      results.reduce(
        (sum, result) =>
          sum +
          Number(
            result.obtainedMarks || 0
          ),
        0
      );

    const gpaValues =
      results
        .map((result) =>
          Number(result.gpa)
        )
        .filter(
          (gpa) =>
            !Number.isNaN(gpa)
        );

    const averageGpa =
      gpaValues.length
        ? gpaValues.reduce(
            (sum, gpa) =>
              sum + gpa,
            0
          ) /
          gpaValues.length
        : 0;

    const passed =
      results.filter(
        (result) => {
          const grade =
            String(
              result.grade || ""
            ).toUpperCase();

          return (
            grade !== "F" &&
            Number(
              result.gpa || 0
            ) > 0
          );
        }
      ).length;

    const failed =
      results.filter(
        (result) => {
          const grade =
            String(
              result.grade || ""
            ).toUpperCase();

          return (
            grade === "F" ||
            Number(
              result.gpa || 0
            ) <= 0
          );
        }
      ).length;

    // -------------------------------------------------
    // EXAM-WISE SUMMARY
    // -------------------------------------------------

    const examMap =
      new Map<
        string,
        {
          examName: string;
          examDate: Date;
          resultCount: number;
          totalMarks: number;
          obtainedMarks: number;
          gpaValues: number[];
        }
      >();

    for (const result of results) {
      const key =
        `${result.examName}__${new Date(
          result.examDate
        ).toISOString().slice(0, 10)}`;

      if (
        !examMap.has(key)
      ) {
        examMap.set(key, {
          examName:
            result.examName,
          examDate:
            result.examDate,
          resultCount: 0,
          totalMarks: 0,
          obtainedMarks: 0,
          gpaValues: [],
        });
      }

      const exam =
        examMap.get(key)!;

      exam.resultCount += 1;

      exam.totalMarks +=
        Number(
          result.totalMarks || 0
        );

      exam.obtainedMarks +=
        Number(
          result.obtainedMarks || 0
        );

      const gpa =
        Number(result.gpa);

      if (
        !Number.isNaN(gpa)
      ) {
        exam.gpaValues.push(
          gpa
        );
      }
    }

    const exams =
      Array.from(
        examMap.values()
      ).map((exam) => {
        const average =
          exam.gpaValues.length
            ? exam.gpaValues.reduce(
                (sum, gpa) =>
                  sum + gpa,
                0
              ) /
              exam.gpaValues.length
            : 0;

        return {
          examName:
            exam.examName,

          examDate:
            exam.examDate,

          resultCount:
            exam.resultCount,

          totalMarks:
            exam.totalMarks,

          obtainedMarks:
            exam.obtainedMarks,

          averageGpa:
            Number(
              average.toFixed(2)
            ),
        };
      });

    return success(res, {
      results,

      summary: {
        totalRecords,

        totalMarks,

        obtainedMarks,

        averageGpa:
          Number(
            averageGpa.toFixed(2)
          ),

        passed,

        failed,
      },

      exams,
    });
  }
);

/**
 * Student:
 * Get logged-in student's complete result data.
 */
export const myResults = asyncHandler(
  async (req: Request, res: Response) => {
    const results = await Result.find({
      student:
        req.params.studentDocId,
    })
      .populate(
        "student",
        "fullName studentId"
      )
      .populate(
        "course",
        "title subject classLevel duration fee schedule"
      )
      .sort({
        examDate: -1,
        createdAt: -1,
      });

    // -------------------------------------------------
    // OVERALL GPA
    // -------------------------------------------------

    const gpaValues =
      results
        .map((result) =>
          Number(result.gpa)
        )
        .filter(
          (gpa) =>
            !Number.isNaN(gpa)
        );

    const averageGpa =
      gpaValues.length
        ? gpaValues.reduce(
            (total, gpa) =>
              total + gpa,
            0
          ) /
          gpaValues.length
        : 0;

    // -------------------------------------------------
    // EXAM-WISE SUMMARY
    // -------------------------------------------------

    const examMap =
      new Map<
        string,
        {
          examName: string;
          examDate: Date;
          results: typeof results;
        }
      >();

    for (const result of results) {
      const examName =
        result.examName;

      if (
        !examMap.has(
          examName
        )
      ) {
        examMap.set(
          examName,
          {
            examName,
            examDate:
              result.examDate,
            results: [],
          }
        );
      }

      examMap
        .get(examName)!
        .results.push(
          result
        );
    }

    const exams =
      Array.from(
        examMap.values()
      ).map((exam) => {
        const examResults =
          exam.results;

        const totalMarks =
          examResults.reduce(
            (sum, result) =>
              sum +
              Number(
                result.totalMarks ||
                  0
              ),
            0
          );

        const obtainedMarks =
          examResults.reduce(
            (sum, result) =>
              sum +
              Number(
                result.obtainedMarks ||
                  0
              ),
            0
          );

        const examGpas =
          examResults
            .map((result) =>
              Number(result.gpa)
            )
            .filter(
              (gpa) =>
                !Number.isNaN(
                  gpa
                )
            );

        const examAverageGpa =
          examGpas.length
            ? examGpas.reduce(
                (sum, gpa) =>
                  sum + gpa,
                0
              ) /
              examGpas.length
            : 0;

        return {
          examName:
            exam.examName,

          examDate:
            exam.examDate,

          subjectCount:
            examResults.length,

          totalMarks,

          obtainedMarks,

          averageGpa:
            Number(
              examAverageGpa.toFixed(
                2
              )
            ),
        };
      });

    return success(res, {
      results,

      averageGpa:
        Number(
          averageGpa.toFixed(2)
        ),

      exams,
    });
  }
);