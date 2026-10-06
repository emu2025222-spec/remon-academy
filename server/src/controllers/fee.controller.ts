import { Request, Response } from "express";

import { Fee } from "../models/Fee";
import { Student } from "../models/Student";

import { makeCrudControllers } from "../utils/crudFactory";
import { asyncHandler } from "../utils/asyncHandler";
import { success } from "../utils/apiResponse";
import { ApiError } from "../utils/ApiError";

const base = makeCrudControllers(Fee, {
  populate: ["student", "course"],
});

/**
 * ---------------------------------------------------------
 * Helpers
 * ---------------------------------------------------------
 */

const calculateStatus = (
  amount: number,
  amountPaid: number
): "PAID" | "PENDING" | "PARTIAL" => {
  if (amountPaid >= amount && amount > 0) {
    return "PAID";
  }

  if (amountPaid > 0) {
    return "PARTIAL";
  }

  return "PENDING";
};

const normalizeAmount = (value: unknown): number => {
  const amount = Number(value);

  if (!Number.isFinite(amount) || amount < 0) {
    return 0;
  }

  return amount;
};

const validateBillingMonth = (
  billingMonth?: unknown
): string | undefined => {
  if (
    billingMonth === undefined ||
    billingMonth === null ||
    billingMonth === ""
  ) {
    return undefined;
  }

  const value = String(billingMonth).trim();

  if (!/^\d{4}-(0[1-9]|1[0-2])$/.test(value)) {
    throw new ApiError(
      400,
      "Billing month must be in YYYY-MM format"
    );
  }

  return value;
};

/**
 * ---------------------------------------------------------
 * Basic CRUD
 * ---------------------------------------------------------
 */

export const listFees = base.list;

export const getFee = base.getOne;

/**
 * Create monthly fee record.
 *
 * Example body:
 *
 * {
 *   student: "...",
 *   course: "...",
 *   billingMonth: "2026-03",
 *   amount: 1000,
 *   amountPaid: 1000,
 *   dueDate: "2026-03-10",
 *   paymentDate: "2026-03-05",
 *   paymentMethod: "Cash",
 *   transactionId: "",
 *   note: "March tuition fee"
 * }
 */
export const createFee = asyncHandler(
  async (req: Request, res: Response) => {
    const {
      student,
      course,
      billingMonth,
      amount,
      amountPaid,
      dueDate,
      paymentDate,
      paymentMethod,
      transactionId,
      note,
    } = req.body;

    if (!student) {
      throw new ApiError(
        400,
        "Student is required"
      );
    }

    if (!course) {
      throw new ApiError(
        400,
        "Course is required"
      );
    }

    if (!dueDate) {
      throw new ApiError(
        400,
        "Due date is required"
      );
    }

    const normalizedMonth =
      validateBillingMonth(
        billingMonth
      );

    const normalizedAmount =
      normalizeAmount(amount);

    const normalizedAmountPaid =
      normalizeAmount(amountPaid);

    if (
      normalizedAmountPaid >
      normalizedAmount
    ) {
      throw new ApiError(
        400,
        "Paid amount cannot be greater than the fee amount"
      );
    }

    /**
     * Prevent accidental duplicate monthly
     * fee records for the same student/course/month.
     *
     * This check only applies when billingMonth
     * is provided, so old-style records remain
     * fully supported.
     */
    if (normalizedMonth) {
      const existingFee =
        await Fee.findOne({
          student,
          course,
          billingMonth:
            normalizedMonth,
        });

      if (existingFee) {
        throw new ApiError(
          409,
          `Fee for ${normalizedMonth} already exists for this student and course`
        );
      }
    }

    const status =
      calculateStatus(
        normalizedAmount,
        normalizedAmountPaid
      );

    const fee = await Fee.create({
      student,
      course,

      billingMonth:
        normalizedMonth,

      amount:
        normalizedAmount,

      amountPaid:
        normalizedAmountPaid,

      dueDate,

      status,

      paymentDate,

      paymentMethod,

      transactionId,

      note,
    });

    const populatedFee =
      await Fee.findById(
        fee._id
      )
        .populate(
          "student",
          "fullName studentId email phone"
        )
        .populate(
          "course",
          "title subject classLevel fee"
        );

    return success(
      res,
      populatedFee || fee,
      "Fee record created"
    );
  }
);

/**
 * ---------------------------------------------------------
 * Update fee
 * ---------------------------------------------------------
 */

