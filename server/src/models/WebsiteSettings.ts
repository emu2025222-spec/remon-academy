import mongoose, { Schema, Document, Model } from "mongoose";

export interface IWebsiteSettings extends Document {
  coachingName: string;
  logo?: string;
  favicon?: string;
  primaryColor: string;
  secondaryColor: string;
  phone: string;
  email: string;
  address: string;
  facebookUrl?: string;
  youtubeUrl?: string;
  otherSocialLinks?: { platform: string; url: string }[];
  aboutContent?: string;
  heroContent?: { headline: string; subheadline: string };
  footerContent?: string;
  createdAt: Date;
  updatedAt: Date;
}

const websiteSettingsSchema = new Schema<IWebsiteSettings>(
  {
    coachingName: { type: String, required: true, default: "Remon Academy" },
    logo: { type: String },
    favicon: { type: String },
    primaryColor: { type: String, default: "#0b1f4d" },
    secondaryColor: { type: String, default: "#c9a24b" },
    phone: { type: String, default: "+8801XXXXXXXXX" },
    email: { type: String, default: "info@remonacademy.com" },
    address: { type: String, default: "Dhaka, Bangladesh" },
    facebookUrl: { type: String },
    youtubeUrl: { type: String },
    otherSocialLinks: [{ platform: String, url: String }],
    aboutContent: { type: String },
    heroContent: {
      headline: { type: String, default: "Building Bright Futures Together" },
      subheadline: { type: String, default: "Quality coaching for real academic success." },
    },
    footerContent: { type: String },
  },
  { timestamps: true }
);

export const WebsiteSettings: Model<IWebsiteSettings> = mongoose.model<IWebsiteSettings>(
  "WebsiteSettings",
  websiteSettingsSchema
);
