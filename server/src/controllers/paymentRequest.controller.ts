import { Request, Response } from "express";
import mongoose from "mongoose";

import { env } from "../config/env";

import { Fee } from "../models/Fee";
import { Student } from "../models/Student";
import { PaymentRequest } from "../models/PaymentRequest";

import { asyncHandler } from "../utils/asyncHandler";
import { success } from "../utils/apiResponse";
import { ApiError } from "../utils/ApiError";

function normalizeAmount(
  value: unknown
): number {
  const amount = Number(value);

  if (
    !Number.isFinite(amount) ||
    amount <= 0
  ) {
    throw new ApiError(
      400,
      "Payment amount must be greater than 0"
    );
  }

  return amount;
}

function normalizeSenderNumber(
  value: unknown
): string {
  const number = String(value || "")
    .trim()
    .replace(/\s+/g, "");

  if (!number) {
    throw new ApiError(
      400,
      "Sender bKash number is required"
    );
  }

  if (
    !/^01[3-9]\d{8}$/.test(number)
  ) {
    throw new ApiError(
      400,
      "Enter a valid Bangladeshi mobile number"
    );
  }

  return number;
}

function normalizeTransactionId(
  value: unknown
): string {
  const transactionId = String(
    value || ""
  )
    .trim()
    .toUpperCase();

  if (!transactionId) {
    throw new ApiError(
      400,
      "Transaction ID is required"
    );
  }

  if (
    transactionId.length < 4 ||
    transactionId.length > 100
  ) {
    throw new ApiError(
      400,
      "Invalid transaction ID"
    );
  }

  return transactionId;
}

async function getOwnStudent(
  req: Request
) {
  const userId = req.auth?.userId;

  if (!userId) {
    throw new ApiError(
      401,
      "Authentication required"
    );
  }

  const student =
    await Student.findOne({
      user: userId,
    }).select(
      "_id fullName studentId class group"
    );

  if (!student) {
    throw new ApiError(
      404,
      "Student profile not found"
    );
  }

  return student;
}

/* =========================================================
   STUDENT
   PAYMENT INFORMATION
========================================================= */

export const paymentInfo =
  asyncHandler(
    async (
      _req: Request,
      res: Response
    ) => {
      return success(
        res,
        {
          bkashNumber:
            env.bkashNumber,
        },
        "Payment information loaded successfully"
      );
    }
  );

/* =========================================================
   STUDENT
   CREATE PAYMENT REQUEST
========================================================= */

export const createPaymentRequest =
  asyncHandler(
    async (
      req: Request,
      res: Response
    ) => {
      const {
        feeId,
        amount,
        senderNumber,
        transactionId,
      } = req.body;

      if (
        !feeId ||
        !mongoose.Types.ObjectId.isValid(
          String(feeId)
        )
      ) {
        throw new ApiError(
          400,
          "Valid fee ID is required"
        );
      }

      const student =
        await getOwnStudent(req);

      const fee =
        await Fee.findById(feeId);

      if (!fee) {
        throw new ApiError(
          404,
          "Fee not found"
        );
      }

      if (
        String(fee.student) !==
        String(student._id)
      ) {
        throw new ApiError(
          403,
          "You can only pay your own fee"
        );
      }

      const feeAmount = Number(
        fee.amount || 0
      );

      const alreadyPaid = Number(
        fee.amountPaid || 0
      );

      const due = Math.max(
        feeAmount - alreadyPaid,
        0
      );

      if (due <= 0) {
        throw new ApiError(
          400,
          "This fee has already been fully paid"
        );
      }

      const paymentAmount =
        normalizeAmount(amount);

      if (paymentAmount > due) {
        throw new ApiError(
          400,
          `Payment amount cannot be greater than the current due amount of ${due}`
        );
      }

      const normalizedSender =
        normalizeSenderNumber(
          senderNumber
        );

      const normalizedTransactionId =
        normalizeTransactionId(
          transactionId
        );

      const existingTransaction =
        await PaymentRequest.findOne({
          transactionId:
            normalizedTransactionId,
        });

      if (existingTransaction) {
        throw new ApiError(
          409,
          "This transaction ID has already been submitted"
        );
      }

      const pendingRequest =
        await PaymentRequest.findOne({
          fee: fee._id,
          status: "PENDING",
        });

      if (pendingRequest) {
        throw new ApiError(
          409,
          "You already have a payment request waiting for admin verification for this fee"
        );
      }

      const request =
        await PaymentRequest.create({
          fee: fee._id,
          student: student._id,
          amount: paymentAmount,
          senderNumber:
            normalizedSender,
          transactionId:
            normalizedTransactionId,
          status: "PENDING",
        });

      const populated =
        await PaymentRequest.findById(
          request._id
        )
          .populate(
            "student",
            "fullName studentId class group"
          )
          .populate(
            "fee",
            "amount amountPaid billingMonth dueDate status"
          );

      return success(
        res,
        populated,
        "Payment submitted for verification",
        201
      );
    }
  );

/* =========================================================
   STUDENT
   MY PAYMENT REQUESTS
========================================================= */

export const myPaymentRequests =
  asyncHandler(
    async (
      req: Request,
      res: Response
    ) => {
      const student =
        await getOwnStudent(req);

      const requests =
        await PaymentRequest.find({
          student: student._id,
        })
          .populate(
            "fee",
            "amount amountPaid billingMonth dueDate status"
          )
          .sort({
            createdAt: -1,
          });

      return success(
        res,
        requests,
        "Payment requests loaded successfully"
      );
    }
  );

