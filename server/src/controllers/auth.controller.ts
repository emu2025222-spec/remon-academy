import { Request, Response } from "express";
import crypto from "crypto";

import { User } from "../models/User";
import { Student } from "../models/Student";
import { Admin } from "../models/Admin";
import { LoginSession } from "../models/LoginSession";

import { asyncHandler } from "../utils/asyncHandler";
import { ApiError } from "../utils/ApiError";
import { success } from "../utils/apiResponse";
import { signToken } from "../utils/jwt";
import { env } from "../config/env";

import {
  generateUniqueStudentId,
  hashPassword,
  findUserByEmailOrStudentId,
  assertActive,
} from "../services/auth.service";

/* =========================================================
   COOKIE HELPERS
========================================================= */

function setAuthCookie(res: Response, token: string) {
  res.cookie(env.cookieName, token, {
    httpOnly: true,
    secure: env.nodeEnv === "production",
    sameSite: env.nodeEnv === "production" ? "none" : "lax",
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });
}

const sessionCookieName = `${env.cookieName}_session`;

function setSessionCookie(res: Response, sessionId: string) {
  res.cookie(sessionCookieName, sessionId, {
    httpOnly: true,
    secure: env.nodeEnv === "production",
    sameSite: env.nodeEnv === "production" ? "none" : "lax",
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });
}

function clearSessionCookie(res: Response) {
  res.clearCookie(sessionCookieName, {
    httpOnly: true,
    secure: env.nodeEnv === "production",
    sameSite: env.nodeEnv === "production" ? "none" : "lax",
  });
}

/* =========================================================
   SESSION HELPERS
========================================================= */

function generateSessionId() {
  return crypto.randomBytes(32).toString("hex");
}

function getIpAddress(req: Request) {
  const forwarded = req.headers["x-forwarded-for"];

  if (typeof forwarded === "string") {
    return forwarded.split(",")[0].trim();
  }

  if (Array.isArray(forwarded) && forwarded.length > 0) {
    return forwarded[0];
  }

  return req.ip || req.socket.remoteAddress || undefined;
}

async function createLoginSession(
  req: Request,
  userId: string,
  role: "ADMIN" | "STUDENT",
  studentId?: string
) {
  const sessionId = generateSessionId();
  const now = new Date();

  await LoginSession.create({
    user: userId,
    role,
    student: studentId || undefined,
    sessionId,
    loginAt: now,
    lastActiveAt: now,
    isOnline: true,
    userAgent: req.get("user-agent") || undefined,
    ipAddress: getIpAddress(req),
  });

  return sessionId;
}

/* =========================================================
   REGISTER STUDENT
========================================================= */

export const registerStudent = asyncHandler(
  async (req: Request, res: Response) => {
    const {
      fullName,
      email,
      phone,
      password,
      dateOfBirth,
      gender,
      address,
      class: className,
      group,
      course,
    } = req.body;

    const existing = await User.findOne({
      email: email.toLowerCase(),
    });

    if (existing) {
      throw new ApiError(
        409,
        "An account with this email already exists"
      );
    }

    const passwordHash = await hashPassword(password);

    const user = await User.create({
      email: email.toLowerCase(),
      passwordHash,
      role: "STUDENT",
    });

    const studentId = await generateUniqueStudentId();

    const student = await Student.create({
      user: user._id,
      studentId,
      fullName,
      phone,
      dateOfBirth,
      gender,
      address,
      class: className,
      group,
      course: course || undefined,
    });

    const token = signToken({
      userId: String(user._id),
      role: "STUDENT",
    });

    setAuthCookie(res, token);

    return success(
      res,
      {
        token,
        student: {
          id: student._id,
          studentId: student.studentId,
          fullName: student.fullName,
          email: user.email,
        },
      },
      "Registration successful",
      201
    );
  }
);

/* =========================================================
   NORMAL LOGIN
========================================================= */

export const login = asyncHandler(
  async (req: Request, res: Response) => {
    const { identifier, password } = req.body;

    const user = await findUserByEmailOrStudentId(identifier);

    if (!user) {
      throw new ApiError(401, "Invalid credentials");
    }

    assertActive(user.isActive);

    const isMatch = await user.comparePassword(password);

    if (!isMatch) {
      throw new ApiError(401, "Invalid credentials");
    }

    user.lastLoginAt = new Date();
    await user.save();

    const token = signToken({
      userId: String(user._id),
      role: user.role,
    });

    setAuthCookie(res, token);

    let profile: unknown = null;

    /* -------------------------
       STUDENT LOGIN
    ------------------------- */

    if (user.role === "STUDENT") {
      const student = await Student.findOne({
        user: user._id,
      }).populate("course", "title");

      profile = student;

      if (student) {
        const sessionId = await createLoginSession(
          req,
          String(user._id),
          "STUDENT",
          String(student._id)
        );

        setSessionCookie(res, sessionId);
      }
    }

    /* -------------------------
       ADMIN LOGIN
    ------------------------- */

    else {
      profile = await Admin.findOne({
        user: user._id,
      });

      const sessionId = await createLoginSession(
        req,
        String(user._id),
        "ADMIN"
      );

      setSessionCookie(res, sessionId);
    }

    return success(
      res,
      {
        token,
        role: user.role,
        profile,
      },
      "Login successful"
    );
  }
);

/* =========================================================
   ADMIN LOGIN
========================================================= */

