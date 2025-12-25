import express from "express";
import multer from "multer";
import { uploadAvatar } from "../controllers/upload.controller.js";
import { verifyToken } from "../utils/verifyUser.js";

const router = express.Router();

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 3 * 1024 * 1024 },
});

router.post("/", verifyToken, upload.single("file"), uploadAvatar);

export default router;