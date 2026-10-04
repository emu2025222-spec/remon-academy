import mongoose, { Schema, Document, Model, Types } from "mongoose";

export type Weekday = "SAT" | "SUN" | "MON" | "TUE" | "WED" | "THU" | "FRI";

export interface ISchedule extends Document {
  course: Types.ObjectId | string;
  subject: string;
  teacher: Types.ObjectId | string;
  room: string;
  day: Weekday;
  startTime: string;
  endTime: string;
  createdAt: Date;
  updatedAt: Date;
}

const scheduleSchema = new Schema<ISchedule>(
  {
    course: { type: Schema.Types.ObjectId, ref: "Course", required: true, index: true },
    subject: { type: String, required: true },
    teacher: { type: Schema.Types.ObjectId, ref: "Teacher", required: true },
    room: { type: String, required: true },
    day: { type: String, enum: ["SAT", "SUN", "MON", "TUE", "WED", "THU", "FRI"], required: true },
    startTime: { type: String, required: true },
    endTime: { type: String, required: true },
  },
  { timestamps: true }
);

export const Schedule: Model<ISchedule> = mongoose.model<ISchedule>("Schedule", scheduleSchema);
