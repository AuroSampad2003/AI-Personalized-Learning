// controllers/lessonController.js
import Lesson from "../models/Lesson.js";
import Course from "../models/Course.js";
import cloudinary from "../config/cloudinary.js";

/**
 * Upload a file to Cloudinary and attach to lesson
 * POST /api/instructor/lessons/:lessonId/upload
 */
export const uploadAsset = async (req, res) => {
  try {
    const { lessonId } = req.params;
    const lesson = await Lesson.findById(lessonId);
    if (!lesson) return res.status(404).json({ message: "Lesson not found" });

    const course = await Course.findById(lesson.course);
    if (!course) return res.status(404).json({ message: "Course not found" });

    if (String(course.instructor) !== String(req.user.id)) {
      return res.status(403).json({ message: "Access denied" });
    }

    if (!req.file) return res.status(400).json({ message: "No file uploaded" });

    // Upload to cloudinary
    const fileBuffer = req.file.buffer;
    const fileName = req.file.originalname;

    const result = await new Promise((resolve, reject) => {
      const stream = cloudinary.uploader.upload_stream(
        {
          resource_type: "auto",
          folder: `courses/${course._id}/lessons/${lesson._id}`
        },
        (error, uploadResult) => {
          if (error) reject(error);
          else resolve(uploadResult);
        }
      );
      stream.end(fileBuffer);
    });

    const asset = {
      url: result.secure_url,
      public_id: result.public_id,
      resource_type: result.resource_type,
      format: result.format,
      original_filename: result.original_filename,
      bytes: result.bytes,
      label: req.body.label || result.original_filename
    };

    lesson.assets.push(asset);
    lesson.updatedAt = new Date();
    await lesson.save();

    res.status(201).json({ message: "File uploaded", asset });
  } catch (err) {
    console.error("uploadAsset error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

/**
 * Create a new lesson
 * POST /api/instructor/lessons
 */
export const createLesson = async (req, res) => {
  try {
    const { courseId, title, description, order, durationSec } = req.body;

    const course = await Course.findById(courseId);
    if (!course) return res.status(404).json({ message: "Course not found" });

    if (String(course.instructor) !== String(req.user.id)) {
      return res.status(403).json({ message: "Access denied" });
    }

    const lesson = await Lesson.create({
      course: courseId,
      title,
      description,
      order,
      durationSec,
      status: "draft"
    });

    if (!course.lessons) course.lessons = [];
    course.lessons.push(lesson._id);
    await course.save();

    res.status(201).json({ message: "Lesson created", lesson });
  } catch (err) {
    console.error("createLesson error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

/**
 * Get a lesson (instructor)
 * GET /api/instructor/lessons/:id
 */
export const getLesson = async (req, res) => {
  try {
    const lesson = await Lesson.findById(req.params.id);
    if (!lesson) return res.status(404).json({ message: "Lesson not found" });

    const course = await Course.findById(lesson.course);
    if (String(course.instructor) !== String(req.user.id)) {
      return res.status(403).json({ message: "Access denied" });
    }

    res.json({ lesson });
  } catch (err) {
    console.error("getLesson error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

/**
 * Delete an asset from Cloudinary and lesson
 * DELETE /api/instructor/lessons/:lessonId/assets
 */

export const deleteAsset = async (req, res) => {
  try {
    const { lessonId } = req.params;
    const { public_id } = req.body;

    // Check lesson existence
    const lesson = await Lesson.findById(lessonId);
    if (!lesson) return res.status(404).json({ message: "Lesson not found" });

    // Check instructor authorization
    const course = await Course.findById(lesson.course);
    if (!course) return res.status(404).json({ message: "Course not found" });

    if (String(course.instructor) !== String(req.user.id)) {
      return res.status(403).json({ message: "Access denied" });
    }

    // Find the asset inside the lesson to get its resource_type
    const asset = lesson.assets.find(a => a.public_id === public_id);
    if (!asset) return res.status(404).json({ message: "Asset not found" });

    // Delete from cloudinary with correct resource_type
    await cloudinary.uploader.destroy(public_id, {
      resource_type: asset.resource_type || "image",
    });

    // Remove from lesson.assets array
    lesson.assets = lesson.assets.filter(a => a.public_id !== public_id);
    await lesson.save();

    res.json({ message: "Asset deleted successfully" });
  } catch (err) {
    console.error("deleteAsset error:", err);
    res.status(500).json({ message: "Server error" });
  }
};


/**
 * Delete a lesson entirely
 * DELETE /api/instructor/lessons/:id
 */
export const deleteLesson = async (req, res) => {
  try {
    const lesson = await Lesson.findById(req.params.id);
    if (!lesson) return res.status(404).json({ message: "Lesson not found" });

    const course = await Course.findById(lesson.course);
    if (String(course.instructor) !== String(req.user.id)) {
      return res.status(403).json({ message: "Access denied" });
    }

    // Optional: also delete all assets from Cloudinary
    for (const asset of lesson.assets) {
      await cloudinary.uploader.destroy(asset.public_id, { resource_type: "auto" });
    }

    course.lessons = (course.lessons || []).filter(id => String(id) !== String(lesson._id));
    await course.save();

    await lesson.deleteOne();
    res.json({ message: "Lesson deleted" });
  } catch (err) {
    console.error("deleteLesson error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

/**
 * Helper: attach an asset object to a lesson and save
 */
// const attachAssetToLesson = async (lesson, asset) => {
//   lesson.assets = lesson.assets || [];
//   lesson.assets.push(asset);
//   lesson.updatedAt = new Date();
//   await lesson.save();
//   return lesson;
// };

/**
 * Upload a PDF (or other raw file) to Cloudinary and attach to lesson.
 * route: POST /api/instructor/lessons/:lessonId/upload-pdf
 * form-data: file
 * optional body: label
 */
export const uploadPdfAsset = async (req, res) => {
  try {
    const { lessonId } = req.params;
    const file = req.file;
    const label = req.body.label || "PDF";

    if (!file) return res.status(400).json({ message: "No file provided" });

    const lesson = await Lesson.findById(lessonId);
    if (!lesson) return res.status(404).json({ message: "Lesson not found" });

    // upload PDF as raw
    // upload raw (pdf/docx) to Cloudinary as 'raw' resource_type
    const result = await new Promise((resolve, reject) => {
      const stream = cloudinary.uploader.upload_stream(
        { resource_type: "raw", folder: `courses/${lesson.course}/lessons/${lesson._id}` },
        (error, uploadResult) => {
          if (error) reject(error);
          else resolve(uploadResult);
        }
      );
      stream.end(file.buffer);
    });


    const asset = {
      url: result.secure_url,
      public_id: result.public_id,
      resource_type: "raw",
      format: result.format,
      original_filename: file.originalname,
      label
    };

    lesson.assets.push(asset);
    await lesson.save();

    res.status(201).json({ message: "PDF uploaded successfully", asset, lesson });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
};
