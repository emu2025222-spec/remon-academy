import { Router } from "express";

import {
  listResultPublications,
  createResultPublication,
  updateResultPublication,
  toggleResultPublication,
  deleteResultPublication,
  getPublicResultPublicationStatus,
  publicSearchResult,
} from "../controllers/resultPublication.controller";

import { requireAuth, requireRole } from "../middleware/auth";

const router = Router();

// ==========================================
// PUBLIC ROUTES
// ==========================================

router.get(
  "/public/status",
  getPublicResultPublicationStatus
);

router.post(
  "/public/search",
  publicSearchResult
);

// ==========================================
// ADMIN ROUTES
// ==========================================

router.use(requireAuth);
router.use(requireRole("ADMIN"));

router.get(
  "/",
  listResultPublications
);

router.post(
  "/",
  createResultPublication
);

router.put(
  "/:id",
  updateResultPublication
);

router.patch(
  "/:id/toggle",
  toggleResultPublication
);

router.delete(
  "/:id",
  deleteResultPublication
);

export default router;