// models/Lesson.js
import mongoose from "mongoose";

const AssetSchema = new mongoose.Schema({
  url: { type: String, required: true },
  public_id: { type: String, required: true },
  resource_type: { type: String }, // "video", "image", "raw", etc.
  format: { type: String },
  original_filename: { type: String },
  bytes: { type: Number },
  label: { type: String },
  content: { type: String }
}, { _id: false });

const LessonSchema = new mongoose.Schema({
  course: { type: mongoose.Schema.Types.ObjectId, ref: "Course", required: true },
  title: { type: String, required: true },
  description: { type: String, default: "" },
  order: { type: Number, default: 0 },
  durationSec: { type: Number, default: 0 },
  assets: [AssetSchema],
  status: { type: String, enum: ["draft", "published"], default: "draft" },
  createdAt: { type: Date, default: Date.now },
  updatedAt: Date
});

export default mongoose.model("Lesson", LessonSchema);
