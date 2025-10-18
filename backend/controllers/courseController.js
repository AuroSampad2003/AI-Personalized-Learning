import Course from "../models/Course.js";

//  CREATE COURSE
export const createCourse = async (req, res) => {
  try {
    const { title, description, thumbnail, tags, difficulty, language } = req.body;

    const course = new Course({
      instructor: req.user.id,
      title,
      description,
      thumbnail,
      tags,
      difficulty,
      language,
      status: "draft"
    });

    await course.save();
    res.status(201).json({ message: "Course created", course });
  } catch (error) {
    console.error("Create course error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

//  GET ALL COURSES OF INSTRUCTOR
export const getInstructorCourses = async (req, res) => {
  try {
    const courses = await Course.find({ instructor: req.user.id }).sort({ createdAt: -1 });
    res.json({ courses });
  } catch (error) {
    console.error("Fetch courses error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

//  GET SINGLE COURSE
export const getCourseById = async (req, res) => {
  try {
    const course = await Course.findOne({ _id: req.params.id, instructor: req.user.id });
    if (!course) return res.status(404).json({ message: "Course not found" });

    res.json({ course });
  } catch (error) {
    console.error("Get course error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

//  UPDATE COURSE
export const updateCourse = async (req, res) => {
  try {
    console.log("helloo")
    const course = await Course.findOne({ _id: req.params.id, instructor: req.user.id });
    if (!course) return res.status(404).json({ message: "Course not found" });

    Object.assign(course, req.body);
    await course.save();

    res.json({ message: "Course updated", course });
  } catch (error) {
    console.error("Update course error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

//  DELETE COURSE
export const deleteCourse = async (req, res) => {
  try {
    const course = await Course.findOneAndDelete({ _id: req.params.id, instructor: req.user.id });
    if (!course) return res.status(404).json({ message: "Course not found" });

    res.json({ message: "Course deleted" });
  } catch (error) {
    console.error("Delete course error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// Assign course to batches
export const assignCourseToBatches = async (req, res) => {
  try {
    const { batchIds, isPublic } = req.body; // batchIds = array of batch _id's

    const course = await Course.findOne({ _id: req.params.id, instructor: req.user.id });
    if (!course) return res.status(404).json({ message: "Course not found" });

    if (batchIds) course.assignedBatches = batchIds;
    if (typeof isPublic === "boolean") course.isPublic = isPublic;

    await course.save();
    res.json({ message: "Course assignment updated", course });
  } catch (error) {
    console.error("Assign course error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

export const togglePublishStatus = async (req, res) => {
  try {
    const course = await Course.findOne({ _id: req.params.id, instructor: req.user.id });
    if (!course) return res.status(404).json({ message: "Course not found" });

    // Toggle between draft and published
    course.status = course.status === "draft" ? "published" : "draft";
    await course.save();

    res.json({
      message: `Course ${course.status === "published" ? "published" : "unpublished"}`,
      course
    });
  } catch (error) {
    console.error("Toggle publish status error:", error);
    res.status(500).json({ message: "Server error" });
  }
};
