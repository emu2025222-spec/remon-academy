import { Request, Response } from "express";
import mongoose from "mongoose";

import { EnrollmentRequest } from "../models/EnrollmentRequest";
import { Course } from "../models/Course";
import { User } from "../models/User";

import { asyncHandler } from "../utils/asyncHandler";
import { ApiError } from "../utils/ApiError";
import { success } from "../utils/apiResponse";

/*
|--------------------------------------------------------------------------
| PUBLIC: SUBMIT ENROLLMENT REQUEST
|--------------------------------------------------------------------------
*/

export const createEnrollmentRequest = asyncHandler(
  async (req: Request, res: Response) => {
    const {
      fullName,
      email,
      phone,
      dateOfBirth,
      gender,
      address,
      class: className,
      group,
      courseId,
      paymentPlan,
      paymentMethod,
      senderNumber,
      transactionId,
    } = req.body;

    if (
      !fullName ||
      !email ||
      !phone ||
      !dateOfBirth ||
      !gender ||
      !address ||
      !className ||
      !courseId ||
      !paymentPlan ||
      !paymentMethod ||
      !senderNumber ||
      !transactionId
    ) {
      throw new ApiError(400, "Please complete all required fields");
    }

    if (!mongoose.Types.ObjectId.isValid(courseId)) {
      throw new ApiError(400, "Invalid course");
    }

    if (!["MALE", "FEMALE", "OTHER"].includes(gender)) {
      throw new ApiError(400, "Invalid gender");
    }

    if (!["MONTHLY", "FULL"].includes(paymentPlan)) {
      throw new ApiError(400, "Invalid payment plan");
    }

    if (!["ONLINE", "OFFLINE"].includes(paymentMethod)) {
      throw new ApiError(400, "Invalid payment method");
    }

    const normalizedEmail = String(email).trim().toLowerCase();
    const normalizedTransactionId = String(transactionId)
      .trim()
      .toUpperCase();

    const normalizedSenderNumber = String(senderNumber).trim();

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(normalizedEmail)) {
      throw new ApiError(400, "Please enter a valid email address");
    }

    if (!/^[0-9+\-\s]{10,20}$/.test(normalizedSenderNumber)) {
      throw new ApiError(400, "Please enter a valid bKash sender number");
    }

    if (normalizedTransactionId.length < 4) {
      throw new ApiError(400, "Please enter a valid transaction ID");
    }

    const dob = new Date(dateOfBirth);

    if (Number.isNaN(dob.getTime()) || dob >= new Date()) {
      throw new ApiError(400, "Please enter a valid date of birth");
    }

    const course = await Course.findOne({
      _id: courseId,
      isPublished: true,
    });

    if (!course) {
      throw new ApiError(404, "Course not found or not available");
    }

    const existingUser = await User.findOne({
      email: normalizedEmail,
    });

    if (existingUser) {
      throw new ApiError(
        409,
        "An account with this email already exists. Please contact the academy."
      );
    }

    const existingTransaction = await EnrollmentRequest.findOne({
      transactionId: normalizedTransactionId,
    });

    if (existingTransaction) {
      throw new ApiError(
        409,
        "This transaction ID has already been submitted"
      );
    }

    const existingPendingRequest = await EnrollmentRequest.findOne({
      email: normalizedEmail,
      course: course._id,
      status: "PENDING",
    });

    if (existingPendingRequest) {
      throw new ApiError(
        409,
        "You already have a pending enrollment request for this course"
      );
    }

    /*
     * IMPORTANT:
     * Course.fee is currently the only fee field in the Course model.
     * Do not accept an amount from the browser.
     *
     * Monthly plan uses the configured course fee.
     * Full-course pricing will be enabled after a separate
     * fullCourseFee field is added to the Course model.
     */

    if (paymentPlan === "FULL") {
      throw new ApiError(
        400,
        "Full course payment is not configured yet. Please select Monthly or contact the academy."
      );
    }

    const amount = course.fee;

    if (!Number.isFinite(amount) || amount <= 0) {
      throw new ApiError(400, "Course fee is not configured correctly");
    }

    const enrollment = await EnrollmentRequest.create({
      fullName: String(fullName).trim(),
      email: normalizedEmail,
      phone: String(phone).trim(),
      dateOfBirth: dob,
      gender,
      address: String(address).trim(),
      class: String(className).trim(),
      group: group ? String(group).trim() : undefined,

      course: course._id,
      courseTitle: course.title,

      paymentPlan,
      paymentMethod,
      amount,

      senderNumber: normalizedSenderNumber,
      transactionId: normalizedTransactionId,

      status: "PENDING",
    });

    return success(
      res,
      {
        enrollmentId: enrollment._id,
        status: enrollment.status,
        course: enrollment.courseTitle,
        amount: enrollment.amount,
        paymentPlan: enrollment.paymentPlan,
        paymentMethod: enrollment.paymentMethod,
      },
      "Enrollment request submitted. The academy will verify your payment.",
      201
    );
  }
);

/*
|--------------------------------------------------------------------------
| ADMIN: LIST ENROLLMENT REQUESTS
|--------------------------------------------------------------------------
*/

export const listEnrollmentRequests = asyncHandler(
  async (req: Request, res: Response) => {
    const page = Math.max(1, Number(req.query.page) || 1);
    const limit = Math.min(100, Math.max(1, Number(req.query.limit) || 20));

    const status = req.query.status
      ? String(req.query.status).toUpperCase()
      : undefined;

    const filter: Record<string, unknown> = {};

    if (status) {
      if (!["PENDING", "APPROVED", "REJECTED"].includes(status)) {
        throw new ApiError(400, "Invalid enrollment status");
      }

      filter.status = status;
    }

    const [requests, total] = await Promise.all([
      EnrollmentRequest.find(filter)
        .populate("course", "title slug fee")
        .populate("reviewedBy", "email")
        .sort({ createdAt: -1 })
        .skip((page - 1) * limit)
        .limit(limit),

      EnrollmentRequest.countDocuments(filter),
    ]);

    return success(res, {
      requests,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    }, "Enrollment requests fetched successfully");
  }
);

/*
|--------------------------------------------------------------------------
| ADMIN: GET SINGLE ENROLLMENT REQUEST
|--------------------------------------------------------------------------
*/

export const getEnrollmentRequest = asyncHandler(
  async (req: Request, res: Response) => {
    const enrollment = await EnrollmentRequest.findById(req.params.id)
      .populate("course", "title slug fee")
      .populate("reviewedBy", "email");

    if (!enrollment) {
      throw new ApiError(404, "Enrollment request not found");
    }

    return success(
      res,
      enrollment,
      "Enrollment request fetched successfully"
    );
  }
);

/*
|--------------------------------------------------------------------------
| ADMIN: REJECT ENROLLMENT REQUEST
|--------------------------------------------------------------------------
*/

export const rejectEnrollmentRequest = asyncHandler(
  async (req: Request, res: Response) => {
    const { adminNote } = req.body;

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

    enrollment.status = "REJECTED";
    enrollment.adminNote = adminNote
      ? String(adminNote).trim()
      : "Payment could not be verified";

    enrollment.reviewedBy = new mongoose.Types.ObjectId(
      req.auth!.userId
    );

    enrollment.reviewedAt = new Date();

    await enrollment.save();

    return success(
      res,
      enrollment,
      "Enrollment request rejected successfully"
    );
  }
);