/* =========================================================
   ADMIN
   LIST PAYMENT REQUESTS
========================================================= */

export const listPaymentRequests =
  asyncHandler(
    async (
      req: Request,
      res: Response
    ) => {
      const status =
        typeof req.query.status ===
        "string"
          ? req.query.status
          : undefined;

      const filter: Record<
        string,
        unknown
      > = {};

      if (
        status &&
        [
          "PENDING",
          "APPROVED",
          "REJECTED",
        ].includes(status)
      ) {
        filter.status = status;
      }

      const requests =
        await PaymentRequest.find(
          filter
        )
          .populate(
            "student",
            "fullName studentId phone class group"
          )
          .populate(
            "fee",
            "amount amountPaid billingMonth dueDate status"
          )
          .populate(
            "reviewedBy",
            "email"
          )
          .sort({
            createdAt: -1,
          });

      return success(
        res,
        requests,
        "Payment requests loaded successfully"
      );
    }
  );

/* =========================================================
   ADMIN
   APPROVE
========================================================= */

export const approvePaymentRequest =
  asyncHandler(
    async (
      req: Request,
      res: Response
    ) => {
      const { id } = req.params;

      if (
        !mongoose.Types.ObjectId.isValid(
          id
        )
      ) {
        throw new ApiError(
          400,
          "Invalid payment request ID"
        );
      }

      const paymentRequest =
        await PaymentRequest.findById(
          id
        );

      if (!paymentRequest) {
        throw new ApiError(
          404,
          "Payment request not found"
        );
      }

      if (
        paymentRequest.status !==
        "PENDING"
      ) {
        throw new ApiError(
          400,
          `This payment request is already ${paymentRequest.status.toLowerCase()}`
        );
      }

      const fee =
        await Fee.findById(
          paymentRequest.fee
        );

      if (!fee) {
        throw new ApiError(
          404,
          "Associated fee not found"
        );
      }

      const feeAmount = Number(
        fee.amount || 0
      );

      const currentPaid = Number(
        fee.amountPaid || 0
      );

      const paymentAmount =
        Number(
          paymentRequest.amount || 0
        );

      const currentDue = Math.max(
        feeAmount - currentPaid,
        0
      );

      if (currentDue <= 0) {
        throw new ApiError(
          400,
          "This fee has already been fully paid"
        );
      }

      if (
        paymentAmount > currentDue
      ) {
        throw new ApiError(
          400,
          "Payment amount is greater than the current fee due"
        );
      }

      const newPaid =
        currentPaid +
        paymentAmount;

      let newStatus:
        | "PAID"
        | "PENDING"
        | "PARTIAL";

      if (newPaid >= feeAmount) {
        newStatus = "PAID";
      } else if (newPaid > 0) {
        newStatus = "PARTIAL";
      } else {
        newStatus = "PENDING";
      }

      fee.amountPaid =
        newPaid;

      fee.status =
        newStatus;

      fee.paymentDate =
        new Date();

      fee.paymentMethod =
        "BKASH";

      fee.transactionId =
        paymentRequest.transactionId;

      await fee.save();

      paymentRequest.status =
        "APPROVED";

      paymentRequest.reviewedBy =
        req.auth?.userId as any;

      paymentRequest.reviewedAt =
        new Date();

      await paymentRequest.save();

      const populated =
        await PaymentRequest.findById(
          paymentRequest._id
        )
          .populate(
            "student",
            "fullName studentId phone class group"
          )
          .populate(
            "fee",
            "amount amountPaid billingMonth dueDate status paymentDate paymentMethod transactionId"
          )
          .populate(
            "reviewedBy",
            "email"
          );

      return success(
        res,
        populated,
        "Payment approved and fee updated successfully"
      );
    }
  );

/* =========================================================
   ADMIN
   REJECT
========================================================= */

export const rejectPaymentRequest =
  asyncHandler(
    async (
      req: Request,
      res: Response
    ) => {
      const { id } = req.params;

      if (
        !mongoose.Types.ObjectId.isValid(
          id
        )
      ) {
        throw new ApiError(
          400,
          "Invalid payment request ID"
        );
      }

      const paymentRequest =
        await PaymentRequest.findById(
          id
        );

      if (!paymentRequest) {
        throw new ApiError(
          404,
          "Payment request not found"
        );
      }

      if (
        paymentRequest.status !==
        "PENDING"
      ) {
        throw new ApiError(
          400,
          `This payment request is already ${paymentRequest.status.toLowerCase()}`
        );
      }

      const reason =
        typeof req.body?.reason ===
        "string"
          ? req.body.reason.trim()
          : "";

      paymentRequest.status =
        "REJECTED";

      paymentRequest.reviewedBy =
        req.auth?.userId as any;

      paymentRequest.reviewedAt =
        new Date();

      paymentRequest.rejectionReason =
        reason || undefined;

      await paymentRequest.save();

      const populated =
        await PaymentRequest.findById(
          paymentRequest._id
        )
          .populate(
            "student",
            "fullName studentId phone class group"
          )
          .populate(
            "fee",
            "amount amountPaid billingMonth dueDate status"
          )
          .populate(
            "reviewedBy",
            "email"
          );

      return success(
        res,
        populated,
        "Payment request rejected"
      );
    }
  );