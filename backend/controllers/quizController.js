import Quiz from "../models/Quiz.js";
import Lesson from "../models/Lesson.js";

// ➕ Create a new quiz for a lesson
export const createQuiz = async (req, res) => {
  try {
    const { lessonId } = req.params;
    const { title, questions } = req.body;

    const lesson = await Lesson.findById(lessonId);
    if (!lesson) return res.status(404).json({ message: "Lesson not found" });

    const quiz = await Quiz.create({
      lesson: lessonId,
      title,
      questions,
    });

    res.status(201).json({ message: "Quiz created successfully", quiz });
  } catch (err) {
    console.error("Create quiz error:", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

// ✏️ Update quiz
export const updateQuiz = async (req, res) => {
  try {
    const { quizId } = req.params;
    const { title, questions } = req.body;

    const quiz = await Quiz.findById(quizId).populate("lesson");
    if (!quiz) return res.status(404).json({ message: "Quiz not found" });

    if (title) quiz.title = title;
    if (questions) quiz.questions = questions;

    await quiz.save();
    res.status(200).json({ message: "Quiz updated successfully", quiz });
  } catch (err) {
    console.error("Update quiz error:", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

// 🗑️ Delete quiz
export const deleteQuiz = async (req, res) => {
  try {
    const { quizId } = req.params;

    const quiz = await Quiz.findById(quizId).populate("lesson");
    if (!quiz) return res.status(404).json({ message: "Quiz not found" });

    await quiz.deleteOne();
    res.status(200).json({ message: "Quiz deleted successfully" });
  } catch (err) {
    console.error("Delete quiz error:", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

// 📖 Get all quizzes for a lesson
export const getQuizzesByLesson = async (req, res) => {
  try {
    const { lessonId } = req.params;

    const lesson = await Lesson.findById(lessonId);
    if (!lesson) return res.status(404).json({ message: "Lesson not found" });

    const quizzes = await Quiz.find({ lesson: lessonId }).sort({ createdAt: -1 });
    res.status(200).json({ quizzes });
  } catch (err) {
    console.error("Get quizzes error:", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

// 📄 Get single quiz
export const getQuizById = async (req, res) => {
  try {
    const { quizId } = req.params;

    const quiz = await Quiz.findById(quizId).populate("lesson");
    if (!quiz) return res.status(404).json({ message: "Quiz not found" });

    res.status(200).json({ quiz });
  } catch (err) {
    console.error("Get quiz error:", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
};
