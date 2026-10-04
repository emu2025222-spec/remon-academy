import mongoose from "mongoose";
import { env } from "./env";

export async function connectDB(): Promise<void> {
  try {
    mongoose.set("strictQuery", true);

    await mongoose.connect(env.mongoUri, {
      serverSelectionTimeoutMS: 15000,
      connectTimeoutMS: 15000,
      tls: true,
    });

    console.log("[DB] Connected to MongoDB Atlas successfully");
  } catch (err) {
    console.error("[DB] Connection failed:", err);
    process.exit(1);
  }
}