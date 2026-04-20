import express from "express";
import { createApiKey } from "../controllers/apiKeyController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/", protect, createApiKey);


export default router;