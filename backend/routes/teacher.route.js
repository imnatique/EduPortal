import express from "express";
import {
  createTeacher,
  updateTeacher,
  deleteTeacher,
  getTeacher,
  getTeachers,
  getIdByName,
  getTeachersForm,
  getTeacherSalariesSum,
} from "../controllers/teacher.controller.js";
import { verifyToken } from "../middleware/verifyToken.js";
import { verifyRole } from "../middleware/verifyRole.js";

const router = express.Router();

// Admin-only actions
router.post("/create", verifyToken, verifyRole("admin"), createTeacher);
router.put("/update/:id", verifyToken, verifyRole("admin"), updateTeacher);
router.delete("/delete/:id", verifyToken, verifyRole("admin"), deleteTeacher);

// View teacher list (Admin + Teacher)
router.get("/get", verifyToken, verifyRole("admin", "teacher"), getTeachers);

// View teacher details (Admin + Teacher)
router.get("/get/:id", verifyToken, verifyRole("admin", "teacher"), getTeacher);

// Get teacher ID by name (Admin + Teacher)
router.get(
  "/getIdByName/:name",
  verifyToken,
  verifyRole("admin", "teacher"),
  getIdByName
);

// Get teacher form (Admin only)
router.get("/getForm", verifyToken, verifyRole("admin"), getTeachersForm);

// Teacher salary calculations (Admin only)
router.get(
  "/getTeacherSalariesSum",
  verifyToken,
  verifyRole("admin"),
  getTeacherSalariesSum
);

export default router;
