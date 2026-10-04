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

export const listFees = base.list;

export const getFee = base.getOne;

export const createFee = base.create;

export const deleteFee = base.remove;

export const updateFee = asyncHandler(
  async (req: Request, res: Response) => {
    const fee = await Fee.findById(
      req.params.id
    );

    if (!fee) {
      throw new ApiError(
        404,
        "Fee record not found"
      );
    }

    Object.assign(
      fee,
      req.body
    );

    if (
      fee.amountPaid >=
      fee.amount
    ) {
      fee.status = "PAID";
    } else if (
      fee.amountPaid > 0
    ) {
      fee.status = "PARTIAL";
    } else {
      fee.status = "PENDING";
    }

    await fee.save();

    return success(
      res,
      fee,
      "Fee record updated"
    );
  }
);

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

      const totalDue = Math.max(
        totalFee - totalPaid,
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
        },
        "Fee summary fetched"
      );
    }
  );

export const myFees =
  asyncHandler(
    async (
      req: Request,
      res: Response
    ) => {
      /*
       * First verify that the student exists.
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

      /*
       * A student's fees are already linked
       * directly through the `student` field.
       *
       * Therefore all fee records belonging
       * to this student are returned,
       * regardless of how many courses
       * the student has.
       *
       * This also keeps all existing fee
       * records safe.
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
          .sort("-dueDate");

      /*
       * Calculate total pending amount.
       */
      const pendingTotal =
        fees
          .filter(
            (fee) =>
              fee.status !== "PAID"
          )
          .reduce(
            (sum, fee) =>
              sum +
              Math.max(
                Number(fee.amount) -
                  Number(
                    fee.amountPaid
                  ),
                0
              ),
            0
          );

      /*
       * Calculate total fee amount.
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

      /*
       * Calculate total paid amount.
       */
      const totalPaid =
        fees.reduce(
          (sum, fee) =>
            sum +
            Number(
              fee.amountPaid || 0
            ),
          0
        );

      /*
       * Calculate total due amount.
       */
      const totalDue =
        Math.max(
          totalFee -
            totalPaid,
          0
        );

      return success(
        res,
        {
          fees,

          pendingTotal,

          totalFee,

          totalPaid,

          totalDue,

          totalRecords:
            fees.length,
        }
      );
    }
  );