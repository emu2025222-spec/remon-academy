import { Request, Response } from "express";
import { Fee } from "../models/Fee";
import { makeCrudControllers } from "../utils/crudFactory";
import { asyncHandler } from "../utils/asyncHandler";
import { success } from "../utils/apiResponse";
import { ApiError } from "../utils/ApiError";

const base = makeCrudControllers(Fee, { populate: ["student", "course"] });

export const listFees = base.list;
export const getFee = base.getOne;
export const createFee = base.create;
export const deleteFee = base.remove;

export const updateFee = asyncHandler(async (req: Request, res: Response) => {
  const fee = await Fee.findById(req.params.id);
  if (!fee) throw new ApiError(404, "Fee record not found");

  Object.assign(fee, req.body);

  if (fee.amountPaid >= fee.amount) fee.status = "PAID";
  else if (fee.amountPaid > 0) fee.status = "PARTIAL";
  else fee.status = "PENDING";

  await fee.save();
  return success(res, fee, "Fee record updated");
});

export const myFees = asyncHandler(async (req: Request, res: Response) => {
  const fees = await Fee.find({ student: req.params.studentDocId }).populate("course", "title").sort("-dueDate");
  const pendingTotal = fees.filter((f) => f.status !== "PAID").reduce((sum, f) => sum + (f.amount - f.amountPaid), 0);
  return success(res, { fees, pendingTotal });
});
