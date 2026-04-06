// routes/student.route.js
import express from "express";
import {
  createStudent,
  updateStudent,
  deleteStudent,
  getStudent,
  getStudents,
  getIdByName,
  getStudentForm,
  getStudentFeesSum,
} from "../controllers/student.controller.js";

import { verifyToken } from "../middleware/verifyToken.js";
import { verifyRole } from "../middleware/verifyRole.js";

const router = express.Router();

// Create student (Admin + Teacher)
router.post(
  "/create",
  verifyToken,
  verifyRole("admin", "teacher"),
  createStudent
);

// Update student (Admin only)
router.post("/update/:id", verifyToken, verifyRole("admin"), updateStudent);

// Delete student (Admin only)
router.delete("/delete/:id", verifyToken, verifyRole("admin"), deleteStudent);

// View all students (Admin + Teacher + Student)
router.get(
  "/get",
  verifyToken,
  verifyRole("admin", "teacher", "student"),
  getStudents
);

// View single student
router.get(
  "/get/:id",
  verifyToken,
  verifyRole("admin", "teacher", "student"),
  getStudent
);

// Utility routes (Admin + Teacher)
router.get(
  "/getIdByName/:name",
  verifyToken,
  verifyRole("admin", "teacher"),
  getIdByName
);

router.get(
  "/getForm",
  verifyToken,
  verifyRole("admin", "teacher"),
  getStudentForm
);

router.get(
  "/getStudentFeesSum",
  verifyToken,
  verifyRole("admin", "teacher"),
  getStudentFeesSum
);

export default router;
