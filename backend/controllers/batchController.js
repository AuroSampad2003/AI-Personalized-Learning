import Batch from "../models/Batch.js";
import Course from "../models/Course.js";

// ✅ Create a new batch
export const createBatch = async (req, res) => {
  try {
    const { name, description } = req.body;

    const batch = await Batch.create({
      name,
      description,
      createdBy: req.user.id,
    });

    res.status(201).json({ message: "Batch created successfully", batch });
  } catch (error) {
    console.error("Create batch error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// ✅ Get all batches created by instructor
export const getInstructorBatches = async (req, res) => {
  try {
    const batches = await Batch.find({ createdBy: req.user.id })
      .populate("courses", "title status")
      .populate("students", "name email");

    res.json({ batches });
  } catch (error) {
    console.error("Get batches error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// ✅ Assign a course to a batch
export const assignCourseToBatch = async (req, res) => {
  try {
    const { courseId } = req.body;
    const { batchId } = req.params;

    const course = await Course.findById(courseId);
    const batch = await Batch.findById(batchId);

    if (!batch || !course) {
      return res.status(404).json({ message: "Batch or Course not found" });
    }

    // Avoid duplicate assignment
    if (!batch.courses.includes(courseId)) {
      batch.courses.push(courseId);
      await batch.save();
    }

    res.json({ message: "Course assigned to batch successfully", batch });
  } catch (error) {
    console.error("Assign course error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// ✅ Add student to batch (optional but useful for future)
export const addStudentToBatch = async (req, res) => {
  try {
    const { studentId } = req.body;
    const { batchId } = req.params;

    const batch = await Batch.findById(batchId);
    if (!batch) return res.status(404).json({ message: "Batch not found" });

    if (!batch.students.includes(studentId)) {
      batch.students.push(studentId);
      await batch.save();
    }

    res.json({ message: "Student added to batch successfully", batch });
  } catch (error) {
    console.error("Add student error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// ✅ Delete a batch
export const deleteBatch = async (req, res) => {
  try {
    const { batchId } = req.params;

    const batch = await Batch.findOneAndDelete({
      _id: batchId,
      createdBy: req.user.id,
    });

    if (!batch) return res.status(404).json({ message: "Batch not found or not yours" });

    res.json({ message: "Batch deleted successfully" });
  } catch (error) {
    console.error("Delete batch error:", error);
    res.status(500).json({ message: "Server error" });
  }
};
