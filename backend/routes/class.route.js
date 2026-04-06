import express from "express";
import { verifyToken } from "../middleware/verifyToken.js";
import { verifyRole } from "../middleware/verifyRole.js";

import {
  deleteClass,
  updateClass,
  getClass,
  getClasses,
  createClass,
  getClassByName,
  getIdByName,
  getClassesDropdown,
} from "../controllers/class.controller.js";

const router = express.Router();

// Dropdown route
router.get(
  "/dropdown",
  verifyToken,
  verifyRole("admin", "teacher", "student"),
  getClassesDropdown
);

// Admin only actions
router.post("/create", verifyToken, verifyRole("admin"), createClass);
router.put("/update/:id", verifyToken, verifyRole("admin"), updateClass);
router.delete("/delete/:id", verifyToken, verifyRole("admin"), deleteClass);

// View routes for all 3 roles
router.get(
  "/get",
  verifyToken,
  verifyRole("admin", "teacher", "student"),
  getClasses
);
router.get(
  "/get/:id",
  verifyToken,
  verifyRole("admin", "teacher", "student"),
  getClass
);
router.get(
  "/getByName/:name",
  verifyToken,
  verifyRole("admin", "teacher", "student"),
  getClassByName
);
router.get(
  "/getIdByName/:name",
  verifyToken,
  verifyRole("admin", "teacher", "student"),
  getIdByName
);

export default router;
