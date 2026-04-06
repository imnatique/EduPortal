import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import cors from "cors";

import userRouter from "./routes/user.route.js";
import authRouter from "./routes/auth.route.js";
import studentRouter from "./routes/student.route.js";
import teacherRouter from "./routes/teacher.route.js";
import classRouter from "./routes/class.route.js";

dotenv.config();
const app = express();

// ------------------- CORS -------------------
const allowedOrigins = [
  "http://localhost:5173",
  "https://eduportal-self.vercel.app",
  process.env.FRONTEND_URL,
].filter(Boolean);

const corsOptions = {
  origin(origin, callback) {
    if (!origin) return callback(null, true);
    if (allowedOrigins.includes(origin)) return callback(null, true);
    console.error(`CORS blocked: ${origin}`);
    return callback(new Error(`CORS: origin ${origin} not allowed`));
  },
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization", "X-Requested-With"],
};

app.use(cors(corsOptions));
app.options("*", cors(corsOptions));

// ------------------- MIDDLEWARE -------------------
app.use(express.json());
app.use(cookieParser());

// ------------------- HEALTH CHECK -------------------
// Open this in browser to confirm deploy + env vars:
// https://eduportal-z4w4.onrender.com/health
app.get("/health", (req, res) => {
  res.json({
    status: "ok",
    mongoUri: process.env.MONGO_URI ? "SET" : "MISSING",
    jwtSecret: process.env.JWT_SECRET ? "SET" : "MISSING",
    googleClientId: process.env.GOOGLE_CLIENT_ID ? "SET" : "MISSING",
    frontendUrl: process.env.FRONTEND_URL || "(not set)",
    allowedOrigins,
  });
});

// ------------------- DATABASE -------------------
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => {
    console.error("MongoDB Connection Error:", err.message);
    process.exit(1);
  });

// ------------------- ROUTES -------------------
app.use("/api/auth", authRouter);
app.use("/api/user", userRouter);
app.use("/api/student", studentRouter);
app.use("/api/teacher", teacherRouter);
app.use("/api/class", classRouter);

// ------------------- ERROR HANDLING -------------------
app.use((err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  const message = err.message || "Internal Server Error";
  console.error("Error:", message);
  return res.status(statusCode).json({ success: false, message });
});

// ------------------- START SERVER -------------------
const PORT = process.env.PORT || 8000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`Allowed origins:`, allowedOrigins);
});
