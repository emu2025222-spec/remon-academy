import mongoose, { Schema, Document, Model, Types } from "mongoose";

export interface IResult extends Document {
  student: Types.ObjectId | string;
  examName: string;
  subject: string;
  totalMarks: number;
  obtainedMarks: number;
  grade: string;
  gpa: number;
  examDate: Date;
  createdAt: Date;
  updatedAt: Date;
}

const resultSchema = new Schema<IResult>(
  {
    student: { type: Schema.Types.ObjectId, ref: "Student", required: true, index: true },
    examName: { type: String, required: true, index: true },
    subject: { type: String, required: true },
    totalMarks: { type: Number, required: true },
    obtainedMarks: { type: Number, required: true },
    grade: { type: String, required: true },
    gpa: { type: Number, required: true },
    examDate: { type: Date, required: true },
  },
  { timestamps: true }
);

export const Result: Model<IResult> = mongoose.model<IResult>("Result", resultSchema);
