import { Router } from "express";

import { requireAuth, requireRole } from "../middleware/auth";

import { resolveOwnStudentId } from "../middleware/resolveStudent";

import {
  listFees,
  getFee,
  createFee,
  updateFee,
  deleteFee,
  myFees,
  summaryFees,
} from "../controllers/fee.controller";

import {
  createPaymentRequest,
  myPaymentRequests,
  listPaymentRequests,
  approvePaymentRequest,
  rejectPaymentRequest,
  paymentInfo,
} from "../controllers/paymentRequest.controller";

const router = Router();

/* =========================================================
   STUDENT FEE ROUTES
========================================================= */

router.get(
  "/my",
  requireAuth,
  requireRole("STUDENT"),
  resolveOwnStudentId,
  myFees
);

/* =========================================================
   STUDENT PAYMENT INFO
========================================================= */

router.get(
  "/payment-info",
  requireAuth,
  requireRole("STUDENT"),
  paymentInfo
);

/* =========================================================
   STUDENT PAYMENT REQUEST ROUTES
========================================================= */

router.post(
  "/payment-requests",
  requireAuth,
  requireRole("STUDENT"),
  createPaymentRequest
);

router.get(
  "/payment-requests/my",
  requireAuth,
  requireRole("STUDENT"),
  myPaymentRequests
);

/* =========================================================
   ADMIN PAYMENT REQUEST ROUTES
========================================================= */

router.get(
  "/payment-requests",
  requireAuth,
  requireRole("ADMIN"),
  listPaymentRequests
);

router.post(
  "/payment-requests/:id/approve",
  requireAuth,
  requireRole("ADMIN"),
  approvePaymentRequest
);

router.post(
  "/payment-requests/:id/reject",
  requireAuth,
  requireRole("ADMIN"),
  rejectPaymentRequest
);

/* =========================================================
   ADMIN FEE ROUTES
========================================================= */

router.get(
  "/summary",
  requireAuth,
  requireRole("ADMIN"),
  summaryFees
);

router.get(
  "/",
  requireAuth,
  requireRole("ADMIN"),
  listFees
);

router.post(
  "/",
  requireAuth,
  requireRole("ADMIN"),
  createFee
);

router.get(
  "/:id",
  requireAuth,
  requireRole("ADMIN"),
  getFee
);

router.put(
  "/:id",
  requireAuth,
  requireRole("ADMIN"),
  updateFee
);

router.delete(
  "/:id",
  requireAuth,
  requireRole("ADMIN"),
  deleteFee
);

export default router;