// routes/billing.routes.js
import express from "express";
import { getBilling } from "../controllers/billingController.js";
import { protect } from "../middleware/authMiddleware.js";
import { billingSummary } from "../controllers/billingSummaryController.js";

const router = express.Router();

router.get("/", protect, getBilling);
router.get("/summary", protect, billingSummary);

export default router;