import { Request, Response } from "express";

import { Schedule } from "../models/Schedule";

import { Student } from "../models/Student";

import { makeCrudControllers } from "../utils/crudFactory";

import { asyncHandler } from "../utils/asyncHandler";

import { success } from "../utils/apiResponse";

const base = makeCrudControllers(Schedule, {
  populate: ["course", "teacher"],
});

export const listSchedule = base.list;

export const getSchedule = base.getOne;

export const createSchedule = base.create;

export const updateSchedule = base.update;

export const deleteSchedule = base.remove;

export const myClassSchedule = asyncHandler(
  async (req: Request, res: Response) => {
    const student = await Student.findById(
      req.params.studentDocId
    );

    if (!student) {
      return success(res, []);
    }

    /*
     * Support both:
     *
     * Old student:
     *   course
     *
     * New student:
     *   courses[]
     *
     * This keeps existing student data working.
     */
    const courseIds: string[] = [];

    // New multiple-course field
    if (
      Array.isArray(student.courses)
    ) {
      student.courses.forEach((course) => {
        const courseId =
          typeof course === "string"
            ? course
            : course.toString();

        if (
          courseId &&
          !courseIds.includes(courseId)
        ) {
          courseIds.push(courseId);
        }
      });
    }

    // Old single-course field
    // Used as fallback for existing students.
    if (student.course) {
      const oldCourseId =
        typeof student.course === "string"
          ? student.course
          : student.course.toString();

      if (
        oldCourseId &&
        !courseIds.includes(oldCourseId)
      ) {
        courseIds.push(oldCourseId);
      }
    }

    // No assigned courses
    if (courseIds.length === 0) {
      return success(res, []);
    }

    /*
     * Get schedules for ALL assigned courses.
     */
    const schedule = await Schedule.find({
      course: {
        $in: courseIds,
      },
    })
      .populate(
        "course",
        "title subject classLevel"
      )
      .populate(
        "teacher",
        "name"
      )
      .sort({
        day: 1,
        startTime: 1,
      });

    return success(
      res,
      schedule
    );
  }
);