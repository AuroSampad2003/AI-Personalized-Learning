// routes/lessonRoutes.js
import express from "express";
import { verifyToken } from "../middlewares/authMiddleware.js";
import { isInstructor } from "../middlewares/roleMiddleware.js";
import { upload } from "../middlewares/multer.js";
import {
    createLesson,
    uploadAsset,
    uploadPdfAsset,
    getLesson,
    deleteAsset,
    deleteLesson
} from "../controllers/LessonController.js";

const router = express.Router();

router.post("/", verifyToken, isInstructor, createLesson);
router.get("/:id", verifyToken, isInstructor, getLesson);
router.post("/:lessonId/upload", verifyToken, isInstructor, upload.single("file"), uploadAsset);
router.delete("/:lessonId/assets", verifyToken, isInstructor, deleteAsset);
router.delete("/:id", verifyToken, isInstructor, deleteLesson);

router.post("/:lessonId/upload-pdf", verifyToken, isInstructor, upload.single("file"), uploadPdfAsset);    // problem

export default router;
