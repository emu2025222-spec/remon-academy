import { Router } from "express";
import { requireAuth, requireRole } from "../middleware/auth";
import { resolveOwnStudentId } from "../middleware/resolveStudent";
import { listSchedule, getSchedule, createSchedule, updateSchedule, deleteSchedule, myClassSchedule } from "../controllers/schedule.controller";

const router = Router();

router.get("/my", requireAuth, requireRole("STUDENT"), resolveOwnStudentId, myClassSchedule);

router.get("/", requireAuth, requireRole("ADMIN"), listSchedule);
router.post("/", requireAuth, requireRole("ADMIN"), createSchedule);
router.get("/:id", requireAuth, requireRole("ADMIN"), getSchedule);
router.put("/:id", requireAuth, requireRole("ADMIN"), updateSchedule);
router.delete("/:id", requireAuth, requireRole("ADMIN"), deleteSchedule);

export default router;
