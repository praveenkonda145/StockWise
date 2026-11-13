
import { Router } from "express";
import { getDashboardStats } from "../controllers/dashboard.controller";

const router = Router();

// Get dashboard statistics
router.get("/stats", getDashboardStats);

export default router;
