import express from "express";
import { usageSummary } from "../controllers/usageController.js";
import { protect } from "../middleware/authMiddleware.js";
import { getEarningsOverTime } from "../controllers/earningsController.js";

const router = express.Router();

router.get("/summary", protect, usageSummary);
router.get("/earnings", protect, getEarningsOverTime);

export default router;