export const updateFee = asyncHandler(
  async (req: Request, res: Response) => {
    const fee =
      await Fee.findById(
        req.params.id
      );

    if (!fee) {
      throw new ApiError(
        404,
        "Fee record not found"
      );
    }

    /**
     * Update only fields that are actually
     * provided.
     */
    if (
      req.body.student !== undefined
    ) {
      fee.student =
        req.body.student;
    }

    if (
      req.body.course !== undefined
    ) {
      fee.course =
        req.body.course;
    }

    if (
      req.body.billingMonth !==
      undefined
    ) {
      fee.billingMonth =
        validateBillingMonth(
          req.body.billingMonth
        );
    }

    if (
      req.body.amount !== undefined
    ) {
      fee.amount =
        normalizeAmount(
          req.body.amount
        );
    }

    if (
      req.body.amountPaid !==
      undefined
    ) {
      fee.amountPaid =
        normalizeAmount(
          req.body.amountPaid
        );
    }

    if (
      req.body.dueDate !== undefined
    ) {
      fee.dueDate =
        req.body.dueDate;
    }

    if (
      req.body.paymentDate !==
      undefined
    ) {
      fee.paymentDate =
        req.body.paymentDate;
    }

    if (
      req.body.paymentMethod !==
      undefined
    ) {
      fee.paymentMethod =
        req.body.paymentMethod;
    }

    if (
      req.body.transactionId !==
      undefined
    ) {
      fee.transactionId =
        req.body.transactionId;
    }

    if (
      req.body.note !== undefined
    ) {
      fee.note =
        req.body.note;
    }

    /**
     * Never trust the status coming from
     * the frontend.
     *
     * Always calculate it from amount
     * and amountPaid.
     */
    if (
      fee.amountPaid >
      fee.amount
    ) {
      throw new ApiError(
        400,
        "Paid amount cannot be greater than the fee amount"
      );
    }

    fee.status =
      calculateStatus(
        Number(fee.amount),
        Number(fee.amountPaid)
      );

    await fee.save();

    const populatedFee =
      await Fee.findById(
        fee._id
      )
        .populate(
          "student",
          "fullName studentId email phone"
        )
        .populate(
          "course",
          "title subject classLevel fee"
        );

    return success(
      res,
      populatedFee || fee,
      "Fee record updated"
    );
  }
);

/**
 * ---------------------------------------------------------
 * Delete
 * ---------------------------------------------------------
 */

export const deleteFee =
  base.remove;

/**
 * ---------------------------------------------------------
 * Overall fee summary
 * ---------------------------------------------------------
 */

