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
} from "../controllers/auth.controller";

const router = Router();

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 20,
  standardHeaders: true,
  legacyHeaders: false,
  message: { success: false, message: "Too many attempts. Please try again later.", errors: [] },
});

router.post("/register", authLimiter, validate(registerSchema), registerStudent);
router.post("/login", authLimiter, validate(loginSchema), login);
router.post("/admin/login", authLimiter, validate(adminLoginSchema), adminLogin);
router.post("/logout", logout);
router.get("/me", requireAuth, me);
router.post("/forgot-password", authLimiter, validate(forgotPasswordSchema), forgotPassword);
router.post("/reset-password/:token", authLimiter, validate(resetPasswordSchema), resetPassword);

export default router;
