
import { Request, Response } from "express";
import crypto from "crypto";

import { EnrollmentRequest } from "../models/EnrollmentRequest";
import { Course } from "../models/Course";
import { User } from "../models/User";
import { Student } from "../models/Student";

import { asyncHandler } from "../utils/asyncHandler";
import { ApiError } from "../utils/ApiError";
import { success } from "../utils/apiResponse";

import {
  generateUniqueStudentId,
  hashPassword,
} from "../services/auth.service";

import { sendEnrollmentApprovalEmail } from "../services/email.service";
import { env } from "../config/env";

export const approveEnrollmentRequest = asyncHandler(
  async (req: Request, res: Response) => {
    const enrollment = await EnrollmentRequest.findById(req.params.id);

    if (!enrollment) {
      throw new ApiError(404, "Enrollment request not found");
    }

    if (enrollment.status !== "PENDING") {
      throw new ApiError(
        409,
        "This enrollment request has already been reviewed"
      );
    }

    const existingUser = await User.findOne({
      email: enrollment.email,
    });

    if (existingUser) {
      throw new ApiError(
        409,
        "An account with this email already exists"
      );
    }

    const course = await Course.findById(enrollment.course);

    if (!course) {
      throw new ApiError(404, "Course not found");
    }

    if (
      course.seatCapacity > 0 &&
      course.enrolledCount >= course.seatCapacity
    ) {
      throw new ApiError(409, "No seats are currently available");
    }

    const rawToken = crypto.randomBytes(32).toString("hex");

    const hashedToken = crypto
      .createHash("sha256")
      .update(rawToken)
      .digest("hex");

    const temporaryRandomPassword = crypto
      .randomBytes(32)
      .toString("hex");

    const passwordHash = await hashPassword(
      temporaryRandomPassword
    );

    let createdUserId: string | undefined;
    let createdStudentId: string | undefined;
    let courseCountUpdated = false;

    try {
      // 1. Create student login account
      const user = await User.create({
        email: enrollment.email,
        passwordHash,
        role: "STUDENT",
        resetPasswordToken: hashedToken,
        resetPasswordExpires: new Date(
          Date.now() + 60 * 60 * 1000
        ),
      });

      createdUserId = String(user._id);

      // 2. Generate student ID
      const studentId = await generateUniqueStudentId();

      // 3. Create student profile
      const student = await Student.create({
        user: user._id,
        studentId,
        fullName: enrollment.fullName,
        phone: enrollment.phone,
        dateOfBirth: enrollment.dateOfBirth,
        gender: enrollment.gender,
        address: enrollment.address,
        class: enrollment.class,
        group: enrollment.group,
        course: enrollment.course,
        courses: [enrollment.course],
      });

      createdStudentId = String(student._id);

      // 4. Update course enrollment count
      await Course.updateOne(
        { _id: course._id },
        { $inc: { enrolledCount: 1 } }
      );

      courseCountUpdated = true;

      // 5. Approve enrollment BEFORE sending email
      enrollment.status = "APPROVED";
      enrollment.reviewedBy = req.auth!.userId as never;
      enrollment.reviewedAt = new Date();
      enrollment.adminNote = req.body.adminNote
        ? String(req.body.adminNote).trim()
        : "Payment verified and enrollment approved";

      await enrollment.save();

      // 6. Prepare password setup link
      const resetUrl =
        `${env.clientUrl}/reset-password/${rawToken}`;

      // 7. Send response without waiting for SMTP
      setImmediate(() => {
        sendEnrollmentApprovalEmail(
          enrollment.email,
          enrollment.fullName,
          course.title,
          student.studentId,
          resetUrl
        )
          .then(() => {
            console.log(
              `[ENROLLMENT EMAIL] Sent successfully to ${enrollment.email}`
            );
          })
          .catch((emailError) => {
            console.error(
              `[ENROLLMENT EMAIL] Failed for ${enrollment.email}:`,
              emailError
            );
          });
      });

      return success(
        res,
        {
          enrollmentId: enrollment._id,
          studentId: student.studentId,
          email: user.email,
          course: course.title,
          status: enrollment.status,
          emailStatus: "QUEUED",
        },
        "Enrollment approved. Student account created. Activation email is being processed."
      );

    } catch (error) {
      // Roll back database changes only when approval itself fails
      if (courseCountUpdated) {
        await Course.updateOne(
          { _id: course._id },
          { $inc: { enrolledCount: -1 } }
        );
      }

      if (createdStudentId) {
        await Student.deleteOne({ _id: createdStudentId });
      }

      if (createdUserId) {
        await User.deleteOne({ _id: createdUserId });
      }

      throw error;
    }
  }
);