export const summaryFees =
  asyncHandler(
    async (
      _req: Request,
      res: Response
    ) => {
      const result =
        await Fee.aggregate([
          {
            $group: {
              _id: null,

              totalFee: {
                $sum: "$amount",
              },

              totalPaid: {
                $sum: "$amountPaid",
              },

              totalRecords: {
                $sum: 1,
              },
            },
          },
        ]);

      const summary =
        result[0] || {
          totalFee: 0,
          totalPaid: 0,
          totalRecords: 0,
        };

      const totalFee =
        Number(
          summary.totalFee || 0
        );

      const totalPaid =
        Number(
          summary.totalPaid || 0
        );

      const totalDue =
        Math.max(
          totalFee -
            totalPaid,
          0
        );

      const paidPercentage =
        totalFee > 0
          ? Math.round(
              (totalPaid /
                totalFee) *
                100
            )
          : 0;

      const duePercentage =
        totalFee > 0
          ? Math.round(
              (totalDue /
                totalFee) *
                100
            )
          : 0;

      /**
       * Monthly collection summary.
       *
       * Old records without billingMonth
       * are grouped under "UNASSIGNED".
       */
      const monthlySummary =
        await Fee.aggregate([
          {
            $group: {
              _id: {
                $ifNull: [
                  "$billingMonth",
                  "UNASSIGNED",
                ],
              },

              totalFee: {
                $sum: "$amount",
              },

              totalPaid: {
                $sum: "$amountPaid",
              },

              totalRecords: {
                $sum: 1,
              },
            },
          },

          {
            $addFields: {
              totalDue: {
                $max: [
                  {
                    $subtract: [
                      "$totalFee",
                      "$totalPaid",
                    ],
                  },
                  0,
                ],
              },
            },
          },

          {
            $sort: {
              _id: -1,
            },
          },
        ]);

      /**
       * Course-wise summary.
       */
      const courseSummary =
        await Fee.aggregate([
          {
            $group: {
              _id: "$course",

              totalFee: {
                $sum: "$amount",
              },

              totalPaid: {
                $sum: "$amountPaid",
              },

              totalRecords: {
                $sum: 1,
              },
            },
          },

          {
            $addFields: {
              totalDue: {
                $max: [
                  {
                    $subtract: [
                      "$totalFee",
                      "$totalPaid",
                    ],
                  },
                  0,
                ],
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
              totalFee: 1,
              totalPaid: 1,
              totalDue: 1,
              totalRecords: 1,

              course: {
                _id: "$course._id",
                title: "$course.title",
                subject: "$course.subject",
                classLevel:
                  "$course.classLevel",
              },
            },
          },

          {
            $sort: {
              totalFee: -1,
            },
          },
        ]);

      return success(
        res,
        {
          totalRecords:
            Number(
              summary.totalRecords ||
                0
            ),

          totalFee,

          totalPaid,

          totalDue,

          paidPercentage,

          duePercentage,

          monthlySummary,

          courseSummary,
        },
        "Fee summary fetched"
      );
    }
  );

/**
 * ---------------------------------------------------------
 * Student's fee history
 * ---------------------------------------------------------
 */

export const myFees =
  asyncHandler(
    async (
      req: Request,
      res: Response
    ) => {
      /**
       * Verify student.
       */
      const student =
        await Student.findById(
          req.params.studentDocId
        );

      if (!student) {
        throw new ApiError(
          404,
          "Student not found"
        );
      }

      /**
       * Fetch all fee records.
       *
       * This intentionally does NOT filter
       * by billingMonth so old records remain
       * visible.
       */
      const fees =
        await Fee.find({
          student:
            req.params.studentDocId,
        })
          .populate(
            "course",
            "title subject classLevel fee"
          )
          .sort({
            billingMonth: -1,
            dueDate: -1,
          });

      /**
       * Total pending amount.
       */
      const pendingTotal =
        fees
          .reduce(
            (sum, fee) =>
              sum +
              Math.max(
                Number(
                  fee.amount || 0
                ) -
                  Number(
                    fee.amountPaid ||
                      0
                  ),
                0
              ),
            0
          );

      /**
       * Total fee.
       */
      const totalFee =
        fees.reduce(
          (sum, fee) =>
            sum +
            Number(
              fee.amount || 0
            ),
          0
        );

      /**
       * Total paid.
       */
      const totalPaid =
        fees.reduce(
          (sum, fee) =>
            sum +
            Number(
              fee.amountPaid ||
                0
            ),
          0
        );

      /**
       * Total due.
       */
      const totalDue =
        Math.max(
          totalFee -
            totalPaid,
          0
        );

      /**
       * ---------------------------------------------------
       * Monthly summary
       * ---------------------------------------------------
       */

      const monthlyMap =
        new Map<
          string,
          {
            month: string;
            totalFee: number;
            totalPaid: number;
            totalDue: number;
            records: number;
          }
        >();

      for (const fee of fees) {
        const month =
          fee.billingMonth ||
          "UNASSIGNED";

        const existing =
          monthlyMap.get(
            month
          );

        const feeAmount =
          Number(
            fee.amount || 0
          );

        const paidAmount =
          Number(
            fee.amountPaid ||
              0
          );

        if (existing) {
          existing.totalFee +=
            feeAmount;

          existing.totalPaid +=
            paidAmount;

          existing.totalDue +=
            Math.max(
              feeAmount -
                paidAmount,
              0
            );

          existing.records += 1;
        } else {
          monthlyMap.set(
            month,
            {
              month,

              totalFee:
                feeAmount,

              totalPaid:
                paidAmount,

              totalDue:
                Math.max(
                  feeAmount -
                    paidAmount,
                  0
                ),

              records: 1,
            }
          );
        }
      }

      const monthlySummary =
        Array.from(
          monthlyMap.values()
        ).sort((a, b) => {
          if (
            a.month ===
            "UNASSIGNED"
          ) {
            return 1;
          }

          if (
            b.month ===
            "UNASSIGNED"
          ) {
            return -1;
          }

          return b.month.localeCompare(
            a.month
          );
        });

      /**
       * ---------------------------------------------------
       * Course-wise summary
       * ---------------------------------------------------
       */

      const courseMap =
        new Map<
          string,
          {
            courseId: string;
            course: unknown;
            totalFee: number;
            totalPaid: number;
            totalDue: number;
            records: number;
          }
        >();

      for (const fee of fees) {
        const courseValue =
          fee.course as any;

        const courseId =
          courseValue?._id
            ? String(
                courseValue._id
              )
            : String(
                fee.course
              );

        const existing =
          courseMap.get(
            courseId
          );

        const feeAmount =
          Number(
            fee.amount || 0
          );

        const paidAmount =
          Number(
            fee.amountPaid ||
              0
          );

        if (existing) {
          existing.totalFee +=
            feeAmount;

          existing.totalPaid +=
            paidAmount;

          existing.totalDue +=
            Math.max(
              feeAmount -
                paidAmount,
              0
            );

          existing.records += 1;
        } else {
          courseMap.set(
            courseId,
            {
              courseId,

              course:
                courseValue || null,

              totalFee:
                feeAmount,

              totalPaid:
                paidAmount,

              totalDue:
                Math.max(
                  feeAmount -
                    paidAmount,
                  0
                ),

              records: 1,
            }
          );
        }
      }

      const courseSummary =
        Array.from(
          courseMap.values()
        ).sort(
          (a, b) =>
            b.totalFee -
            a.totalFee
        );

      /**
       * ---------------------------------------------------
       * Payment progress
       * ---------------------------------------------------
       */

      const paidPercentage =
        totalFee > 0
          ? Math.round(
              (totalPaid /
                totalFee) *
                100
            )
          : 0;

      const duePercentage =
        totalFee > 0
          ? Math.round(
              (totalDue /
                totalFee) *
                100
            )
          : 0;

      return success(
        res,
        {
          /**
           * Complete individual
           * monthly fee records.
           */
          fees,

          /**
           * Overall summary.
           */
          totalFee,

          totalPaid,

          totalDue,

          pendingTotal,

          totalRecords:
            fees.length,

          paidPercentage,

          duePercentage,

          /**
           * Monthly breakdown.
           */
          monthlySummary,

          /**
           * Course breakdown.
           */
          courseSummary,
        },

        "Student fees fetched"
      );
    }
  );