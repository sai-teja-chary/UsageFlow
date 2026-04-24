// routes/billing.routes.js
import express from "express";
import { getBilling } from "../controllers/billingController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/", protect, getBilling);

export default router;