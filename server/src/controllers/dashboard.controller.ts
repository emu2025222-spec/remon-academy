
import { Request, Response } from "express";

import { Student } from "../models/Student";
import { Course } from "../models/Course";
import { Teacher } from "../models/Teacher";
import { Fee } from "../models/Fee";
import { Attendance } from "../models/Attendance";
import { ContactMessage } from "../models/ContactMessage";
import { Notice } from "../models/Notice";
import { LoginSession } from "../models/LoginSession";

import { asyncHandler } from "../utils/asyncHandler";
import { ApiError } from "../utils/ApiError";
import { success } from "../utils/apiResponse";

/* =========================================================
   SESSION CONFIGURATION
========================================================= */

const SESSION_TIMEOUT_MS = 90 * 1000;
const BANGLADESH_OFFSET_MS = 6 * 60 * 60 * 1000;

/* =========================================================
   BANGLADESH DATE HELPERS
========================================================= */

function getBangladeshDayRange(value: string) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) {
    throw new ApiError(
      400,
      "Invalid date format. Use YYYY-MM-DD"
    );
  }

  const [year, month, day] = value.split("-").map(Number);

  const startTimestamp =
    Date.UTC(year, month - 1, day) - BANGLADESH_OFFSET_MS;

  const start = new Date(startTimestamp);

  // Reject impossible dates such as 2026-02-31.
  const check = new Date(
    Date.UTC(year, month - 1, day)
  );

  if (
    check.getUTCFullYear() !== year ||
    check.getUTCMonth() !== month - 1 ||
    check.getUTCDate() !== day
  ) {
    throw new ApiError(400, "Invalid calendar date");
  }

  return {
    start,
    end: new Date(
      startTimestamp + 24 * 60 * 60 * 1000
    ),
  };
}

/* =========================================================
   PUBLIC STATS
========================================================= */

export const publicStats = asyncHandler(
  async (req: Request, res: Response) => {
    const [
      totalStudents,
      totalTeachers,
      totalCourses,
    ] = await Promise.all([
      Student.countDocuments({
        isActive: true,
      }),

      Teacher.countDocuments({
        isActive: true,
      }),

      Course.countDocuments({
        isPublished: true,
      }),
    ]);

    return success(res, {
      totalStudents,
      totalTeachers,
      totalCourses,
      successfulStudents: totalStudents,
    });
  }
);

/* =========================================================
   ADMIN DASHBOARD STATS
========================================================= */

