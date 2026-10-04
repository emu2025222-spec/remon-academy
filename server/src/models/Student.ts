import mongoose, { Schema, Document, Model, Types } from "mongoose";

export interface IStudent extends Document {
  user: Types.ObjectId | string;
  studentId: string;
  fullName: string;
  phone: string;
  dateOfBirth: Date;
  gender: "MALE" | "FEMALE" | "OTHER";
  address: string;
  class: string;
  group?: string;
  course?: Types.ObjectId | string;
  profilePhoto?: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const studentSchema = new Schema<IStudent>(
  {
    user: { type: Schema.Types.ObjectId, ref: "User", required: true, unique: true },
    studentId: { type: String, required: true, unique: true, index: true },
    fullName: { type: String, required: true, trim: true, index: true },
    phone: { type: String, required: true },
    dateOfBirth: { type: Date, required: true },
    gender: { type: String, enum: ["MALE", "FEMALE", "OTHER"], required: true },
    address: { type: String, required: true },
    class: { type: String, required: true, index: true },
    group: { type: String },
    course: { type: Schema.Types.ObjectId, ref: "Course" },
    profilePhoto: { type: String },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

export const Student: Model<IStudent> = mongoose.model<IStudent>("Student", studentSchema);
