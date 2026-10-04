import { Router } from "express";
import { requireAuth, requireRole } from "../middleware/auth";
import { resolveOwnStudentId } from "../middleware/resolveStudent";
import { uploadAssignmentFile } from "../middleware/upload";
import {
  listAssignments,
  getAssignment,
  createAssignment,
  updateAssignment,
  deleteAssignment,
  listAssignmentsForStudent,
  submitAssignment,
  listSubmissionsForAssignment,
  gradeSubmission,
} from "../controllers/assignment.controller";

const router = Router();

router.get("/my", requireAuth, requireRole("STUDENT"), resolveOwnStudentId, listAssignmentsForStudent);
router.post(
  "/:id/submit",
  requireAuth,
  requireRole("STUDENT"),
  resolveOwnStudentId,
  uploadAssignmentFile.single("file"),
  submitAssignment
);

router.get("/", requireAuth, requireRole("ADMIN"), listAssignments);
router.post("/", requireAuth, requireRole("ADMIN"), createAssignment);
router.get("/:id", requireAuth, requireRole("ADMIN"), getAssignment);
router.put("/:id", requireAuth, requireRole("ADMIN"), updateAssignment);
router.delete("/:id", requireAuth, requireRole("ADMIN"), deleteAssignment);
router.get("/:id/submissions", requireAuth, requireRole("ADMIN"), listSubmissionsForAssignment);
router.patch("/submissions/:submissionId/grade", requireAuth, requireRole("ADMIN"), gradeSubmission);

export default router;
