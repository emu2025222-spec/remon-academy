import mongoose, { Schema, Document, Model, Types } from "mongoose";

export interface IAssignmentSubmission extends Document {
  assignment: Types.ObjectId | string;
  student: Types.ObjectId | string;
  file: string;
  submittedAt: Date;
  grade?: string;
  feedback?: string;
  createdAt: Date;
  updatedAt: Date;
}

const submissionSchema = new Schema<IAssignmentSubmission>(
  {
    assignment: { type: Schema.Types.ObjectId, ref: "Assignment", required: true, index: true },
    student: { type: Schema.Types.ObjectId, ref: "Student", required: true, index: true },
    file: { type: String, required: true },
    submittedAt: { type: Date, default: Date.now },
    grade: { type: String },
    feedback: { type: String },
  },
  { timestamps: true }
);

submissionSchema.index({ assignment: 1, student: 1 }, { unique: true });

export const AssignmentSubmission: Model<IAssignmentSubmission> = mongoose.model<IAssignmentSubmission>(
  "AssignmentSubmission",
  submissionSchema
);
