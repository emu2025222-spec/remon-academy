import mongoose, { Schema, Document, Model, Types } from "mongoose";

export type AttendanceStatus = "PRESENT" | "ABSENT" | "LATE";

export interface IAttendance extends Document {
  student: Types.ObjectId | string;
  course: Types.ObjectId | string;
  date: Date;
  status: AttendanceStatus;
  createdAt: Date;
  updatedAt: Date;
}

const attendanceSchema = new Schema<IAttendance>(
  {
    student: { type: Schema.Types.ObjectId, ref: "Student", required: true, index: true },
    course: { type: Schema.Types.ObjectId, ref: "Course", required: true, index: true },
    date: { type: Date, required: true, index: true },
    status: { type: String, enum: ["PRESENT", "ABSENT", "LATE"], required: true },
  },
  { timestamps: true }
);

attendanceSchema.index({ student: 1, course: 1, date: 1 }, { unique: true });

export const Attendance: Model<IAttendance> = mongoose.model<IAttendance>("Attendance", attendanceSchema);
