// middleware/multer.js
import multer from "multer";

// Multer will temporarily store file in memory
const storage = multer.memoryStorage();

export const upload = multer({
  storage,
  limits: {
    fileSize: 200 * 1024 * 1024 // 200MB max per file
  }
});
