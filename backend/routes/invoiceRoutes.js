import express from "express";
import { createInvoice, getInvoiceById, listInvoices, payInvoice } from "../controllers/invoiceController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/generate", protect, createInvoice);
router.get("/", protect, listInvoices);
router.get("/:id", protect, getInvoiceById);
router.post("/:id/pay", protect, payInvoice);

export default router;