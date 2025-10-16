import express from "express";
import {
  createBatch,
  getInstructorBatches,
  assignCourseToBatch,
  addStudentToBatch,
  deleteBatch
} from "../controllers/batchController.js";

import { verifyToken } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/", verifyToken, createBatch);
router.get("/", verifyToken, getInstructorBatches);
router.post("/:batchId/assign-course", verifyToken, assignCourseToBatch);
router.post("/:batchId/add-student", verifyToken, addStudentToBatch);
router.delete("/:batchId", verifyToken, deleteBatch);

export default router;
