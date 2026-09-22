import { Router } from "express";
import { requireAuth, requireRole } from "../middleware/auth";
import { uploadGalleryImage } from "../middleware/upload";
import { listGallery, uploadGalleryImageHandler, deleteGalleryImage } from "../controllers/gallery.controller";

const router = Router();

router.get("/", listGallery);
router.post("/", requireAuth, requireRole("ADMIN"), uploadGalleryImage.single("image"), uploadGalleryImageHandler);
router.delete("/:id", requireAuth, requireRole("ADMIN"), deleteGalleryImage);

export default router;
