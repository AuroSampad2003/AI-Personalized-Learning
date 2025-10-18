import Quiz from "../models/Quiz.js";
import Summary from "../models/Summary.js";
// import Flashcard from "../models/Flashcard.js";
import Lesson from "../models/Lesson.js";
// import { generateAIQuiz, generateAISummary } from "../utils/aiService.js";
import { generateAIQuiz, generateAISummary } from "../utils/aiService.js";

/**
 * Generate AI Quiz for a lesson
 * POST /api/instructor/ai/quiz/:lessonId
 */
export const generateQuiz = async (req, res) => {
  try {
    const { lessonId } = req.params;
    const lesson = await Lesson.findById(lessonId);
    if (!lesson) return res.status(404).json({ message: "Lesson not found" });

    const questions = await generateAIQuiz(lesson); // returns array of questions
    const quiz = await Quiz.create({
      lesson: lesson._id,
      title: `AI Generated Quiz for ${lesson.title}`,
      generatedByAI: true,
      questions,
    });

    res.status(201).json({ message: "AI Quiz generated", quiz });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

/**
 * Generate AI Summary for a lesson
 * POST /api/instructor/ai/summary/:lessonId
 */
export const generateSummary = async (req, res) => {
  try {
    const { lessonId } = req.params;
    const lesson = await Lesson.findById(lessonId);
    if (!lesson) return res.status(404).json({ message: "Lesson not found" });

    const content = await generateAISummary(lesson); // string
    const summary = await Summary.create({ lesson: lesson._id, content });

    res.status(201).json({ message: "AI Summary generated", summary });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

/**
 * Generate AI Flashcards for a lesson
 * POST /api/instructor/ai/flashcards/:lessonId
 */
// export const generateFlashcards = async (req, res) => {
//   try {
//     const { lessonId } = req.params;
//     const lesson = await Lesson.findById(lessonId);
//     if (!lesson) return res.status(404).json({ message: "Lesson not found" });

//     const flashcardsData = await generateAIFlashcards(lesson); // array of {front, back}
//     const flashcards = await Flashcard.insertMany(
//       flashcardsData.map(f => ({ ...f, lesson: lesson._id }))
//     );

//     res.status(201).json({ message: "AI Flashcards generated", flashcards });
//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ message: "Server error", error: err.message });
//   }
// };
