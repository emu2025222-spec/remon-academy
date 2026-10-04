import { Router } from "express";
import { requireAuth, requireRole } from "../middleware/auth";
import { resolveOwnStudentId } from "../middleware/resolveStudent";
import { listResults, getResult, createResult, updateResult, deleteResult, listResultsByStudent, myResults } from "../controllers/result.controller";

const router = Router();

router.get("/my", requireAuth, requireRole("STUDENT"), resolveOwnStudentId, myResults);

router.get("/", requireAuth, requireRole("ADMIN"), listResults);
router.post("/", requireAuth, requireRole("ADMIN"), createResult);
router.get("/student/:studentId", requireAuth, requireRole("ADMIN"), listResultsByStudent);
router.get("/:id", requireAuth, requireRole("ADMIN"), getResult);
router.put("/:id", requireAuth, requireRole("ADMIN"), updateResult);
router.delete("/:id", requireAuth, requireRole("ADMIN"), deleteResult);

export default router;
