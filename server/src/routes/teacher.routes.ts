import { Router } from "express";
import { requireAuth, requireRole } from "../middleware/auth";
import { uploadTeacherPhoto } from "../middleware/upload";
import {
  listTeachers,
  getTeacher,
  createTeacher,
  updateTeacher,
  deleteTeacher,
  listActiveTeachers,
  toggleTeacherActive,
} from "../controllers/teacher.controller";
import { asyncHandler } from "../utils/asyncHandler";
import { success } from "../utils/apiResponse";
import { Teacher } from "../models/Teacher";

const router = Router();

router.get("/public", listActiveTeachers);

router.get("/", requireAuth, requireRole("ADMIN"), listTeachers);
router.post("/", requireAuth, requireRole("ADMIN"), createTeacher);
router.get("/:id", requireAuth, requireRole("ADMIN"), getTeacher);
router.put("/:id", requireAuth, requireRole("ADMIN"), updateTeacher);
router.delete("/:id", requireAuth, requireRole("ADMIN"), deleteTeacher);
router.patch("/:id/toggle-active", requireAuth, requireRole("ADMIN"), toggleTeacherActive);
router.post(
  "/:id/photo",
  requireAuth,
  requireRole("ADMIN"),
  uploadTeacherPhoto.single("photo"),
  asyncHandler(async (req, res) => {
    const path = `/uploads/teachers/${req.file!.filename}`;
    const teacher = await Teacher.findByIdAndUpdate(req.params.id, { photo: path }, { new: true });
    return success(res, teacher, "Teacher photo updated");
  })
);

export default router;
