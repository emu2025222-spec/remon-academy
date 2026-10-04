import { Router } from "express";
import { requireAuth, requireRole } from "../middleware/auth";
import { uploadCourseImage } from "../middleware/upload";
import {
  listCourses,
  getCourse,
  createCourse,
  updateCourse,
  deleteCourse,
  getCourseBySlug,
  listPublishedCourses,
  togglePublishCourse,
} from "../controllers/course.controller";
import { asyncHandler } from "../utils/asyncHandler";
import { success } from "../utils/apiResponse";
import { Course } from "../models/Course";

const router = Router();

router.get("/public", listPublishedCourses);
router.get("/public/:slug", getCourseBySlug);

router.get("/", requireAuth, requireRole("ADMIN"), listCourses);
router.post("/", requireAuth, requireRole("ADMIN"), createCourse);
router.get("/:id", requireAuth, requireRole("ADMIN"), getCourse);
router.put("/:id", requireAuth, requireRole("ADMIN"), updateCourse);
router.delete("/:id", requireAuth, requireRole("ADMIN"), deleteCourse);
router.patch("/:id/toggle-publish", requireAuth, requireRole("ADMIN"), togglePublishCourse);
router.post(
  "/:id/image",
  requireAuth,
  requireRole("ADMIN"),
  uploadCourseImage.single("image"),
  asyncHandler(async (req, res) => {
    const path = `/uploads/courses/${req.file!.filename}`;
    const course = await Course.findByIdAndUpdate(req.params.id, { image: path }, { new: true });
    return success(res, course, "Course image updated");
  })
);

export default router;
