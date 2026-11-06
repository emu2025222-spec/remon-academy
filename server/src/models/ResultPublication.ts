import mongoose, { Schema, Document, Model } from "mongoose";

export interface IResultPublication extends Document {
  examName: string;
  publishAt: Date;
  status: "SCHEDULED" | "CANCELLED";
  createdAt: Date;
  updatedAt: Date;
}

const resultPublicationSchema = new Schema<IResultPublication>(
  {
    examName: {
      type: String,
      required: true,
      trim: true,
      unique: true,
      index: true,
    },

    publishAt: {
      type: Date,
      required: true,
      index: true,
    },

    status: {
      type: String,
      enum: ["SCHEDULED", "CANCELLED"],
      default: "SCHEDULED",
      index: true,
    },
  },
  {
    timestamps: true,
  }
);

export const ResultPublication: Model<IResultPublication> =
  mongoose.models.ResultPublication ||
  mongoose.model<IResultPublication>(
    "ResultPublication",
    resultPublicationSchema
  );