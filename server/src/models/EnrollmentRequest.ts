import mongoose, { Schema, Document, Model, Types } from "mongoose";

export type EnrollmentPaymentPlan = "MONTHLY" | "FULL";
export type EnrollmentPaymentMethod = "ONLINE" | "OFFLINE";
export type EnrollmentRequestStatus = "PENDING" | "APPROVED" | "REJECTED";

export interface IEnrollmentRequest extends Document {
  fullName: string;
  email: string;
  phone: string;
  dateOfBirth: Date;
  gender: "MALE" | "FEMALE" | "OTHER";
  address: string;
  class: string;
  group?: string;

  course: Types.ObjectId;
  courseTitle: string;

  paymentPlan: EnrollmentPaymentPlan;
  paymentMethod: EnrollmentPaymentMethod;
  amount: number;

  senderNumber: string;
  transactionId: string;

  status: EnrollmentRequestStatus;
  adminNote?: string;
  reviewedBy?: Types.ObjectId;
  reviewedAt?: Date;

  createdAt: Date;
  updatedAt: Date;
}

const enrollmentRequestSchema = new Schema<IEnrollmentRequest>(
  {
    fullName: {
      type: String,
      required: true,
      trim: true,
    },

    email: {
      type: String,
      required: true,
      lowercase: true,
      trim: true,
      index: true,
    },

    phone: {
      type: String,
      required: true,
      trim: true,
    },

    dateOfBirth: {
      type: Date,
      required: true,
    },

    gender: {
      type: String,
      enum: ["MALE", "FEMALE", "OTHER"],
      required: true,
    },

    address: {
      type: String,
      required: true,
      trim: true,
    },

    class: {
      type: String,
      required: true,
      trim: true,
    },

    group: {
      type: String,
      trim: true,
    },

    course: {
      type: Schema.Types.ObjectId,
      ref: "Course",
      required: true,
      index: true,
    },

    courseTitle: {
      type: String,
      required: true,
    },

    paymentPlan: {
      type: String,
      enum: ["MONTHLY", "FULL"],
      required: true,
    },

    paymentMethod: {
      type: String,
      enum: ["ONLINE", "OFFLINE"],
      required: true,
    },

    amount: {
      type: Number,
      required: true,
      min: 0,
    },

    senderNumber: {
      type: String,
      required: true,
      trim: true,
    },

    transactionId: {
      type: String,
      required: true,
      trim: true,
      uppercase: true,
      index: true,
    },

    status: {
      type: String,
      enum: ["PENDING", "APPROVED", "REJECTED"],
      default: "PENDING",
      index: true,
    },

    adminNote: {
      type: String,
      trim: true,
    },

    reviewedBy: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },

    reviewedAt: {
      type: Date,
    },
  },
  {
    timestamps: true,
  }
);

enrollmentRequestSchema.index(
  { transactionId: 1 },
  { unique: true }
);

export const EnrollmentRequest: Model<IEnrollmentRequest> =
  mongoose.model<IEnrollmentRequest>(
    "EnrollmentRequest",
    enrollmentRequestSchema
  );