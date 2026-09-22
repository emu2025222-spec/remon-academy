import { Router } from "express";
import { requireAuth, requireRole } from "../middleware/auth";
import { uploadNoticeAttachment } from "../middleware/upload";
import {
  listNoticesAdmin,
  listPublishedNotices,
  getNoticeBySlug,
  getNotice,
  createNotice,
  updateNotice,
  deleteNotice,
  togglePublishNotice,
} from "../controllers/notice.controller";
import { asyncHandler } from "../utils/asyncHandler";
import { success } from "../utils/apiResponse";
import { Notice } from "../models/Notice";

const router = Router();

router.get("/public", listPublishedNotices);
router.get("/public/:slug", getNoticeBySlug);

router.get("/", requireAuth, requireRole("ADMIN"), listNoticesAdmin);
router.post("/", requireAuth, requireRole("ADMIN"), createNotice);
router.get("/:id", requireAuth, requireRole("ADMIN"), getNotice);
router.put("/:id", requireAuth, requireRole("ADMIN"), updateNotice);
router.delete("/:id", requireAuth, requireRole("ADMIN"), deleteNotice);
router.patch("/:id/toggle-publish", requireAuth, requireRole("ADMIN"), togglePublishNotice);
router.post(
  "/:id/attachment",
  requireAuth,
  requireRole("ADMIN"),
  uploadNoticeAttachment.single("attachment"),
  asyncHandler(async (req, res) => {
    const path = `/uploads/notices/${req.file!.filename}`;
    const notice = await Notice.findByIdAndUpdate(req.params.id, { attachment: path }, { new: true });
    return success(res, notice, "Attachment uploaded");
  })
);

export default router;
