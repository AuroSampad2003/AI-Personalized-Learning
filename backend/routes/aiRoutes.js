import express from "express";
import { verifyToken } from "../middlewares/authMiddleware.js";
import { isInstructor } from "../middlewares/roleMiddleware.js";
import { generateQuiz, generateSummary } from "../controllers/aiController.js";

const router = express.Router();

router.post("/quiz/:lessonId", verifyToken, isInstructor, generateQuiz);
router.post("/summary/:lessonId", verifyToken, isInstructor, generateSummary);
// router.post("/flashcards/:lessonId", verifyToken, isInstructor, generateFlashcards);

export default router;
