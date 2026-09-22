import mongoose, { Schema, Document, Model } from "mongoose";

export interface IGallery extends Document {
  title: string;
  category: string;
  image: string;
  createdAt: Date;
  updatedAt: Date;
}

const gallerySchema = new Schema<IGallery>(
  {
    title: { type: String, required: true },
    category: { type: String, required: true, index: true },
    image: { type: String, required: true },
  },
  { timestamps: true }
);

export const Gallery: Model<IGallery> = mongoose.model<IGallery>("Gallery", gallerySchema);
