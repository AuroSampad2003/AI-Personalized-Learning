import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import Instructor from "../models/Instructor.js";

const ACCESS_SECRET = process.env.ACCESS_SECRET || "access_secret";



// 📌 REGISTER
export const registerInstructor = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const existing = await Instructor.findOne({ email });
    if (existing) return res.status(400).json({ message: "Email already exists" });

    const hashedPassword = await bcrypt.hash(password, 10);

    const instructor = new Instructor({
      name,
      email,
      password: hashedPassword
    });

    await instructor.save();

    res.status(201).json({ message: "Instructor registered. Awaiting admin approval." });
  } catch (error) {
    console.error("Register error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// 📌 LOGIN
export const loginInstructor = async (req, res) => {
  try {
    const { email, password } = req.body;
    const instructor = await Instructor.findOne({ email });

    if (!instructor) return res.status(400).json({ message: "Invalid credentials" });

    const isMatch = await bcrypt.compare(password, instructor.password);
    if (!isMatch) return res.status(400).json({ message: "Invalid credentials" });

    if (instructor.status !== "active") {
      return res.status(403).json({ message: "Account not yet approved by admin." });
    }

    const payload = { id: instructor._id, role: instructor.role };
    const token = jwt.sign(payload, ACCESS_SECRET, { expiresIn: "1d" });

    // Optionally send token as cookie (for browser)
    // res.cookie("token", token, { httpOnly: true, secure: false, sameSite: "Lax" });

    instructor.lastLogin = new Date();
    await instructor.save();

    res.cookie("token", token, {
      httpOnly: true,
      secure: true,
      sameSite: 'None',
      maxAge: 7 * 24 * 60 * 60 * 1000
    });

    res.status(200).json({
      message: "Login successful",
      token,
      instructor: {
        id: instructor._id,
        name: instructor.name,
        email: instructor.email,
        role: instructor.role,
        status: instructor.status
      }
    });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ message: "Server error" });
  }
};



// 📌 LOGOUT

export const logoutInstructor = async (req, res) => {
  try {
    res.clearCookie("token", {
      httpOnly: true,
      secure: true,
      sameSite: 'None'
    });
    res.json({ message: "Logged out successfully" });
  } catch (error) {
    console.error("Logout error:", error);
    res.status(500).json({ message: "Server error" });
  }
};



// 📌 GET PROFILE
export const getInstructorProfile = async (req, res) => {
  try {
    const { id } = req.user;
    const instructor = await Instructor.findById(id).select("-password");

    if (!instructor) return res.status(404).json({ message: "Instructor not found" });

    res.json({ instructor });
  } catch (error) {
    console.error("Profile error:", error);
    res.status(500).json({ message: "Server error" });
  }
};