export const adminLogin = asyncHandler(
  async (req: Request, res: Response) => {
    const { email, password } = req.body;

    const user = await User.findOne({
      email: email.toLowerCase(),
      role: "ADMIN",
    }).select("+passwordHash");

    if (!user) {
      throw new ApiError(
        401,
        "Invalid admin credentials"
      );
    }

    assertActive(user.isActive);

    const isMatch = await user.comparePassword(password);

    if (!isMatch) {
      throw new ApiError(
        401,
        "Invalid admin credentials"
      );
    }

    user.lastLoginAt = new Date();
    await user.save();

    const token = signToken({
      userId: String(user._id),
      role: "ADMIN",
    });

    setAuthCookie(res, token);

    const sessionId = await createLoginSession(
      req,
      String(user._id),
      "ADMIN"
    );

    setSessionCookie(res, sessionId);

    const profile = await Admin.findOne({
      user: user._id,
    });

    return success(
      res,
      {
        token,
        role: user.role,
        profile,
      },
      "Admin login successful"
    );
  }
);

/* =========================================================
   HEARTBEAT
========================================================= */

/**
 * Frontend will call this endpoint periodically
 * while the user is logged in.
 *
 * Example:
 * every 20-30 seconds
 *
 * This keeps lastActiveAt updated.
 */
export const heartbeat = asyncHandler(
  async (req: Request, res: Response) => {
    if (!req.auth) {
      throw new ApiError(
        401,
        "Not authenticated"
      );
    }

    const sessionId =
      req.cookies?.[sessionCookieName];

    if (!sessionId) {
      throw new ApiError(
        401,
        "Active session not found"
      );
    }

    const session = await LoginSession.findOne({
      sessionId,
      user: req.auth.userId,
      isOnline: true,
    });

    if (!session) {
      throw new ApiError(
        401,
        "Active session not found"
      );
    }

    const now = new Date();

    session.lastActiveAt = now;

    await session.save();

    return success(
      res,
      {
        online: true,
        lastActiveAt: now,
      },
      "Session active"
    );
  }
);

/* =========================================================
   LOGOUT
========================================================= */

export const logout = asyncHandler(
  async (req: Request, res: Response) => {
    const sessionId =
      req.cookies?.[sessionCookieName];

    /* -------------------------
       Mark current session offline
    ------------------------- */

    if (sessionId) {
      await LoginSession.updateOne(
        {
          sessionId,
          isOnline: true,
        },
        {
          $set: {
            isOnline: false,
            logoutAt: new Date(),
            lastActiveAt: new Date(),
          },
        }
      );
    }

    /* -------------------------
       Fallback:
       If session cookie is missing,
       mark user's online sessions offline.
    ------------------------- */

    else if (req.auth?.userId) {
      await LoginSession.updateMany(
        {
          user: req.auth.userId,
          isOnline: true,
        },
        {
          $set: {
            isOnline: false,
            logoutAt: new Date(),
            lastActiveAt: new Date(),
          },
        }
      );
    }

    res.clearCookie(env.cookieName, {
      httpOnly: true,
      secure: env.nodeEnv === "production",
      sameSite:
        env.nodeEnv === "production"
          ? "none"
          : "lax",
    });

    clearSessionCookie(res);

    return success(
      res,
      {},
      "Logged out successfully"
    );
  }
);

/* =========================================================
   ME
========================================================= */

export const me = asyncHandler(
  async (req: Request, res: Response) => {
    if (!req.auth) {
      throw new ApiError(
        401,
        "Not authenticated"
      );
    }

    const user = await User.findById(
      req.auth.userId
    );

    if (!user) {
      throw new ApiError(
        404,
        "User not found"
      );
    }

    let profile: unknown = null;

    if (user.role === "STUDENT") {
      profile = await Student.findOne({
        user: user._id,
      }).populate("course", "title");
    } else {
      profile = await Admin.findOne({
        user: user._id,
      });
    }

    return success(
      res,
      {
        email: user.email,
        role: user.role,
        profile,
      }
    );
  }
);

/* =========================================================
   FORGOT PASSWORD
========================================================= */

export const forgotPassword = asyncHandler(
  async (req: Request, res: Response) => {
    const { email } = req.body;

    const user = await User.findOne({
      email: email.toLowerCase(),
    });

    // Always respond the same way to avoid
    // leaking which emails exist.
    if (!user) {
      return success(
        res,
        {},
        "If that email exists, a reset link has been sent"
      );
    }

    const rawToken = crypto
      .randomBytes(32)
      .toString("hex");

    user.resetPasswordToken = crypto
      .createHash("sha256")
      .update(rawToken)
      .digest("hex");

    user.resetPasswordExpires = new Date(
      Date.now() + 60 * 60 * 1000
    );

    await user.save();

    const resetUrl =
      `${env.clientUrl}/reset-password/${rawToken}`;

    console.log(
      `[DEV] Password reset link for ${user.email}: ${resetUrl}`
    );

    return success(
      res,
      env.nodeEnv === "development"
        ? { resetUrl }
        : {},
      "If that email exists, a reset link has been sent"
    );
  }
);

/* =========================================================
   RESET PASSWORD
========================================================= */

export const resetPassword = asyncHandler(
  async (req: Request, res: Response) => {
    const { token } = req.params;
    const { password } = req.body;

    const hashedToken = crypto
      .createHash("sha256")
      .update(token)
      .digest("hex");

    const user = await User.findOne({
      resetPasswordToken: hashedToken,
      resetPasswordExpires: {
        $gt: new Date(),
      },
    }).select(
      "+passwordHash +resetPasswordToken +resetPasswordExpires"
    );

    if (!user) {
      throw new ApiError(
        400,
        "Reset link is invalid or has expired"
      );
    }

    user.passwordHash =
      await hashPassword(password);

    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;

    await user.save();

    return success(
      res,
      {},
      "Password has been reset. Please log in with your new password."
    );
  }
);