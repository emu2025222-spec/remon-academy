import { Router } from "express";
import { requireAuth, requireRole } from "../middleware/auth";
import { resolveOwnStudentId } from "../middleware/resolveStudent";
import { listFees, getFee, createFee, updateFee, deleteFee, myFees } from "../controllers/fee.controller";

const router = Router();

router.get("/my", requireAuth, requireRole("STUDENT"), resolveOwnStudentId, myFees);

router.get("/", requireAuth, requireRole("ADMIN"), listFees);
router.post("/", requireAuth, requireRole("ADMIN"), createFee);
router.get("/:id", requireAuth, requireRole("ADMIN"), getFee);
router.put("/:id", requireAuth, requireRole("ADMIN"), updateFee);
router.delete("/:id", requireAuth, requireRole("ADMIN"), deleteFee);

export default router;
