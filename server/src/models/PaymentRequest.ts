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

export interface IPaymentAllocation {
  fee: Types.ObjectId;
  amount: number;
}

export interface IPaymentRequest
  extends Document {
  student: Types.ObjectId;
  amount: number;
  senderNumber: string;
  transactionId: string;
  status: PaymentRequestStatus;

  allocations: IPaymentAllocation[];

  reviewedBy?: Types.ObjectId;
  reviewedAt?: Date;
  rejectionReason?: string;

  createdAt: Date;
  updatedAt: Date;
}

const paymentAllocationSchema =
  new Schema<IPaymentAllocation>(
    {
      fee: {
        type: Schema.Types.ObjectId,
        ref: "Fee",
        required: true,
      },

      amount: {
        type: Number,
        required: true,
        min: 0,
      },
    },
    {
      _id: false,
    }
  );

const paymentRequestSchema =
  new Schema<IPaymentRequest>(
    {
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

      allocations: {
        type: [paymentAllocationSchema],
        default: [],
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
  student: 1,
  status: 1,
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