export const adminDashboardStats = asyncHandler(
  async (req: Request, res: Response) => {
    const startOfDay = new Date();

    startOfDay.setHours(
      0,
      0,
      0,
      0
    );

    const endOfDay = new Date();

    endOfDay.setHours(
      23,
      59,
      59,
      999
    );

    // Last 6 months
    const sixMonthsAgo = new Date();

    sixMonthsAgo.setMonth(
      sixMonthsAgo.getMonth() - 5
    );

    sixMonthsAgo.setDate(1);

    sixMonthsAgo.setHours(
      0,
      0,
      0,
      0
    );

    const [
      totalStudents,
      activeStudents,
      totalCourses,
      totalTeachers,
      pendingFees,
      todayAttendance,
      newMessages,
      latestNotices,
      feeOverview,
      monthlyFees,
      courseWiseStudents,
      studentGrowth,
    ] = await Promise.all([
      /* STUDENTS */

      Student.countDocuments(),

      Student.countDocuments({
        isActive: true,
      }),

      /* COURSES */

      Course.countDocuments(),

      /* TEACHERS */

      Teacher.countDocuments(),

      /* FEES */

      Fee.countDocuments({
        status: {
          $ne: "PAID",
        },
      }),

      /* TODAY ATTENDANCE */

      Attendance.countDocuments({
        date: {
          $gte: startOfDay,
          $lte: endOfDay,
        },
      }),

      /* CONTACT MESSAGES */

      ContactMessage.countDocuments({
        isRead: false,
      }),

      /* LATEST NOTICES */

      Notice.find()
        .sort("-date")
        .limit(5)
        .lean(),

      /* OVERALL FEE SUMMARY */

      Fee.aggregate([
        {
          $group: {
            _id: null,

            totalFee: {
              $sum: "$amount",
            },

            totalPaid: {
              $sum: "$amountPaid",
            },

            totalDue: {
              $sum: {
                $max: [
                  {
                    $subtract: [
                      "$amount",
                      "$amountPaid",
                    ],
                  },
                  0,
                ],
              },
            },

            totalRecords: {
              $sum: 1,
            },
          },
        },
      ]),

      /* MONTHLY FEE COLLECTION */

      Fee.aggregate([
        {
          $match: {
            createdAt: {
              $gte: sixMonthsAgo,
            },
          },
        },

        {
          $project: {
            month: {
              $cond: [
                {
                  $and: [
                    {
                      $ne: [
                        "$billingMonth",
                        null,
                      ],
                    },

                    {
                      $ne: [
                        "$billingMonth",
                        "",
                      ],
                    },
                  ],
                },

                "$billingMonth",

                {
                  $dateToString: {
                    format: "%Y-%m",
                    date: "$createdAt",
                  },
                },
              ],
            },

            amount: {
              $ifNull: [
                "$amount",
                0,
              ],
            },

            amountPaid: {
              $ifNull: [
                "$amountPaid",
                0,
              ],
            },
          },
        },

        {
          $group: {
            _id: "$month",

            totalFee: {
              $sum: "$amount",
            },

            paid: {
              $sum: "$amountPaid",
            },

            due: {
              $sum: {
                $max: [
                  {
                    $subtract: [
                      "$amount",
                      "$amountPaid",
                    ],
                  },
                  0,
                ],
              },
            },
          },
        },

        {
          $sort: {
            _id: 1,
          },
        },
      ]),

      /* COURSE-WISE STUDENTS */

      Student.aggregate([
        {
          $project: {
            courseIds: {
              $setUnion: [
                {
                  $ifNull: [
                    "$courses",
                    [],
                  ],
                },

                {
                  $cond: [
                    {
                      $ne: [
                        "$course",
                        null,
                      ],
                    },

                    ["$course"],

                    [],
                  ],
                },
              ],
            },
          },
        },

        {
          $unwind: "$courseIds",
        },

        {
          $group: {
            _id: "$courseIds",

            students: {
              $sum: 1,
            },
          },
        },

        {
          $lookup: {
            from: "courses",
            localField: "_id",
            foreignField: "_id",
            as: "course",
          },
        },

        {
          $unwind: {
            path: "$course",
            preserveNullAndEmptyArrays: true,
          },
        },

        {
          $project: {
            _id: 1,

            courseName: {
              $ifNull: [
                "$course.name",
                "Unknown Course",
              ],
            },

            students: 1,
          },
        },

        {
          $sort: {
            students: -1,
          },
        },
      ]),

      /* STUDENT GROWTH */

      Student.aggregate([
        {
          $group: {
            _id: {
              year: {
                $year: "$createdAt",
              },

              month: {
                $month: "$createdAt",
              },
            },

            count: {
              $sum: 1,
            },
          },
        },

        {
          $sort: {
            "_id.year": 1,
            "_id.month": 1,
          },
        },

        {
          $limit: 12,
        },
      ]),
    ]);

    const feeTotals =
      feeOverview[0] || {
        totalFee: 0,
        totalPaid: 0,
        totalDue: 0,
        totalRecords: 0,
      };

    const inactiveStudents = Math.max(
      totalStudents - activeStudents,
      0
    );

    return success(res, {
      /* EXISTING DASHBOARD STATS */

      totalStudents,
      activeStudents,
      totalCourses,
      totalTeachers,
      pendingFees,
      todayAttendance,
      newMessages,
      latestNotices,

      /* STUDENT STATUS */

      studentStatus: {
        active: activeStudents,
        inactive: inactiveStudents,
      },

      /* FEE OVERVIEW */

      feeOverview: {
        totalFee: Number(
          feeTotals.totalFee || 0
        ),

        totalPaid: Number(
          feeTotals.totalPaid || 0
        ),

        totalDue: Number(
          feeTotals.totalDue || 0
        ),

        totalRecords: Number(
          feeTotals.totalRecords || 0
        ),
      },

      /* MONTHLY FEES */

      monthlyFees: monthlyFees.map(
        (item) => ({
          month: item._id,

          totalFee: Number(
            item.totalFee || 0
          ),

          paid: Number(
            item.paid || 0
          ),

          due: Number(
            item.due || 0
          ),
        })
      ),

      /* COURSE-WISE STUDENTS */

      courseWiseStudents: courseWiseStudents.map(
        (item) => ({
          courseId: item._id,

          courseName: item.courseName,

          students: Number(
            item.students || 0
          ),
        })
      ),

      /* STUDENT GROWTH */

      studentGrowth: studentGrowth.map(
        (item) => ({
          year: item._id.year,
          month: item._id.month,
          count: item.count,
        })
      ),
    });
  }
);

