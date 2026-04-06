import express from "express";
import { updateUser, deleteUser } from "../controllers/user.controller.js";
import { verifyToken } from "../middleware/verifyToken.js";
import upload from "../middleware/multer.js";

const router = express.Router();

// Update + upload profile image
router.post(
  "/update/:id",
  verifyToken,
  upload.single("profileImage"),
  updateUser
);

// Delete user
router.delete("/delete/:id", verifyToken, deleteUser);

export default router;
