import express from "express";
import {
  createCourse,
  getInstructorCourses,
  getCourseById,
  updateCourse,
  deleteCourse,
  assignCourseToBatches,
  togglePublishStatus
} from "../controllers/courseController.js";
import { verifyToken } from "../middleware/authMiddleware.js";

const router = express.Router();

// All routes verifyTokened
router.use(verifyToken);

router.post("/",verifyToken, createCourse);
router.get("/", verifyToken, getInstructorCourses);
router.get("/:id", verifyToken, getCourseById);
router.put("/:id", verifyToken, updateCourse);
router.delete("/:id", verifyToken, deleteCourse);
router.put("/:id/assign", verifyToken, assignCourseToBatches);
router.put("/:id/toggle-publish", verifyToken, togglePublishStatus);

export default router;
