import { Request, Response } from "express";
import crypto from "crypto";
import { User } from "../models/User";
import { Student } from "../models/Student";
import { Admin } from "../models/Admin";
import { asyncHandler } from "../utils/asyncHandler";
import { ApiError } from "../utils/ApiError";
import { success } from "../utils/apiResponse";
import { signToken } from "../utils/jwt";
import { env } from "../config/env";
import { generateUniqueStudentId, hashPassword, findUserByEmailOrStudentId, assertActive } from "../services/auth.service";

function setAuthCookie(res: Response, token: string) {
  res.cookie(env.cookieName, token, {
    httpOnly: true,
    secure: env.nodeEnv === "production",
    sameSite: "lax",
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });
}

export const registerStudent = asyncHandler(async (req: Request, res: Response) => {
  const { fullName, email, phone, password, dateOfBirth, gender, address, class: className, group, course } = req.body;

  const existing = await User.findOne({ email: email.toLowerCase() });
  if (existing) throw new ApiError(409, "An account with this email already exists");

  const passwordHash = await hashPassword(password);
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

  const token = signToken({ userId: String(user._id), role: "STUDENT" });
  setAuthCookie(res, token);

  return success(
    res,
    { token, student: { id: student._id, studentId: student.studentId, fullName: student.fullName, email: user.email } },
    "Registration successful",
    201
  );
});

export const login = asyncHandler(async (req: Request, res: Response) => {
  const { identifier, password } = req.body;

  const user = await findUserByEmailOrStudentId(identifier);
  if (!user) throw new ApiError(401, "Invalid credentials");

  assertActive(user.isActive);

  const isMatch = await user.comparePassword(password);
  if (!isMatch) throw new ApiError(401, "Invalid credentials");

  user.lastLoginAt = new Date();
  await user.save();

  const token = signToken({ userId: String(user._id), role: user.role });
  setAuthCookie(res, token);

  let profile: unknown = null;
  if (user.role === "STUDENT") {
    profile = await Student.findOne({ user: user._id }).populate("course", "title");
  } else {
    profile = await Admin.findOne({ user: user._id });
  }

  return success(res, { token, role: user.role, profile }, "Login successful");
});

export const adminLogin = asyncHandler(async (req: Request, res: Response) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email: email.toLowerCase(), role: "ADMIN" }).select("+passwordHash");
  if (!user) throw new ApiError(401, "Invalid admin credentials");

  assertActive(user.isActive);

  const isMatch = await user.comparePassword(password);
  if (!isMatch) throw new ApiError(401, "Invalid admin credentials");

  const token = signToken({ userId: String(user._id), role: "ADMIN" });
  setAuthCookie(res, token);

  const profile = await Admin.findOne({ user: user._id });
  return success(res, { token, role: "ADMIN", profile }, "Admin login successful");
});

export const logout = asyncHandler(async (req: Request, res: Response) => {
  res.clearCookie(env.cookieName);
  return success(res, {}, "Logged out successfully");
});

export const me = asyncHandler(async (req: Request, res: Response) => {
  if (!req.auth) throw new ApiError(401, "Not authenticated");
  const user = await User.findById(req.auth.userId);
  if (!user) throw new ApiError(404, "User not found");

  let profile: unknown = null;
  if (user.role === "STUDENT") {
    profile = await Student.findOne({ user: user._id }).populate("course", "title");
  } else {
    profile = await Admin.findOne({ user: user._id });
  }

  return success(res, { email: user.email, role: user.role, profile });
});

export const forgotPassword = asyncHandler(async (req: Request, res: Response) => {
  const { email } = req.body;
  const user = await User.findOne({ email: email.toLowerCase() });

  // Always respond the same way to avoid leaking which emails exist
  if (!user) {
    return success(res, {}, "If that email exists, a reset link has been sent");
  }

  const rawToken = crypto.randomBytes(32).toString("hex");
  user.resetPasswordToken = crypto.createHash("sha256").update(rawToken).digest("hex");
  user.resetPasswordExpires = new Date(Date.now() + 60 * 60 * 1000); // 1 hour
  await user.save();

  // In production this would be emailed. For local dev we return it directly.
  const resetUrl = `${env.clientUrl}/reset-password/${rawToken}`;
  console.log(`[DEV] Password reset link for ${user.email}: ${resetUrl}`);

  return success(res, env.nodeEnv === "development" ? { resetUrl } : {}, "If that email exists, a reset link has been sent");
});

export const resetPassword = asyncHandler(async (req: Request, res: Response) => {
  const { token } = req.params;
  const { password } = req.body;

  const hashedToken = crypto.createHash("sha256").update(token).digest("hex");
  const user = await User.findOne({
    resetPasswordToken: hashedToken,
    resetPasswordExpires: { $gt: new Date() },
  }).select("+passwordHash +resetPasswordToken +resetPasswordExpires");

  if (!user) throw new ApiError(400, "Reset link is invalid or has expired");

  user.passwordHash = await hashPassword(password);
  user.resetPasswordToken = undefined;
  user.resetPasswordExpires = undefined;
  await user.save();

  return success(res, {}, "Password has been reset. Please log in with your new password.");
});
