import mongoose, { Schema, Document, Model, Types } from "mongoose";

export interface IAdmin extends Document {
  user: Types.ObjectId | string;
  fullName: string;
  phone?: string;
  createdAt: Date;
  updatedAt: Date;
}

const adminSchema = new Schema<IAdmin>(
  {
    user: { type: Schema.Types.ObjectId, ref: "User", required: true, unique: true },
    fullName: { type: String, required: true },
    phone: { type: String },
  },
  { timestamps: true }
);

export const Admin: Model<IAdmin> = mongoose.model<IAdmin>("Admin", adminSchema);
