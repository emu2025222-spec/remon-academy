import mongoose, { Document, Model, Schema, Types } from "mongoose";

export type LoginSessionRole = "ADMIN" | "STUDENT";

export interface ILoginSession extends Document {
  user: Types.ObjectId;
  role: LoginSessionRole;

  // Only populated for student accounts
  student?: Types.ObjectId;

  // Unique identifier for this browser/device session
  sessionId: string;

  // Login/session activity
  loginAt: Date;
  lastActiveAt: Date;
  logoutAt?: Date;

  // Current session status
  isOnline: boolean;

  // Optional device information
  userAgent?: string;
  ipAddress?: string;

  createdAt: Date;
  updatedAt: Date;
}

const loginSessionSchema = new Schema<ILoginSession>(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },

    role: {
      type: String,
      enum: ["ADMIN", "STUDENT"],
      required: true,
      index: true,
    },

    student: {
      type: Schema.Types.ObjectId,
      ref: "Student",
      index: true,
    },

    sessionId: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },

    loginAt: {
      type: Date,
      required: true,
      default: Date.now,
      index: true,
    },

    lastActiveAt: {
      type: Date,
      required: true,
      default: Date.now,
      index: true,
    },

    logoutAt: {
      type: Date,
    },

    isOnline: {
      type: Boolean,
      required: true,
      default: true,
      index: true,
    },

    userAgent: {
      type: String,
    },

    ipAddress: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

// Quickly find currently online students
loginSessionSchema.index({
  role: 1,
  isOnline: 1,
  lastActiveAt: -1,
});

// Quickly find a user's recent sessions
loginSessionSchema.index({
  user: 1,
  loginAt: -1,
});

// Automatically clean very old session records after 90 days.
// This does NOT delete active sessions.
loginSessionSchema.index(
  { createdAt: 1 },
  { expireAfterSeconds: 90 * 24 * 60 * 60 }
);

export const LoginSession: Model<ILoginSession> =
  mongoose.model<ILoginSession>("LoginSession", loginSessionSchema);