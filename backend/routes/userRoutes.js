import express from "express";
import {
  getMe,
  login,
  logout,
  refreshToken,
  register,
  upgradeToOwner,
} from "../controllers/userController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.post("/refresh", refreshToken);
router.post("/upgrade", protect, upgradeToOwner)
router.post("/logout", logout);
router.get("/me", protect, getMe);

export default router;
