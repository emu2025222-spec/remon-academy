import bcrypt from "bcryptjs";
import crypto from "crypto";
import { User } from "../models/User";
import { Student } from "../models/Student";
import { ApiError } from "../utils/ApiError";

export async function generateUniqueStudentId(): Promise<string> {
  const year = new Date().getFullYear();
  const count = await Student.countDocuments();
  const serial = String(count + 1).padStart(4, "0");
  const candidate = `RA-${year}-${serial}`;
  const exists = await Student.findOne({ studentId: candidate });
  if (exists) {
    // extremely unlikely race — fall back to random suffix
    return `RA-${year}-${serial}-${crypto.randomBytes(2).toString("hex")}`;
  }
  return candidate;
}

export async function hashPassword(plain: string): Promise<string> {
  const salt = await bcrypt.genSalt(12);
  return bcrypt.hash(plain, salt);
}

export async function findUserByEmailOrStudentId(identifier: string) {
  const byEmail = await User.findOne({ email: identifier.toLowerCase() }).select("+passwordHash");
  if (byEmail) return byEmail;

  const student = await Student.findOne({ studentId: identifier });
  if (!student) return null;

  return User.findById(student.user).select("+passwordHash");
}

export function assertActive(isActive: boolean) {
  if (!isActive) throw new ApiError(403, "This account has been deactivated. Contact the academy office.");
}
