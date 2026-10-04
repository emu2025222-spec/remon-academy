import { Router } from "express";
import { requireAuth, requireRole } from "../middleware/auth";
import { resolveOwnStudentId } from "../middleware/resolveStudent";
import { listAttendance, bulkMarkAttendance, deleteAttendance, myAttendanceSummary } from "../controllers/attendance.controller";

const router = Router();

router.get("/my", requireAuth, requireRole("STUDENT"), resolveOwnStudentId, myAttendanceSummary);

router.get("/", requireAuth, requireRole("ADMIN"), listAttendance);
router.post("/bulk", requireAuth, requireRole("ADMIN"), bulkMarkAttendance);
router.delete("/:id", requireAuth, requireRole("ADMIN"), deleteAttendance);

export default router;
