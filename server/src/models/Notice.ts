import mongoose, { Schema, Document, Model, Types } from "mongoose";

export interface INotice extends Document {
  title: string;
  slug: string;
  description: string;
  category: string;
  date: Date;
  author: Types.ObjectId | string;
  attachment?: string;
  isPublished: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const noticeSchema = new Schema<INotice>(
  {
    title: { type: String, required: true, index: true },
    slug: { type: String, required: true, unique: true },
    description: { type: String, required: true },
    category: { type: String, required: true, index: true },
    date: { type: Date, required: true, index: true },
    author: { type: Schema.Types.ObjectId, ref: "Admin", required: true },
    attachment: { type: String },
    isPublished: { type: Boolean, default: true, index: true },
  },
  { timestamps: true }
);

export const Notice: Model<INotice> = mongoose.model<INotice>("Notice", noticeSchema);
