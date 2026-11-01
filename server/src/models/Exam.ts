import mongoose, { Schema, Document, Model, Types } from "mongoose";

export interface IExamQuestion {
  question: string;
  options: string[];
  correctAnswer: number;
  marks: number;
  negativeMarks: number;
}

export interface IExam extends Document {
  title: string;
  description?: string;
  course: Types.ObjectId;
  subject: string;

  startTime: Date;
  endTime: Date;
  duration: number;

  totalMarks: number;
  passMarks: number;
  negativeMarking: boolean;

  questions: IExamQuestion[];

  isPublished: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const questionSchema = new Schema<IExamQuestion>(
  {
    question: {
      type: String,
      required: true,
      trim: true,
    },
    options: {
      type: [String],
      required: true,
      validate: {
        validator: (value: string[]) => value.length >= 2,
        message: "At least two options are required",
      },
    },
    correctAnswer: {
      type: Number,
      required: true,
      min: 0,
    },
    marks: {
      type: Number,
      required: true,
      min: 0,
    },
    negativeMarks: {
      type: Number,
      default: 0,
      min: 0,
    },
  },
  { _id: true }
);

const examSchema = new Schema<IExam>(
  {
    title: {
      type: String,
      required: true,
      trim: true,
      index: true,
    },
    description: {
      type: String,
      default: "",
    },
    course: {
      type: Schema.Types.ObjectId,
      ref: "Course",
      required: true,
      index: true,
    },
    subject: {
      type: String,
      required: true,
      trim: true,
    },
    startTime: {
      type: Date,
      required: true,
      index: true,
    },
    endTime: {
      type: Date,
      required: true,
      index: true,
    },
    duration: {
      type: Number,
      required: true,
      min: 1,
    },
    totalMarks: {
      type: Number,
      required: true,
      min: 1,
    },
    passMarks: {
      type: Number,
      required: true,
      min: 0,
    },
    negativeMarking: {
      type: Boolean,
      default: false,
    },
    questions: {
      type: [questionSchema],
      required: true,
      validate: {
        validator: (value: IExamQuestion[]) => value.length > 0,
        message: "At least one question is required",
      },
    },
    isPublished: {
      type: Boolean,
      default: false,
      index: true,
    },
  },
  {
    timestamps: true,
  }
);

examSchema.pre("validate", function () {
  if (this.startTime && this.endTime && this.endTime <= this.startTime) {
    this.invalidate("endTime", "End time must be after start time");
  }

  if (this.passMarks > this.totalMarks) {
    this.invalidate("passMarks", "Pass marks cannot exceed total marks");
  }

  if (this.questions?.length) {
    const calculatedTotal = this.questions.reduce(
      (sum, question) => sum + question.marks,
      0
    );

    if (calculatedTotal !== this.totalMarks) {
      this.invalidate(
        "totalMarks",
        "Total marks must equal the sum of question marks"
      );
    }

    for (const question of this.questions) {
      if (
        question.correctAnswer < 0 ||
        question.correctAnswer >= question.options.length
      ) {
        this.invalidate(
          "questions",
          "Correct answer index must match an available option"
        );
        break;
      }
    }
  }
});

export const Exam: Model<IExam> =
  mongoose.models.Exam || mongoose.model<IExam>("Exam", examSchema);