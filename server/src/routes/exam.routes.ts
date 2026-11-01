import { Router } from "express";

import { requireAuth, requireRole } from "../middleware/auth";

import {
  createExam,
  listExams,
  getExam,
  updateExam,
  deleteExam,
  toggleExamPublish,
  listMyExams,
  getStudentExam,
  startExam,
  saveExamAnswers,
  submitExam,
  getExamReview,
  getExamResults,
} from "../controllers/exam.controller";

import { asyncHandler } from "../utils/asyncHandler";

const router = Router();

// All exam routes require authentication
router.use(requireAuth);

// ==========================================
// STUDENT ROUTES
// ==========================================

router.get(
  "/my",
  requireRole("STUDENT"),
  listMyExams
);

router.get(
  "/my/:id/review",
  requireRole("STUDENT"),
  getExamReview
);

router.get(
  "/my/:id",
  requireRole("STUDENT"),
  getStudentExam
);

router.post(
  "/my/:id/start",
  requireRole("STUDENT"),
  startExam
);

router.put(
  "/attempts/:attemptId/answers",
  requireRole("STUDENT"),
  saveExamAnswers
);

router.post(
  "/attempts/:attemptId/submit",
  requireRole("STUDENT"),
  submitExam
);

// ==========================================
// ADMIN ROUTES
// ==========================================

router.get(
  "/",
  requireRole("ADMIN"),
  listExams
);

router.post(
  "/",
  requireRole("ADMIN"),
  createExam
);

router.get(
  "/:id/results",
  requireRole("ADMIN"),
  getExamResults
);

router.get(
  "/:id",
  requireRole("ADMIN"),
  getExam
);

router.put(
  "/:id",
  requireRole("ADMIN"),
  updateExam
);

router.delete(
  "/:id",
  requireRole("ADMIN"),
  deleteExam
);

router.patch(
  "/:id/toggle-publish",
  requireRole("ADMIN"),
  toggleExamPublish
);

export default router;