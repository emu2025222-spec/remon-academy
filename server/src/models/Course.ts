import mongoose, { Schema, Document, Model, Types } from "mongoose";

export interface ICourse extends Document {
  title: string;
  slug: string;
  description: string;
  classLevel: string;
  subject: string;
  duration: string;
  fee: number;
  teacher?: Types.ObjectId | string;
  schedule?: string;
  seatCapacity: number;
  enrolledCount: number;
  image?: string;
  features: string[];
  isPublished: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const courseSchema = new Schema<ICourse>(
  {
    title: { type: String, required: true, trim: true, index: true },
    slug: { type: String, required: true, unique: true, index: true },
    description: { type: String, required: true },
    classLevel: { type: String, required: true, index: true },
    subject: { type: String, required: true },
    duration: { type: String, required: true },
    fee: { type: Number, required: true, min: 0 },
    teacher: { type: Schema.Types.ObjectId, ref: "Teacher" },
    schedule: { type: String },
    seatCapacity: { type: Number, default: 30 },
    enrolledCount: { type: Number, default: 0 },
    image: { type: String },
    features: { type: [String], default: [] },
    isPublished: { type: Boolean, default: true, index: true },
  },
  { timestamps: true }
);

export const Course: Model<ICourse> = mongoose.model<ICourse>("Course", courseSchema);
