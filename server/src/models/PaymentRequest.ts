import mongoose, {
  Document,
  Model,
  Schema,
  Types,
} from "mongoose";

export type PaymentRequestStatus =
  | "PENDING"
  | "APPROVED"
  | "REJECTED";

export interface IPaymentRequest
  extends Document {
  fee: Types.ObjectId;
  student: Types.ObjectId;
  amount: number;
  senderNumber: string;
  transactionId: string;
  status: PaymentRequestStatus;
  reviewedBy?: Types.ObjectId;
  reviewedAt?: Date;
  rejectionReason?: string;
  createdAt: Date;
  updatedAt: Date;
}

const paymentRequestSchema =
  new Schema<IPaymentRequest>(
    {
      fee: {
        type: Schema.Types.ObjectId,
        ref: "Fee",
        required: true,
        index: true,
      },

      student: {
        type: Schema.Types.ObjectId,
        ref: "Student",
        required: true,
        index: true,
      },

      amount: {
        type: Number,
        required: true,
        min: 1,
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
        unique: true,
        index: true,
      },

      status: {
        type: String,
        enum: [
          "PENDING",
          "APPROVED",
          "REJECTED",
        ],
        default: "PENDING",
        required: true,
        index: true,
      },

      reviewedBy: {
        type: Schema.Types.ObjectId,
        ref: "User",
      },

      reviewedAt: {
        type: Date,
      },

      rejectionReason: {
        type: String,
        trim: true,
      },
    },
    {
      timestamps: true,
    }
  );

paymentRequestSchema.index({
  student: 1,
  createdAt: -1,
});

paymentRequestSchema.index({
  status: 1,
  createdAt: -1,
});

export const PaymentRequest: Model<IPaymentRequest> =
  mongoose.model<IPaymentRequest>(
    "PaymentRequest",
    paymentRequestSchema
  );