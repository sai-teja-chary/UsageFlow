import express from "express";
import { createApi } from "../controllers/apiController.js";
import { protect } from "../middleware/authMiddleware.js";
import { authorizeRoles } from "../middleware/roleMiddleware.js";

const router = express.Router();

router.post("/", protect, authorizeRoles("owner", "admin"), createApi);


export default router
