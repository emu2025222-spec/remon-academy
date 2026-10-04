import multer from "multer";
import path from "path";
import fs from "fs";
import { env } from "../config/env";

function makeStorage(subfolder: string) {
  const dest = path.join(process.cwd(), env.uploadDir, subfolder);
  if (!fs.existsSync(dest)) fs.mkdirSync(dest, { recursive: true });

  return multer.diskStorage({
    destination: (req, file, cb) => cb(null, dest),
    filename: (req, file, cb) => {
      const ext = path.extname(file.originalname);
      const unique = `${Date.now()}-${Math.round(Math.random() * 1e9)}${ext}`;
      cb(null, unique);
    },
  });
}

const imageFilter = (req: unknown, file: Express.Multer.File, cb: multer.FileFilterCallback) => {
  if (/^image\/(jpeg|png|webp|gif)$/.test(file.mimetype)) cb(null, true);
  else cb(new Error("Only image files (jpeg, png, webp, gif) are allowed"));
};

export const uploadStudentPhoto = multer({ storage: makeStorage("students"), fileFilter: imageFilter, limits: { fileSize: 3 * 1024 * 1024 } });
export const uploadTeacherPhoto = multer({ storage: makeStorage("teachers"), fileFilter: imageFilter, limits: { fileSize: 3 * 1024 * 1024 } });
export const uploadCourseImage = multer({ storage: makeStorage("courses"), fileFilter: imageFilter, limits: { fileSize: 3 * 1024 * 1024 } });
export const uploadGalleryImage = multer({ storage: makeStorage("gallery"), fileFilter: imageFilter, limits: { fileSize: 5 * 1024 * 1024 } });
export const uploadNoticeAttachment = multer({ storage: makeStorage("notices"), limits: { fileSize: 5 * 1024 * 1024 } });
export const uploadAssignmentFile = multer({ storage: makeStorage("assignments"), limits: { fileSize: 10 * 1024 * 1024 } });
