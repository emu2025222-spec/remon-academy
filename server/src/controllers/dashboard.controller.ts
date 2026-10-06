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
import { success } from "../utils/apiResponse";

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
      /* =========================
         STUDENTS
      ========================= */

      Student.countDocuments(),

      Student.countDocuments({
        isActive: true,
      }),

      /* =========================
         COURSES
      ========================= */

      Course.countDocuments(),

      /* =========================
         TEACHERS
      ========================= */

      Teacher.countDocuments(),

      /* =========================
         FEES
      ========================= */

      Fee.countDocuments({
        status: {
          $ne: "PAID",
        },
      }),

      /* =========================
         TODAY ATTENDANCE
      ========================= */

      Attendance.countDocuments({
        date: {
          $gte: startOfDay,
          $lte: endOfDay,
        },
      }),

      /* =========================
         CONTACT MESSAGES
      ========================= */

      ContactMessage.countDocuments({
        isRead: false,
      }),

      /* =========================
         LATEST NOTICES
      ========================= */

      Notice.find()
        .sort("-date")
        .limit(5)
        .lean(),

      /* =========================
         OVERALL FEE SUMMARY
      ========================= */

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

      /* =========================
         MONTHLY FEE COLLECTION
      ========================= */

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

      /* =========================
         COURSE-WISE STUDENTS
      ========================= */

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

      /* =========================
         STUDENT GROWTH
      ========================= */

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

    const inactiveStudents =
      Math.max(
        totalStudents -
          activeStudents,
        0
      );

    return success(res, {
      /* =========================
         EXISTING DASHBOARD STATS
      ========================= */

      totalStudents,
      activeStudents,
      totalCourses,
      totalTeachers,
      pendingFees,
      todayAttendance,
      newMessages,
      latestNotices,

      /* =========================
         STUDENT STATUS
      ========================= */

      studentStatus: {
        active: activeStudents,
        inactive: inactiveStudents,
      },

      /* =========================
         FEE OVERVIEW
      ========================= */

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

      /* =========================
         MONTHLY FEES
      ========================= */

      monthlyFees:
        monthlyFees.map(
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

      /* =========================
         COURSE-WISE STUDENTS
      ========================= */

      courseWiseStudents:
        courseWiseStudents.map(
          (item) => ({
            courseId: item._id,

            courseName:
              item.courseName,

            students: Number(
              item.students || 0
            ),
          })
        ),

      /* =========================
         STUDENT GROWTH
      ========================= */

      studentGrowth:
        studentGrowth.map(
          (item) => ({
            year:
              item._id.year,

            month:
              item._id.month,

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
 * Returns currently active student sessions.
 *
 * A student is considered online when:
 *
 * 1. role = STUDENT
 * 2. isOnline = true
 * 3. lastActiveAt is within the last 60 seconds
 *
 * If the browser is closed without logout,
 * the session automatically becomes offline
 * after the 60-second threshold.
 */

export const onlineStudents = asyncHandler(
  async (
    req: Request,
    res: Response
  ) => {
    const now = new Date();

    const onlineThreshold =
      new Date(
        now.getTime() -
          60 * 1000
      );

    /* =========================
       MARK STALE STUDENTS OFFLINE
    ========================= */

    await LoginSession.updateMany(
      {
        role: "STUDENT",

        isOnline: true,

        lastActiveAt: {
          $lt: onlineThreshold,
        },
      },

      {
        $set: {
          isOnline: false,
        },
      }
    );

    /* =========================
       GET CURRENTLY ONLINE
    ========================= */

    const sessions =
      await LoginSession.find({
        role: "STUDENT",

        isOnline: true,

        lastActiveAt: {
          $gte: onlineThreshold,
        },
      })
        .populate(
          "student",
          "studentId fullName phone class group courses course profilePhoto isActive"
        )
        .sort({
          lastActiveAt: -1,
        })
        .lean();

    /* =========================
       FORMAT RESPONSE
    ========================= */

    const students =
      sessions.map(
        (session) => {
          const student =
            session.student as
              | {
                  _id?: unknown;
                  studentId?: string;
                  fullName?: string;
                  phone?: string;
                  class?: string;
                  group?: string;
                  profilePhoto?: string;
                  isActive?: boolean;
                }
              | null
              | undefined;

          return {
            sessionId:
              session.sessionId,

            studentId:
              student?.studentId ||
              "N/A",

            fullName:
              student?.fullName ||
              "Unknown Student",

            phone:
              student?.phone || "",

            class:
              student?.class || "",

            group:
              student?.group || "",

            profilePhoto:
              student?.profilePhoto ||
              "",

            loginAt:
              session.loginAt,

            lastActiveAt:
              session.lastActiveAt,

            isOnline: true,

            userAgent:
              session.userAgent ||
              "",
          };
        }
      );

    return success(res, {
      online: true,

      count:
        students.length,

      students,

      checkedAt: now,
    });
  }
);

/* =========================================================
   LOGIN HISTORY
========================================================= */

/**
 * Returns recent login sessions.
 *
 * This includes both:
 *
 * - STUDENT
 * - ADMIN
 *
 * Default: latest 50 sessions
 *
 * Maximum: 200 sessions
 */

export const loginHistory = asyncHandler(
  async (
    req: Request,
    res: Response
  ) => {
    const limitParam =
      Number(
        req.query.limit || 50
      );

    const limit =
      Math.min(
        Math.max(
          limitParam,
          1
        ),
        200
      );

    const sessions =
      await LoginSession.find()
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

    const now = Date.now();

    const onlineThreshold =
      now -
      60 * 1000;

    const history =
      sessions.map(
        (session) => {
          const student =
            session.student as
              | {
                  studentId?: string;
                  fullName?: string;
                  phone?: string;
                  class?: string;
                  group?: string;
                  profilePhoto?: string;
                }
              | null
              | undefined;

          const user =
            session.user as
              | {
                  email?: string;
                  role?: string;
                }
              | null
              | undefined;

          const isCurrentlyOnline =
            session.isOnline === true &&
            session.lastActiveAt.getTime() >=
              onlineThreshold;

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
              "Admin",

            phone:
              student?.phone || "",

            class:
              student?.class || "",

            group:
              student?.group || "",

            profilePhoto:
              student?.profilePhoto ||
              "",

            loginAt:
              session.loginAt,

            lastActiveAt:
              session.lastActiveAt,

            logoutAt:
              session.logoutAt ||
              null,

            isOnline:
              isCurrentlyOnline,

            userAgent:
              session.userAgent ||
              "",

            ipAddress:
              session.ipAddress ||
              "",
          };
        }
      );

    return success(res, {
      count:
        history.length,

      history,
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
      const results =
        await Student.aggregate([
          {
            $group: {
              _id: {
                year: {
                  $year:
                    "$createdAt",
                },

                month: {
                  $month:
                    "$createdAt",
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