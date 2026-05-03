import express from "express";
import { createApi, getAllApis, getMyApis } from "../controllers/apiController.js";
import { protect } from "../middleware/authMiddleware.js";
import { authorizeRoles } from "../middleware/roleMiddleware.js";

const router = express.Router();

router.post("/", protect, authorizeRoles("owner", "admin"), createApi);
router.get("/my-apis", protect, getMyApis);
router.get("/", getAllApis);


export default router
