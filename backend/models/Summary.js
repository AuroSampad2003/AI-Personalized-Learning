import mongoose from "mongoose";

const SummarySchema = new mongoose.Schema({
  lesson: { type: mongoose.Schema.Types.ObjectId, ref: "Lesson", required: true },
  content: { type: String, required: true },
  createdByAI: { type: Boolean, default: true },
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.model("Summary", SummarySchema);
