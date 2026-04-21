import express from "express";
import { createApiKey, revokeApiKey } from "../controllers/apiKeyController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/", protect, createApiKey);
router.post("/:keyId/revoke", protect, revokeApiKey);


export default router;