import mongoose, { Schema, Document, Model, Types } from "mongoose";

export type FeeStatus = "PAID" | "PENDING" | "PARTIAL";

export interface IFee extends Document {
  student: Types.ObjectId | string;
  course: Types.ObjectId | string;
  amount: number;
  amountPaid: number;
  dueDate: Date;
  status: FeeStatus;
  paymentDate?: Date;
  paymentMethod?: string;
  transactionId?: string;
  createdAt: Date;
  updatedAt: Date;
}

const feeSchema = new Schema<IFee>(
  {
    student: { type: Schema.Types.ObjectId, ref: "Student", required: true, index: true },
    course: { type: Schema.Types.ObjectId, ref: "Course", required: true },
    amount: { type: Number, required: true },
    amountPaid: { type: Number, default: 0 },
    dueDate: { type: Date, required: true },
    status: { type: String, enum: ["PAID", "PENDING", "PARTIAL"], default: "PENDING", index: true },
    paymentDate: { type: Date },
    paymentMethod: { type: String },
    transactionId: { type: String },
  },
  { timestamps: true }
);

export const Fee: Model<IFee> = mongoose.model<IFee>("Fee", feeSchema);
