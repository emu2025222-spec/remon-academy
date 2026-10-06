import { Router } from "express";

import {
  requireAuth,
  requireRole,
} from "../middleware/auth";

import {
  publicStats,
  adminDashboardStats,
  studentGrowthChart,
  onlineStudents,
  loginHistory,
} from "../controllers/dashboard.controller";

const router = Router();

/* =========================================================
   PUBLIC
========================================================= */

router.get(
  "/public-stats",
  publicStats
);

/* =========================================================
   ADMIN DASHBOARD
========================================================= */

router.get(
  "/admin-stats",
  requireAuth,
  requireRole("ADMIN"),
  adminDashboardStats
);

router.get(
  "/student-growth",
  requireAuth,
  requireRole("ADMIN"),
  studentGrowthChart
);

/* =========================================================
   LIVE ONLINE STUDENTS
========================================================= */

/**
 * Returns currently online students.
 *
 * Admin only.
 *
 * Frontend can poll this endpoint every few seconds
 * to show live online students.
 */

router.get(
  "/online-students",
  requireAuth,
  requireRole("ADMIN"),
  onlineStudents
);

/* =========================================================
   LOGIN HISTORY
========================================================= */

/**
 * Returns recent student/admin login sessions.
 *
 * Admin only.
 *
 * Optional query:
 *
 * /login-history?limit=100
 */

router.get(
  "/login-history",
  requireAuth,
  requireRole("ADMIN"),
  loginHistory
);

export default router;