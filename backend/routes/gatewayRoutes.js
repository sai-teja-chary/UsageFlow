import express from "express";
import { gatewayHandler } from "../controllers/gatewayController.js";

const router = express.Router();


router.all('/gateway/{*path}', gatewayHandler);

export default router;