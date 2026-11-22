import { Router } from "express";

import {
  createEnrollmentRequest,
  listEnrollmentRequests,
  getEnrollmentRequest,
  rejectEnrollmentRequest,
} from "../controllers/enrollment.controller";

import {
  approveEnrollmentRequest,
} from "../controllers/enrollmentApproval.controller";

import {
  requireAuth,
  requireRole,
} from "../middleware/auth";

const router = Router();

/*
|--------------------------------------------------------------------------
| PUBLIC: SUBMIT ENROLLMENT
|--------------------------------------------------------------------------
*/

router.post("/", createEnrollmentRequest);

/*
|--------------------------------------------------------------------------
| ADMIN: ENROLLMENT MANAGEMENT
|--------------------------------------------------------------------------
*/

router.get(
  "/",
  requireAuth,
  requireRole("ADMIN"),
  listEnrollmentRequests
);

router.get(
  "/:id",
  requireAuth,
  requireRole("ADMIN"),
  getEnrollmentRequest
);

router.patch(
  "/:id/approve",
  requireAuth,
  requireRole("ADMIN"),
  approveEnrollmentRequest
);

router.patch(
  "/:id/reject",
  requireAuth,
  requireRole("ADMIN"),
  rejectEnrollmentRequest
);

export default router;