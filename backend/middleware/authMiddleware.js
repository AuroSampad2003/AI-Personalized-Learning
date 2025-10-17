import jwt from "jsonwebtoken";
const ACCESS_SECRET = process.env.ACCESS_SECRET || "access_secret";

export const verifyToken = (req, res, next) => {
  // Check token in headers or cookies
const token = req.cookies?.token || req.headers?.authorization?.split(" ")[1];
  console.log(token)

  if (!token) {
    return res.status(401).json({ message: "Unauthorized. Token not found." });
  }

  try {
    const decoded = jwt.verify(token, ACCESS_SECRET);
    if (!decoded) return res.status(401).json({ message: "Unauthorized access" });

    req.user = decoded; // contains { id, role }
    next();
  } catch (err) {
    return res.status(401).json({ message: "Invalid or expired token" });
  }
};
