import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import connectDB from "./config/db.js";
import cookieParser from "cookie-parser";
import instructorAuthRoutes from "./routes/instructorAuthRoutes.js";
import courseRoutes from "./routes/courseRoutes.js";
import batchRoutes from "./routes/batchRoutes.js"; 


dotenv.config();
connectDB();

const app = express();
app.use(cookieParser());
app.use(cors());
app.use(express.json());

app.get('/',(req,res)=>{
    res.send("hello")
})

// Routes
app.use("/api/instructor/auth", instructorAuthRoutes);
app.use("/api/instructor/courses", courseRoutes);
app.use("/api/instructor/batches", batchRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
