import mongoose, { Schema, Document, Model, Types } from "mongoose";

export interface IExamAttempt extends Document {
  exam: Types.ObjectId;
  student: Types.ObjectId;

  answers: {
    questionId: Types.ObjectId;
    selectedAnswer: number;
  }[];

  startedAt: Date;
  submittedAt?: Date;
  expiresAt: Date;

  obtainedMarks: number;
  totalMarks: number;
  correctCount: number;
  wrongCount: number;
  unansweredCount: number;

  status: "IN_PROGRESS" | "SUBMITTED";

  createdAt: Date;
  updatedAt: Date;
}

const examAttemptSchema = new Schema<IExamAttempt>(
  {
    exam: {
      type: Schema.Types.ObjectId,
      ref: "Exam",
      required: true,
    },

    student: {
      type: Schema.Types.ObjectId,
      ref: "Student",
      required: true,
    },

    answers: [
      {
        questionId: {
          type: Schema.Types.ObjectId,
          required: true,
        },
        selectedAnswer: {
          type: Number,
          required: true,
          min: 0,
        },
      },
    ],

    startedAt: {
      type: Date,
      required: true,
    },

    submittedAt: {
      type: Date,
    },

    expiresAt: {
      type: Date,
      required: true,
    },

    obtainedMarks: {
      type: Number,
      default: 0,
    },

    totalMarks: {
      type: Number,
      required: true,
    },

    correctCount: {
      type: Number,
      default: 0,
    },

    wrongCount: {
      type: Number,
      default: 0,
    },

    unansweredCount: {
      type: Number,
      default: 0,
    },

    status: {
      type: String,
      enum: ["IN_PROGRESS", "SUBMITTED"],
      default: "IN_PROGRESS",
    },
  },
  {
    timestamps: true,
  }
);

// Prevent duplicate attempts by the same student for one exam.
examAttemptSchema.index(
  { exam: 1, student: 1 },
  { unique: true, name: "unique_exam_student_attempt" }
);

// Helps the scheduler find expired in-progress attempts.
examAttemptSchema.index(
  { status: 1, expiresAt: 1 },
  { name: "exam_attempt_expiry_lookup" }
);

// Helps queries that list a student's attempts.
examAttemptSchema.index(
  { student: 1, status: 1 },
  { name: "student_exam_attempts_lookup" }
);

export const ExamAttempt: Model<IExamAttempt> =
  mongoose.models.ExamAttempt ||
  mongoose.model<IExamAttempt>("ExamAttempt", examAttemptSchema);