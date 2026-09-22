import { Request, Response } from "express";
import { Student } from "../models/Student";
import { User } from "../models/User";
import { asyncHandler } from "../utils/asyncHandler";
import { success } from "../utils/apiResponse";
import { ApiError } from "../utils/ApiError";
import { hashPassword, generateUniqueStudentId } from "../services/auth.service";

export const listStudents = asyncHandler(async (req: Request, res: Response) => {
  const page = Math.max(1, Number(req.query.page) || 1);
  const limit = Math.min(100, Math.max(1, Number(req.query.limit) || 10));
  const search = (req.query.search as string) || "";
  const status = req.query.status as string | undefined;
  const course = req.query.course as string | undefined;

  const filter: Record<string, unknown> = {};
  if (search) {
    filter.$or = [
      { fullName: { $regex: search, $options: "i" } },
      { studentId: { $regex: search, $options: "i" } },
    ];
  }
  if (status) filter.isActive = status === "active";
  if (course) filter.course = course;

  const [data, total] = await Promise.all([
    Student.find(filter)
      .populate("user", "email isActive")
      .populate("course", "title")
      .sort("-createdAt")
      .skip((page - 1) * limit)
      .limit(limit),
    Student.countDocuments(filter),
  ]);

  return success(res, { data, total, page, limit, totalPages: Math.ceil(total / limit) || 1 });
});

export const getStudent = asyncHandler(async (req: Request, res: Response) => {
  const student = await Student.findById(req.params.id).populate("user", "email isActive").populate("course", "title fee");
  if (!student) throw new ApiError(404, "Student not found");
  return success(res, student);
});

// Admin creates a student directly (separate from public self-registration)
export const createStudent = asyncHandler(async (req: Request, res: Response) => {
  const { fullName, email, phone, password, dateOfBirth, gender, address, class: className, group, course } = req.body;

  const existing = await User.findOne({ email: email.toLowerCase() });
  if (existing) throw new ApiError(409, "An account with this email already exists");

  const passwordHash = await hashPassword(password || "Student123!");
  const user = await User.create({ email: email.toLowerCase(), passwordHash, role: "STUDENT" });
  const studentId = await generateUniqueStudentId();

  const student = await Student.create({
    user: user._id,
    studentId,
    fullName,
    phone,
    dateOfBirth,
    gender,
    address,
    class: className,
    group,
    course: course || undefined,
  });

  return success(res, student, "Student created successfully", 201);
});

export const updateStudent = asyncHandler(async (req: Request, res: Response) => {
  const allowed = ["fullName", "phone", "address", "class", "group", "course", "profilePhoto"];
  const updates: Record<string, unknown> = {};
  for (const key of allowed) if (key in req.body) updates[key] = req.body[key];

  const student = await Student.findByIdAndUpdate(req.params.id, updates, { new: true, runValidators: true });
  if (!student) throw new ApiError(404, "Student not found");
  return success(res, student, "Student updated successfully");
});

export const deleteStudent = asyncHandler(async (req: Request, res: Response) => {
  const student = await Student.findByIdAndDelete(req.params.id);
  if (!student) throw new ApiError(404, "Student not found");
  await User.findByIdAndDelete(student.user);
  return success(res, {}, "Student deleted successfully");
});

export const toggleStudentActive = asyncHandler(async (req: Request, res: Response) => {
  const student = await Student.findById(req.params.id);
  if (!student) throw new ApiError(404, "Student not found");
  student.isActive = !student.isActive;
  await student.save();
  await User.findByIdAndUpdate(student.user, { isActive: student.isActive });
  return success(res, student, `Student ${student.isActive ? "activated" : "deactivated"}`);
});

export const resetStudentPassword = asyncHandler(async (req: Request, res: Response) => {
  const { newPassword } = req.body;
  if (!newPassword || newPassword.length < 8) throw new ApiError(422, "New password must be at least 8 characters");

  const student = await Student.findById(req.params.id);
  if (!student) throw new ApiError(404, "Student not found");

  const passwordHash = await hashPassword(newPassword);
  await User.findByIdAndUpdate(student.user, { passwordHash });
  return success(res, {}, "Student password reset successfully");
});

// Student's own profile (self-service, limited fields)
export const getMyProfile = asyncHandler(async (req: Request, res: Response) => {
  const student = await Student.findOne({ user: req.auth!.userId }).populate("course", "title fee schedule");
  if (!student) throw new ApiError(404, "Student profile not found");
  return success(res, student);
});

export const updateMyProfile = asyncHandler(async (req: Request, res: Response) => {
  const allowed = ["phone", "address", "profilePhoto"]; // admin controls the rest
  const updates: Record<string, unknown> = {};
  for (const key of allowed) if (key in req.body) updates[key] = req.body[key];

  const student = await Student.findOneAndUpdate({ user: req.auth!.userId }, updates, { new: true, runValidators: true });
  if (!student) throw new ApiError(404, "Student profile not found");
  return success(res, student, "Profile updated successfully");
});

export const changeMyPassword = asyncHandler(async (req: Request, res: Response) => {
  const { currentPassword, newPassword } = req.body;
  if (!newPassword || newPassword.length < 8) throw new ApiError(422, "New password must be at least 8 characters");

  const user = await User.findById(req.auth!.userId).select("+passwordHash");
  if (!user) throw new ApiError(404, "User not found");

  const isMatch = await user.comparePassword(currentPassword);
  if (!isMatch) throw new ApiError(401, "Current password is incorrect");

  user.passwordHash = await hashPassword(newPassword);
  await user.save();
  return success(res, {}, "Password changed successfully");
});
