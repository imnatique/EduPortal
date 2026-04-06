import express from "express";
import {
  signin,
  signup,
  verifyAuth,
  google,
  signOut,
} from "../controllers/auth.controller.js";

const router = express.Router();

// Existing routes
router.post("/signup", signup);
router.post("/signin", signin);
router.post("/google", google);
router.post("/signout", signOut);
router.get("/verify", verifyAuth);

export default router;