/* =========================================================
   LIVE ONLINE STUDENTS
========================================================= */

/**
 * Student is online if:
 *
 * - role = STUDENT
 * - isOnline = true
 * - lastActiveAt is within 90 seconds
 *
 * Each device is a separate session.
 *
 * Multiple sessions of one student are counted as:
 * - One unique student
 * - Multiple online devices
 */

export const onlineStudents = asyncHandler(
  async (req: Request, res: Response) => {
    const now = new Date();

    const cutoff = new Date(
      now.getTime() - SESSION_TIMEOUT_MS
    );

    /* MARK EXPIRED STUDENT SESSIONS OFFLINE */

    await LoginSession.updateMany(
      {
        role: "STUDENT",
        isOnline: true,
        lastActiveAt: {
          $lt: cutoff,
        },
      },
      {
        $set: {
          isOnline: false,
        },
      }
    );

    /* FETCH ACTIVE STUDENT SESSIONS */

    const sessions = await LoginSession.find({
      role: "STUDENT",
      isOnline: true,
      lastActiveAt: {
        $gte: cutoff,
      },
    })
      .populate(
        "student",
        "studentId fullName phone class group courses course profilePhoto isActive"
      )
      .populate(
        "user",
        "email"
      )
      .sort({
        lastActiveAt: -1,
      })
      .lean();

    /* FORMAT DEVICE SESSIONS */

    const students = sessions.map(
      (session: any) => {
        const student = session.student;
        const user = session.user;

        return {
          sessionId: session.sessionId,

          studentObjectId:
            student?._id || null,

          studentId:
            student?.studentId || "N/A",

          fullName:
            student?.fullName || "Unknown Student",

          email:
            user?.email || "",

          phone:
            student?.phone || "",

          class:
            student?.class || "",

          group:
            student?.group || "",

          profilePhoto:
            student?.profilePhoto || "",

          loginAt:
            session.loginAt,

          lastActiveAt:
            session.lastActiveAt,

          isOnline: true,

          userAgent:
            session.userAgent || "",

          ipAddress:
            session.ipAddress || "",
        };
      }
    );

    /* COUNT UNIQUE STUDENTS */

    const uniqueStudentIds = new Set(
      students
        .map((student) =>
          String(student.studentObjectId || "")
        )
        .filter(Boolean)
    );

    return success(res, {
      online: true,

      // Keep count for compatibility with existing clients.
      count: students.length,

      // Unique students, not device sessions.
      onlineStudentCount: uniqueStudentIds.size,

      // Each browser/device session.
      onlineDeviceCount: students.length,

      students,

      checkedAt: now,
    });
  }
);

/* =========================================================
   LOGIN HISTORY
========================================================= */

