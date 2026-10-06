import { Request, Response } from "express";

import { Student } from "../models/Student";
import { Course } from "../models/Course";
import { Teacher } from "../models/Teacher";
import { Fee } from "../models/Fee";
import { Attendance } from "../models/Attendance";
import { ContactMessage } from "../models/ContactMessage";
import { Notice } from "../models/Notice";

import { asyncHandler } from "../utils/asyncHandler";
import { success } from "../utils/apiResponse";

export const publicStats = asyncHandler(
  async (req: Request, res: Response) => {
    const [totalStudents, totalTeachers, totalCourses] =
      await Promise.all([
        Student.countDocuments({ isActive: true }),
        Teacher.countDocuments({ isActive: true }),
        Course.countDocuments({ isPublished: true }),
      ]);

    return success(res, {
      totalStudents,
      totalTeachers,
      totalCourses,
      successfulStudents: totalStudents,
    });
  }
);

export const adminDashboardStats = asyncHandler(
  async (req: Request, res: Response) => {
    const startOfDay = new Date();
    startOfDay.setHours(0, 0, 0, 0);

    const endOfDay = new Date();
    endOfDay.setHours(23, 59, 59, 999);

    // Last 6 months
    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 5);
    sixMonthsAgo.setDate(1);
    sixMonthsAgo.setHours(0, 0, 0, 0);

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
      // Students
      Student.countDocuments(),

      Student.countDocuments({
        isActive: true,
      }),

      // Courses
      Course.countDocuments(),

      // Teachers
      Teacher.countDocuments(),

      // Number of unpaid/partial fee records
      Fee.countDocuments({
        status: { $ne: "PAID" },
      }),

      // Today's attendance records
      Attendance.countDocuments({
        date: {
          $gte: startOfDay,
          $lte: endOfDay,
        },
      }),

      // Unread messages
      ContactMessage.countDocuments({
        isRead: false,
      }),

      // Latest notices
      Notice.find()
        .sort("-date")
        .limit(5)
        .lean(),

      // Overall fee summary
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

      // Monthly fee collection
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
              $ifNull: ["$amount", 0],
            },
            amountPaid: {
              $ifNull: ["$amountPaid", 0],
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

      // Course-wise student count
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

      // Monthly student growth
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

    const feeTotals = feeOverview[0] || {
      totalFee: 0,
      totalPaid: 0,
      totalDue: 0,
      totalRecords: 0,
    };

    const inactiveStudents =
      Math.max(
        totalStudents - activeStudents,
        0
      );

    return success(res, {
      // Existing dashboard stats
      totalStudents,
      activeStudents,
      totalCourses,
      totalTeachers,
      pendingFees,
      todayAttendance,
      newMessages,
      latestNotices,

      // Analytics
      studentStatus: {
        active: activeStudents,
        inactive: inactiveStudents,
      },

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

export const studentGrowthChart = asyncHandler(
  async (req: Request, res: Response) => {
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

    return success(res, results);
  }
);