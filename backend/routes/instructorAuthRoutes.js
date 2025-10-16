import express from "express";
import {
  registerInstructor,
  loginInstructor,
  logoutInstructor,
  getInstructorProfile
} from "../controllers/instructorAuthController.js";
import { verifyToken } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/register", registerInstructor);
router.post("/login", loginInstructor);
router.post("/logout", verifyToken, logoutInstructor);
router.get("/me", verifyToken, getInstructorProfile);

export default router;
