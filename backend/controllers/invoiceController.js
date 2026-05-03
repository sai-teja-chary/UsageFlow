import { generateInvoice, getUserInvoices } from "../services/invoiceService.js";
import ApiKey from "../models/ApiKey.js";
import Invoice from "../models/Invoice.js";

export const createInvoice = async (req, res) => {
  try {
    const { apiKey, startDate, endDate } = req.body;

    if (!apiKey || !startDate || !endDate) {
      return res.status(400).json({ message: "All fields required" });
    }

    // 🔒 Validate ownership
    const key = await ApiKey.findById(apiKey);

    if (!key) {
      return res.status(404).json({ message: "API key not found" });
    }

    if (key.user.toString() !== req.user.id) {
      return res.status(403).json({ message: "Not your API key" });
    }

    // 🚫 Prevent duplicate invoices
    const existing = await Invoice.findOne({
      user: req.user.id,
      apiKey,
      startDate,
      endDate,
    });

    if (existing) {
      return res.status(400).json({ message: "Invoice already exists" });
    }

    const invoice = await generateInvoice(apiKey, startDate, endDate);

    res.status(201).json(invoice);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Invoice error" });
  }
};

export const listInvoices = async (req, res) => {
  try {
    const userId = req.user.id;

    const invoices = await getUserInvoices(userId);

    res.json(invoices);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error fetching invoices" });
  }
};

export const getInvoiceById = async (req, res) => {
  try {
    const { id } = req.params;

    const invoice = await Invoice.findById(id).populate("apiKey");

    if (!invoice) {
      return res.status(404).json({ message: "Invoice not found" });
    }

    if (invoice.user.toString() !== req.user.id) {
      return res.status(403).json({ message: "Not your invoice" });
    }

    res.json(invoice);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error fetching invoice" });
  }
};

export const payInvoice = async (req, res) => {
  try {
    const { id } = req.params;

    const invoice = await Invoice.findById(id);

    if (!invoice) {
      return res.status(404).json({ message: "Invoice not found" });
    }

    if (invoice.user.toString() !== req.user.id) {
      return res.status(403).json({ message: "Not your invoice" });
    }

    if (invoice.status === "paid") {
      return res.status(400).json({ message: "Already paid" });
    }

    // 🔥 simulate payment
    invoice.status = "paid";
    await invoice.save();

    res.json({ message: "Payment successful", invoice });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Payment error" });
  }
};