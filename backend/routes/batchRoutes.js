import express from "express";
import {
  createBatch,
  getInstructorBatches,
  assignCourseToBatch,
  addStudentToBatch,
  deleteBatch
} from "../controllers/batchController.js";

import { verifyToken } from "../middlewares/authMiddleware.js";
import { isInstructor } from "../middlewares/roleMiddleware.js";

const router = express.Router();

router.post("/", verifyToken, isInstructor, createBatch);
router.get("/", verifyToken, isInstructor, getInstructorBatches);
router.post("/:batchId/assign-course", verifyToken, isInstructor, assignCourseToBatch);
router.post("/:batchId/add-student", verifyToken, isInstructor, addStudentToBatch);
router.delete("/:batchId", verifyToken, isInstructor, deleteBatch);

export default router;
