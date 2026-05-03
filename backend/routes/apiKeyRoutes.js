import express from "express";
import { createApiKey, listApiKeys, revokeApiKey, rotateApiKey } from "../controllers/apiKeyController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/", protect, createApiKey);
router.post("/:keyId/revoke", protect, revokeApiKey);
router.post("/:keyId/rotate", protect, rotateApiKey);
router.get("/", protect, listApiKeys);


export default router;