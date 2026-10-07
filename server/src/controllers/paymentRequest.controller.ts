import { Request, Response } from "express";
import mongoose from "mongoose";

import { env } from "../config/env";

import { Fee } from "../models/Fee";
import { Student } from "../models/Student";
import { PaymentRequest } from "../models/PaymentRequest";

import { asyncHandler } from "../utils/asyncHandler";
import { success } from "../utils/apiResponse";
import { ApiError } from "../utils/ApiError";

/* =========================================================
   HELPERS
========================================================= */

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
   GET STUDENT OUTSTANDING FEES
========================================================= */

async function getStudentOutstandingFees(
  studentId: mongoose.Types.ObjectId
) {
  const fees = await Fee.find({
    student: studentId,
  }).sort({
    billingMonth: 1,
    createdAt: 1,
  });

  return fees.filter((fee) => {
    const amount = Number(
      fee.amount || 0
    );

    const paid = Number(
      fee.amountPaid || 0
    );

    return amount > paid;
  });
}

/* =========================================================
   CALCULATE TOTAL STUDENT DUE
========================================================= */

async function getStudentTotalDue(
  studentId: mongoose.Types.ObjectId
) {
  const fees =
    await getStudentOutstandingFees(
      studentId
    );

  return fees.reduce(
    (total, fee) => {
      const amount = Number(
        fee.amount || 0
      );

      const paid = Number(
        fee.amountPaid || 0
      );

      const due = Math.max(
        amount - paid,
        0
      );

      return total + due;
    },
    0
  );
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
   CREATE OVERALL PAYMENT REQUEST
========================================================= */

export const createPaymentRequest =
  asyncHandler(
    async (
      req: Request,
      res: Response
    ) => {
      const {
        amount,
        senderNumber,
        transactionId,
      } = req.body;

      const student =
        await getOwnStudent(req);

      const paymentAmount =
        normalizeAmount(amount);

      const totalDue =
        await getStudentTotalDue(
          student._id
        );

      if (totalDue <= 0) {
        throw new ApiError(
          400,
          "You do not have any outstanding fee"
        );
      }

      if (
        paymentAmount > totalDue
      ) {
        throw new ApiError(
          400,
          `Payment amount cannot be greater than your total outstanding fee of ${totalDue}`
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

      /* -----------------------------------------
         CHECK DUPLICATE TRANSACTION ID
      ----------------------------------------- */

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

      /* -----------------------------------------
         ONLY ONE PENDING PAYMENT PER STUDENT
      ----------------------------------------- */

      const pendingRequest =
        await PaymentRequest.findOne({
          student: student._id,
          status: "PENDING",
        });

      if (pendingRequest) {
        throw new ApiError(
          409,
          "You already have a payment request waiting for admin verification"
        );
      }

      /* -----------------------------------------
         CREATE OVERALL PAYMENT REQUEST
      ----------------------------------------- */

      const request =
        await PaymentRequest.create({
          student: student._id,
          amount: paymentAmount,
          senderNumber:
            normalizedSender,
          transactionId:
            normalizedTransactionId,
          status: "PENDING",
          allocations: [],
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
            "allocations.fee",
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
            "allocations.fee",
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
            "allocations.fee",
            "amount amountPaid billingMonth dueDate status paymentDate paymentMethod transactionId"
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
   APPROVE OVERALL PAYMENT
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

      const session =
        await mongoose.startSession();

      try {
        let populatedRequest:
          | any
          | null = null;

        await session.withTransaction(
          async () => {
            /* -----------------------------------------
               GET PAYMENT REQUEST
            ----------------------------------------- */

            const paymentRequest =
              await PaymentRequest.findById(
                id
              ).session(session);

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

            /* -----------------------------------------
               GET ALL OUTSTANDING FEES
               OLDEST FIRST
            ----------------------------------------- */

            const fees =
              await Fee.find({
                student:
                  paymentRequest.student,
              })
                .sort({
                  billingMonth: 1,
                  createdAt: 1,
                })
                .session(session);

            let remainingPayment =
              Number(
                paymentRequest.amount || 0
              );

            if (
              !Number.isFinite(
                remainingPayment
              ) ||
              remainingPayment <= 0
            ) {
              throw new ApiError(
                400,
                "Invalid payment amount"
              );
            }

            const allocations: Array<{
              fee: mongoose.Types.ObjectId;
              amount: number;
            }> = [];

            /* -----------------------------------------
               DISTRIBUTE PAYMENT ACROSS ALL FEES
            ----------------------------------------- */

            for (const fee of fees) {
              if (
                remainingPayment <= 0
              ) {
                break;
              }

              const feeAmount = Number(
                fee.amount || 0
              );

              const currentPaid =
                Number(
                  fee.amountPaid || 0
                );

              const currentDue =
                Math.max(
                  feeAmount -
                    currentPaid,
                  0
                );

              if (currentDue <= 0) {
                continue;
              }

              const allocationAmount =
                Math.min(
                  remainingPayment,
                  currentDue
                );

              const newPaid =
                currentPaid +
                allocationAmount;

              let newStatus:
                | "PAID"
                | "PENDING"
                | "PARTIAL";

              if (
                newPaid >= feeAmount
              ) {
                newStatus = "PAID";
              } else if (
                newPaid > 0
              ) {
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

              await fee.save({
                session,
              });

              allocations.push({
                fee: fee._id,
                amount:
                  allocationAmount,
              });

              remainingPayment -=
                allocationAmount;
            }

            /* -----------------------------------------
               PAYMENT CANNOT EXCEED TOTAL DUE
            ----------------------------------------- */

            if (
              remainingPayment >
              0.000001
            ) {
              throw new ApiError(
                400,
                "Payment amount is greater than the student's current total outstanding fee"
              );
            }

            /* -----------------------------------------
               SAVE ALLOCATION HISTORY
            ----------------------------------------- */

            paymentRequest.allocations =
              allocations;

            paymentRequest.status =
              "APPROVED";

            paymentRequest.reviewedBy =
              req.auth?.userId as any;

            paymentRequest.reviewedAt =
              new Date();

            await paymentRequest.save({
              session,
            });

            /* -----------------------------------------
               GET POPULATED RESULT
            ----------------------------------------- */

            populatedRequest =
              await PaymentRequest.findById(
                paymentRequest._id
              )
                .session(session)
                .populate(
                  "student",
                  "fullName studentId phone class group"
                )
                .populate(
                  "allocations.fee",
                  "amount amountPaid billingMonth dueDate status paymentDate paymentMethod transactionId"
                )
                .populate(
                  "reviewedBy",
                  "email"
                );
          }
        );

        return success(
          res,
          populatedRequest,
          "Payment approved and automatically distributed across the student's fees"
        );
      } finally {
        await session.endSession();
      }
    }
  );

/* =========================================================
   ADMIN
   REJECT PAYMENT
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
            "allocations.fee",
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