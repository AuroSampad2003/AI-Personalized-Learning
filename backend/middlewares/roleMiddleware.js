export const isInstructor = (req, res, next) => {
  if (!req.user || (req.user.role !== "instructor" && req.user.role !== "admin")) {
    return res.status(403).json({ message: "Access denied. Instructors only." });
  }
  next();
};
