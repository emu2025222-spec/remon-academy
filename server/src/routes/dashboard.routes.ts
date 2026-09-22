import { Router } from "express";
import { requireAuth, requireRole } from "../middleware/auth";
import { publicStats, adminDashboardStats, studentGrowthChart } from "../controllers/dashboard.controller";

const router = Router();

router.get("/public-stats", publicStats);
router.get("/admin-stats", requireAuth, requireRole("ADMIN"), adminDashboardStats);
router.get("/student-growth", requireAuth, requireRole("ADMIN"), studentGrowthChart);

export default router;
