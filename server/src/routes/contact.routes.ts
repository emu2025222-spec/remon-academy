import { Router } from "express";
import { requireAuth, requireRole } from "../middleware/auth";
import { validate } from "../middleware/validate";
import { contactMessageSchema } from "../utils/validators";
import { submitContactMessage, listContactMessages, markMessageRead, deleteContactMessage } from "../controllers/contact.controller";

const router = Router();

router.post("/", validate(contactMessageSchema), submitContactMessage);

router.get("/", requireAuth, requireRole("ADMIN"), listContactMessages);
router.patch("/:id/read", requireAuth, requireRole("ADMIN"), markMessageRead);
router.delete("/:id", requireAuth, requireRole("ADMIN"), deleteContactMessage);

export default router;
