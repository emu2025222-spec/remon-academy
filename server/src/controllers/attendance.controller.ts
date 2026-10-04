import { Request, Response } from "express";
import {
  Attendance,
  AttendanceStatus,
} from "../models/Attendance";
import { Student } from "../models/Student";
import { asyncHandler } from "../utils/asyncHandler";
import { success } from "../utils/apiResponse";
import { ApiError } from "../utils/ApiError";

export const listAttendance =
  asyncHandler(
    async (
      req: Request,
      res: Response
    ) => {
      const {
        course,
        date,
        student,
      } = req.query;

      const filter: Record<
        string,
        unknown
      > = {};

      if (course) {
        filter.course = course;
      }

      if (student) {
        filter.student = student;
      }

      if (date) {
        const start = new Date(
          date as string
        );

        start.setHours(
          0,
          0,
          0,
          0
        );

        const end = new Date(
          start
        );

        end.setHours(
          23,
          59,
          59,
          999
        );

        filter.date = {
          $gte: start,
          $lte: end,
        };
      }

      const records =
        await Attendance.find(
          filter
        )
          .populate(
            "student",
            "fullName studentId"
          )
          .populate(
            "course",
            "title subject classLevel"
          )
          .sort("-date");

      return success(
        res,
        records
      );
    }
  );

// Bulk submit:
// [{ student, status }]
// course + date come from body
export const bulkMarkAttendance =
  asyncHandler(
    async (
      req: Request,
      res: Response
    ) => {
      const {
        course,
        date,
        records,
      } = req.body as {
        course: string;
        date: string;
        records: {
          student: string;
          status: AttendanceStatus;
        }[];
      };

      if (
        !course ||
        !date ||
        !Array.isArray(
          records
        ) ||
        records.length === 0
      ) {
        throw new ApiError(
          422,
          "course, date, and a non-empty records array are required"
        );
      }

      const validStatuses: AttendanceStatus[] =
        [
          "PRESENT",
          "ABSENT",
          "LATE",
        ];

      for (const r of records) {
        if (
          !r.student ||
          !validStatuses.includes(
            r.status
          )
        ) {
          throw new ApiError(
            422,
            `Invalid attendance record: ${JSON.stringify(
              r
            )}`
          );
        }
      }

      const day = new Date(
        date
      );

      day.setHours(
        0,
        0,
        0,
        0
      );

      /*
       * Attendance remains course-specific.
       *
       * This means a student can have:
       *
       * Physics   → Present
       * Chemistry → Absent
       * Biology   → Late
       *
       * on the same date.
       */

      type BulkOp =
        Parameters<
          typeof Attendance.bulkWrite
        >[0][number];

      const ops: BulkOp[] =
        records.map(
          (r) => ({
            updateOne: {
              filter: {
                student:
                  r.student,
                course,
                date: day,
              },

              update: {
                $set: {
                  status:
                    r.status,
                },
              },

              upsert: true,
            },
          })
        );

      await Attendance.bulkWrite(
        ops
      );

      const saved =
        await Attendance.find({
          course,
          date: day,
        })
          .populate(
            "student",
            "fullName studentId"
          )
          .populate(
            "course",
            "title subject classLevel"
          );

      return success(
        res,
        saved,
        "Attendance saved successfully"
      );
    }
  );

export const deleteAttendance =
  asyncHandler(
    async (
      req: Request,
      res: Response
    ) => {
      const record =
        await Attendance.findByIdAndDelete(
          req.params.id
        );

      if (!record) {
        throw new ApiError(
          404,
          "Attendance record not found"
        );
      }

      return success(
        res,
        {},
        "Attendance record deleted"
      );
    }
  );

// Student's own attendance summary.
//
// studentDocId is the Student document's _id.
export const myAttendanceSummary =
  asyncHandler(
    async (
      req: Request,
      res: Response
    ) => {
      const studentDocId =
        req.params.studentDocId;

      /*
       * Verify student exists.
       */
      const student =
        await Student.findById(
          studentDocId
        );

      if (!student) {
        throw new ApiError(
          404,
          "Student not found"
        );
      }

      /*
       * Get ALL attendance records
       * belonging to this student.
       *
       * Each record already contains
       * its own course, so attendance
       * from multiple courses is supported.
       */
      const records =
        await Attendance.find({
          student:
            studentDocId,
        })
          .populate(
            "course",
            "title subject classLevel"
          )
          .sort("-date");

      const total =
        records.length;

      const present =
        records.filter(
          (r) =>
            r.status ===
            "PRESENT"
        ).length;

      const absent =
        records.filter(
          (r) =>
            r.status ===
            "ABSENT"
        ).length;

      const late =
        records.filter(
          (r) =>
            r.status ===
            "LATE"
        ).length;

      /*
       * Late counts as half-present.
       */
      const percentage =
        total
          ? Math.round(
              ((present +
                late * 0.5) /
                total) *
                100
            )
          : 0;

      /*
       * Course-wise attendance
       * summary for students enrolled
       * in multiple courses.
       */
      const courseMap =
        new Map<
          string,
          {
            course: unknown;
            total: number;
            present: number;
            absent: number;
            late: number;
            percentage: number;
          }
        >();

      for (const record of records) {
        const populatedCourse =
          record.course;

        const courseId =
          populatedCourse &&
          typeof populatedCourse ===
            "object" &&
          "_id" in
            populatedCourse
            ? String(
                (
                  populatedCourse as {
                    _id: unknown;
                  }
                )._id
              )
            : String(
                populatedCourse
              );

        if (
          !courseMap.has(
            courseId
          )
        ) {
          courseMap.set(
            courseId,
            {
              course:
                populatedCourse,
              total: 0,
              present: 0,
              absent: 0,
              late: 0,
              percentage: 0,
            }
          );
        }

        const stats =
          courseMap.get(
            courseId
          )!;

        stats.total += 1;

        if (
          record.status ===
          "PRESENT"
        ) {
          stats.present += 1;
        }

        if (
          record.status ===
          "ABSENT"
        ) {
          stats.absent += 1;
        }

        if (
          record.status ===
          "LATE"
        ) {
          stats.late += 1;
        }

        stats.percentage =
          stats.total
            ? Math.round(
                ((stats.present +
                  stats.late *
                    0.5) /
                  stats.total) *
                  100
              )
            : 0;
      }

      const courseStats =
        Array.from(
          courseMap.values()
        );

      return success(
        res,
        {
          records,

          stats: {
            total,
            present,
            absent,
            late,
            percentage,
          },

          courseStats,
        }
      );
    }
  );