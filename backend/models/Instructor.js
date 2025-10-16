import mongoose from "mongoose";

const instructorSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },

  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true
  },

  password: {
    type: String,
    required: true
  },

  avatar: {
    type: String,
    default: ""
  },

  role: {
    type: String,
    enum: ["instructor"],
    default: "instructor"
  },

  status: {
    type: String,
    enum: ["pending", "active", "suspended"],
    default: "pending"
  },

  lastLogin: {
    type: Date
  }

}, { timestamps: true });

export default mongoose.model("Instructor", instructorSchema);
