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

export const publicStats = asyncHandler(async (req: Request, res: Response) => {
  const [totalStudents, totalTeachers, totalCourses] = await Promise.all([
    Student.countDocuments({ isActive: true }),
    Teacher.countDocuments({ isActive: true }),
    Course.countDocuments({ isPublished: true }),
  ]);
  // "Successful students" is a curated figure admins can adjust via settings later;
  // for now, approximate using active student count.
  return success(res, {
    totalStudents,
    totalTeachers,
    totalCourses,
    successfulStudents: totalStudents,
  });
});

export const adminDashboardStats = asyncHandler(async (req: Request, res: Response) => {
  const startOfDay = new Date();
  startOfDay.setHours(0, 0, 0, 0);
  const endOfDay = new Date();
  endOfDay.setHours(23, 59, 59, 999);

  const [totalStudents, activeStudents, totalCourses, totalTeachers, pendingFees, todayAttendance, newMessages, latestNotices] =
    await Promise.all([
      Student.countDocuments(),
      Student.countDocuments({ isActive: true }),
      Course.countDocuments(),
      Teacher.countDocuments(),
      Fee.countDocuments({ status: { $ne: "PAID" } }),
      Attendance.countDocuments({ date: { $gte: startOfDay, $lte: endOfDay } }),
      ContactMessage.countDocuments({ isRead: false }),
      Notice.find().sort("-date").limit(5),
    ]);

  return success(res, {
    totalStudents,
    activeStudents,
    totalCourses,
    totalTeachers,
    pendingFees,
    todayAttendance,
    newMessages,
    latestNotices,
  });
});

export const studentGrowthChart = asyncHandler(async (req: Request, res: Response) => {
  const results = await Student.aggregate([
    {
      $group: {
        _id: { year: { $year: "$createdAt" }, month: { $month: "$createdAt" } },
        count: { $sum: 1 },
      },
    },
    { $sort: { "_id.year": 1, "_id.month": 1 } },
    { $limit: 12 },
  ]);
  return success(res, results);
});
