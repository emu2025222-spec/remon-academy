import mongoose, { Schema, Document, Model } from "mongoose";

export interface ITeacher extends Document {
  name: string;
  photo?: string;
  designation: string;
  qualification: string;
  subjects: string[];
  experienceYears: number;
  bio: string;
  phone?: string;
  email?: string;
  socialLinks?: { facebook?: string; linkedin?: string; youtube?: string };
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const teacherSchema = new Schema<ITeacher>(
  {
    name: { type: String, required: true, index: true },
    photo: { type: String },
    designation: { type: String, required: true },
    qualification: { type: String, required: true },
    subjects: { type: [String], default: [] },
    experienceYears: { type: Number, default: 0 },
    bio: { type: String, default: "" },
    phone: { type: String },
    email: { type: String },
    socialLinks: {
      facebook: String,
      linkedin: String,
      youtube: String,
    },
    isActive: { type: Boolean, default: true, index: true },
  },
  { timestamps: true }
);

export const Teacher: Model<ITeacher> = mongoose.model<ITeacher>("Teacher", teacherSchema);
