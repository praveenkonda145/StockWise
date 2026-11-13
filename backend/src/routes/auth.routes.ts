
import { Router } from "express";

import {
  registerUser,
  loginUser
} from "../controllers/auth.controller";

import { getCurrentUser } from "../controllers/user.controller";
import authMiddleware from "../middleware/auth.middleware";
import adminOnly from "../middleware/role.middleware";

const router = Router();

router.post("/register", registerUser);
router.post("/login", loginUser);

// Logged-in users
router.get("/me", authMiddleware, getCurrentUser);

// Admin-only test route
router.get("/admin-test", authMiddleware, adminOnly, (req, res) => {
  return res.status(200).json({
    success: true,
    message: "Welcome Admin! You have permission to access this route."
  });
});

export default router;
