import { Router } from "express";

import {
  requireAuth,
  requireRole,
} from "../middleware/auth";

import {
  resolveOwnStudentId,
} from "../middleware/resolveStudent";

import {
  listResults,
  getResult,
  createResult,
  updateResult,
  deleteResult,
  listResultsByStudent,
  resultHistory,
  myResults,
} from "../controllers/result.controller";

const router = Router();

// =====================================================
// STUDENT
// =====================================================

router.get(
  "/my",
  requireAuth,
  requireRole("STUDENT"),
  resolveOwnStudentId,
  myResults
);

// =====================================================
// ADMIN - FULL RESULT HISTORY
// IMPORTANT: Keep this BEFORE /:id
// =====================================================

router.get(
  "/history",
  requireAuth,
  requireRole("ADMIN"),
  resultHistory
);

// =====================================================
// ADMIN - RESULT LIST
// =====================================================

router.get(
  "/",
  requireAuth,
  requireRole("ADMIN"),
  listResults
);

// =====================================================
// ADMIN - CREATE RESULT
// =====================================================

router.post(
  "/",
  requireAuth,
  requireRole("ADMIN"),
  createResult
);

// =====================================================
// ADMIN - STUDENT WISE RESULTS
// =====================================================

router.get(
  "/student/:studentId",
  requireAuth,
  requireRole("ADMIN"),
  listResultsByStudent
);

// =====================================================
// ADMIN - SINGLE RESULT
// =====================================================

router.get(
  "/:id",
  requireAuth,
  requireRole("ADMIN"),
  getResult
);

// =====================================================
// ADMIN - UPDATE RESULT
// =====================================================

router.put(
  "/:id",
  requireAuth,
  requireRole("ADMIN"),
  updateResult
);

// =====================================================
// ADMIN - DELETE RESULT
// =====================================================

router.delete(
  "/:id",
  requireAuth,
  requireRole("ADMIN"),
  deleteResult
);

export default router;