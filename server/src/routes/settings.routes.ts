import { Router } from "express";
import { requireAuth, requireRole } from "../middleware/auth";
import { getSettings, updateSettings } from "../controllers/settings.controller";

const router = Router();

router.get("/", getSettings);
router.put("/", requireAuth, requireRole("ADMIN"), updateSettings);

export default router;
