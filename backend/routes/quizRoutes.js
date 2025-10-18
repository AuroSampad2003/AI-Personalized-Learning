import express from "express";
import { verifyToken } from "../middlewares/authMiddleware.js";
import { isInstructor } from "../middlewares/roleMiddleware.js";
import {
  createQuiz,
  updateQuiz,
  deleteQuiz,
  getQuizzesByLesson,
  getQuizById,
} from "../controllers/quizController.js";

const router = express.Router();

// Create quiz for lesson
router.post("/:lessonId", verifyToken, isInstructor, createQuiz);
// Update quiz
router.put("/:quizId", verifyToken, isInstructor, updateQuiz);
// Delete quiz
router.delete("/:quizId", verifyToken, isInstructor, deleteQuiz);
// Get all quizzes for a lesson
router.get("/lesson/:lessonId", verifyToken, isInstructor, getQuizzesByLesson);
// Get single quiz
router.get("/:quizId", verifyToken, isInstructor, getQuizById);

export default router;
