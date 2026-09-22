import { Router } from "express";
import { requireAuth, requireRole } from "../middleware/auth";
import { uploadStudentPhoto } from "../middleware/upload";
import {
  listStudents,
  getStudent,
  createStudent,
  updateStudent,
  deleteStudent,
  toggleStudentActive,
  resetStudentPassword,
  getMyProfile,
  updateMyProfile,
  changeMyPassword,
} from "../controllers/student.controller";
import { asyncHandler } from "../utils/asyncHandler";
import { success } from "../utils/apiResponse";
import { Student } from "../models/Student";

const router = Router();

// --- Student self-service (must come before /:id routes) ---
router.get("/me", requireAuth, requireRole("STUDENT"), getMyProfile);
router.put("/me", requireAuth, requireRole("STUDENT"), updateMyProfile);
router.put("/me/password", requireAuth, requireRole("STUDENT"), changeMyPassword);
router.post(
  "/me/photo",
  requireAuth,
  requireRole("STUDENT"),
  uploadStudentPhoto.single("photo"),
  asyncHandler(async (req, res) => {
    const path = `/uploads/students/${req.file!.filename}`;
    const student = await Student.findOneAndUpdate({ user: req.auth!.userId }, { profilePhoto: path }, { new: true });
    return success(res, student, "Photo updated");
  })
);

// --- Admin management ---
router.get("/", requireAuth, requireRole("ADMIN"), listStudents);
router.post("/", requireAuth, requireRole("ADMIN"), createStudent);
router.get("/:id", requireAuth, requireRole("ADMIN"), getStudent);
router.put("/:id", requireAuth, requireRole("ADMIN"), updateStudent);
router.delete("/:id", requireAuth, requireRole("ADMIN"), deleteStudent);
router.patch("/:id/toggle-active", requireAuth, requireRole("ADMIN"), toggleStudentActive);
router.post("/:id/reset-password", requireAuth, requireRole("ADMIN"), resetStudentPassword);

export default router;
