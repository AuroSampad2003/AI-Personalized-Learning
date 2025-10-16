import mongoose from "mongoose";

const courseSchema = new mongoose.Schema({
  instructor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Instructor",
    required: true
  },

  title: {
    type: String,
    required: true,
    trim: true
  },

  description: {
    type: String,
    default: ""
  },

  thumbnail: {
    type: String,
    default: ""
  },

  tags: [String],

  difficulty: {
    type: String,
    enum: ["Beginner", "Intermediate", "Advanced"],
    default: "Beginner"
  },

  language: {
    type: String,
    default: "English"
  },

  status: {
    type: String,
    enum: ["draft", "published"],
    default: "draft"
  },

  assignedBatches: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Batch" 
    }
  ],

  isPublic: {
    type: Boolean,
    default: false
  },

  lessons: [
    {
      title: String,
      type: { type: String, default: "video" }, // video/pdf/text
      fileUrl: String,
      duration: Number, // in seconds
      order: Number,
      createdAt: { type: Date, default: Date.now }
    }
  ]

}, { timestamps: true });

export default mongoose.model("Course", courseSchema);
