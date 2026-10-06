import { Router } from "express";
import rateLimit from "express-rate-limit";

import { validate } from "../middleware/validate";
import { requireAuth } from "../middleware/auth";

import {
  registerSchema,
  loginSchema,
  adminLoginSchema,
  forgotPasswordSchema,
  resetPasswordSchema,
} from "../utils/validators";

import {
  registerStudent,
  login,
  adminLogin,
  logout,
  me,
  forgotPassword,
  resetPassword,
  heartbeat,
} from "../controllers/auth.controller";

const router = Router();

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 20,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    message: "Too many attempts. Please try again later.",
    errors: [],
  },
});

/* =========================================================
   REGISTER
========================================================= */

router.post(
  "/register",
  authLimiter,
  validate(registerSchema),
  registerStudent
);

/* =========================================================
   STUDENT LOGIN
========================================================= */

router.post(
  "/login",
  authLimiter,
  validate(loginSchema),
  login
);

/* =========================================================
   ADMIN LOGIN
========================================================= */

router.post(
  "/admin/login",
  authLimiter,
  validate(adminLoginSchema),
  adminLogin
);

/* =========================================================
   LOGOUT
========================================================= */

router.post(
  "/logout",
  logout
);

/* =========================================================
   CURRENT USER
========================================================= */

router.get(
  "/me",
  requireAuth,
  me
);

/* =========================================================
   LIVE SESSION HEARTBEAT
========================================================= */

router.post(
  "/heartbeat",
  requireAuth,
  heartbeat
);

/* =========================================================
   FORGOT PASSWORD
========================================================= */

router.post(
  "/forgot-password",
  authLimiter,
  validate(forgotPasswordSchema),
  forgotPassword
);

/* =========================================================
   RESET PASSWORD
========================================================= */

router.post(
  "/reset-password/:token",
  authLimiter,
  validate(resetPasswordSchema),
  resetPassword
);

export default router;