import mongoose, { Schema, Document, Model, Types } from "mongoose";

export interface IAssignment extends Document {
  title: string;
  description: string;
  course: Types.ObjectId | string;
  subject: string;
  deadline: Date;
  attachment?: string;
  createdAt: Date;
  updatedAt: Date;
}

const assignmentSchema = new Schema<IAssignment>(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },
    course: { type: Schema.Types.ObjectId, ref: "Course", required: true, index: true },
    subject: { type: String, required: true },
    deadline: { type: Date, required: true },
    attachment: { type: String },
  },
  { timestamps: true }
);

export const Assignment: Model<IAssignment> = mongoose.model<IAssignment>("Assignment", assignmentSchema);
