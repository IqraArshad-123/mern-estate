import express from "express";
import multer from "multer";
import { uploadAvatar, uploadListingImages } from "../controllers/upload.controller.js";
import { verifyToken } from "../utils/verifyUser.js";

const router = express.Router();

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 3 * 1024 * 1024 },
});

router.post("/", verifyToken, upload.single("file"), uploadAvatar);
router.post("/listing-images", verifyToken, upload.array("images", 6), uploadListingImages)

export default router;

// import express from "express";
// import multer from "multer";
// import {
//   uploadAvatar,
//   uploadListingImages,
// } from "../controllers/upload.controller.js";
// import { verifyToken } from "../utils/verifyUser.js";

// const router = express.Router();
// const upload = multer({ storage: multer.memoryStorage() });

// router.post(
//   "/avatar",
//   verifyToken,
//   upload.single("avatar"),
//   uploadAvatar
// );

// router.post(
//   "/listing-images",
//   verifyToken,
//   upload.array("images", 6),
//   uploadListingImages
// );

// export default router;

// import express from "express";
// import multer from "multer";
// import {uploadAvatar, uploadListingImages } from "../controllers/upload.controller.js";

// const router = express.Router();
// const upload = multer({ storage: multer.memoryStorage() });


// router.post("/avatar", upload.single("avatar"), uploadAvatar);

// // THIS IS THE FIX → Route must match frontend fetch
// router.post(
//   "/listing-images", // <-- exact same as frontend fetch
//   upload.array("images", 6), 
//   uploadListingImages
// );

// export default router;