/**
 * Includes ADMIN and STUDENT login sessions.
 *
 * Default limit: 50
 * Maximum limit: 200
 *
 * Optional query:
 *
 * ?limit=100
 * ?date=2026-11-02
 * ?from=2026-11-01&to=2026-11-02
 */

export const loginHistory = asyncHandler(
  async (req: Request, res: Response) => {
    const limitParam = Number(
      req.query.limit || 50
    );

    const limit = Math.min(
      Math.max(
        Number.isFinite(limitParam)
          ? limitParam
          : 50,
        1
      ),
      200
    );

    const date = String(
      req.query.date || ""
    );

    const from = String(
      req.query.from || ""
    );

    const to = String(
      req.query.to || ""
    );

    const filter: Record<string, any> = {};

    /* DATE FILTER */

    if (date) {
      const range = getBangladeshDayRange(date);

      filter.loginAt = {
        $gte: range.start,
        $lt: range.end,
      };
    } else if (from || to) {
      if (!from || !to) {
        throw new ApiError(
          400,
          "Both from and to dates are required"
        );
      }

      const startRange =
        getBangladeshDayRange(from);

      const endRange =
        getBangladeshDayRange(to);

      if (startRange.start > endRange.start) {
        throw new ApiError(
          400,
          "From date cannot be after to date"
        );
      }

      filter.loginAt = {
        $gte: startRange.start,
        $lt: endRange.end,
      };
    }

    /* MARK EXPIRED SESSIONS OFFLINE */

    const now = new Date();

    const cutoff = new Date(
      now.getTime() - SESSION_TIMEOUT_MS
    );

    await LoginSession.updateMany(
      {
        isOnline: true,
        lastActiveAt: {
          $lt: cutoff,
        },
      },
      {
        $set: {
          isOnline: false,
        },
      }
    );

    /* FETCH HISTORY */

    const sessions = await LoginSession.find(filter)
      .populate(
        "student",
        "studentId fullName phone class group profilePhoto"
      )
      .populate(
        "user",
        "email role lastLoginAt"
      )
      .sort({
        loginAt: -1,
      })
      .limit(limit)
      .lean();

    /* FORMAT HISTORY */

    const history = sessions.map(
      (session: any) => {
        const student = session.student;
        const user = session.user;

        const currentlyOnline =
          session.isOnline === true &&
          session.lastActiveAt instanceof Date &&
          session.lastActiveAt.getTime() >= cutoff.getTime();

        return {
          sessionId:
            session.sessionId,

          role:
            session.role,

          email:
            user?.email || "",

          studentId:
            student?.studentId || "",

          fullName:
            student?.fullName ||
            (session.role === "ADMIN"
              ? "Admin"
              : "Unknown Student"),

          phone:
            student?.phone || "",

          class:
            student?.class || "",

          group:
            student?.group || "",

          profilePhoto:
            student?.profilePhoto || "",

          loginAt:
            session.loginAt,

          lastActiveAt:
            session.lastActiveAt,

          logoutAt:
            session.logoutAt || null,

          isOnline:
            currentlyOnline,

          userAgent:
            session.userAgent || "",

          ipAddress:
            session.ipAddress || "",
        };
      }
    );

    return success(res, {
      count: history.length,

      limit,

      date: date || null,

      from: from || null,

      to: to || null,

      history,

      checkedAt: now,
    });
  }
);

/* =========================================================
   STUDENT GROWTH CHART
========================================================= */

export const studentGrowthChart =
  asyncHandler(
    async (
      req: Request,
      res: Response
    ) => {
      const results = await Student.aggregate([
        {
          $group: {
            _id: {
              year: {
                $year: "$createdAt",
              },

              month: {
                $month: "$createdAt",
              },
            },

            count: {
              $sum: 1,
            },
          },
        },

        {
          $sort: {
            "_id.year": 1,
            "_id.month": 1,
          },
        },

        {
          $limit: 12,
        },
      ]);

      return success(
        res,
        results
      );
    }
  );
