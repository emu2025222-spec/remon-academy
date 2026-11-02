import mongoose from "mongoose";
import { env } from "./env";

let listenersRegistered = false;

function registerDatabaseEvents() {
  if (listenersRegistered) return;

  listenersRegistered = true;

  mongoose.connection.on("connected", () => {
    console.log("[DB] MongoDB connected");
  });

  mongoose.connection.on("disconnected", () => {
    console.warn("[DB] MongoDB disconnected. Mongoose will attempt recovery.");
  });

  mongoose.connection.on("reconnected", () => {
    console.log("[DB] MongoDB reconnected successfully");
  });

  mongoose.connection.on("error", (error) => {
    console.error("[DB] MongoDB connection error:", error.message);
  });
}

export async function connectDB(): Promise<void> {
  registerDatabaseEvents();

  // Reuse an existing connection if one is already active.
  if (mongoose.connection.readyState === 1) {
    console.log("[DB] Existing MongoDB connection reused");
    return;
  }

  try {
    mongoose.set("strictQuery", true);

    await mongoose.connect(env.mongoUri, {
      maxPoolSize: 30,
      minPoolSize: 5,
      maxConnecting: 5,
      maxIdleTimeMS: 30000,
      waitQueueTimeoutMS: 10000,
      serverSelectionTimeoutMS: 15000,
      connectTimeoutMS: 15000,
      socketTimeoutMS: 45000,
      heartbeatFrequencyMS: 10000,
      tls: true,
    });

    console.log("[DB] MongoDB Atlas connection established");
    console.log("[DB] Connection pool configured");
  } catch (error) {
    console.error("[DB] Initial connection failed:", error);
    throw error;
  }
}