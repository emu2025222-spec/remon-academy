import mongoose, { Schema, Document, Model, Types } from "mongoose";

export type FeeStatus = "PAID" | "PENDING" | "PARTIAL";

export interface IFee extends Document {
  student: Types.ObjectId | string;
  course: Types.ObjectId | string;

  // Monthly billing information
  // Format: YYYY-MM
  // Example: "2026-01", "2026-02"
  billingMonth?: string;

  amount: number;
  amountPaid: number;

  dueDate: Date;

  status: FeeStatus;

  paymentDate?: Date;
  paymentMethod?: string;
  transactionId?: string;

  // Optional admin note
  note?: string;

  createdAt: Date;
  updatedAt: Date;
}

const feeSchema = new Schema<IFee>(
  {
    student: {
      type: Schema.Types.ObjectId,
      ref: "Student",
      required: true,
      index: true,
    },

    course: {
      type: Schema.Types.ObjectId,
      ref: "Course",
      required: true,
      index: true,
    },

    /**
     * Monthly fee period.
     *
     * Format:
     * YYYY-MM
     *
     * Example:
     * 2026-01 = January 2026
     * 2026-02 = February 2026
     *
     * Optional for backward compatibility with existing
     * fee records created before the monthly system.
     */
    billingMonth: {
      type: String,
      index: true,
      trim: true,
      match: /^\d{4}-(0[1-9]|1[0-2])$/,
    },

    /**
     * Total fee amount for this month.
     */
    amount: {
      type: Number,
      required: true,
      min: 0,
    },

    /**
     * Amount actually paid by the student.
     *
     * Examples:
     * amount = 1000, amountPaid = 1000 → PAID
     * amount = 1000, amountPaid = 500  → PARTIAL
     * amount = 1000, amountPaid = 0    → PENDING
     */
    amountPaid: {
      type: Number,
      default: 0,
      min: 0,
    },

    dueDate: {
      type: Date,
      required: true,
    },

    status: {
      type: String,
      enum: ["PAID", "PENDING", "PARTIAL"],
      default: "PENDING",
      index: true,
    },

    paymentDate: {
      type: Date,
    },

    paymentMethod: {
      type: String,
      trim: true,
    },

    transactionId: {
      type: String,
      trim: true,
    },

    note: {
      type: String,
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);

/**
 * Useful indexes for:
 * - Student fee history
 * - Course-wise fee history
 * - Monthly filtering
 * - Paid/Pending filtering
 */
feeSchema.index({
  student: 1,
  billingMonth: 1,
});

feeSchema.index({
  course: 1,
  billingMonth: 1,
});

feeSchema.index({
  status: 1,
  billingMonth: 1,
});

export const Fee: Model<IFee> = mongoose.model<IFee>("Fee", feeSchema);