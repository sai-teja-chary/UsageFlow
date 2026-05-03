import { getBillingSummary } from "../services/billingSummaryService.js";

export const billingSummary = async (req, res) => {
  try {
    const { startDate, endDate } = req.query;

    // 🔹 validation
    if (startDate && isNaN(Date.parse(startDate))) {
      return res.status(400).json({ message: "Invalid startDate" });
    }

    if (endDate && isNaN(Date.parse(endDate))) {
      return res.status(400).json({ message: "Invalid endDate" });
    }

    const today = new Date();

    const defaultStart = new Date();
    defaultStart.setDate(today.getDate() - 30);

    const start =
      startDate || defaultStart.toISOString().slice(0, 10);

    const end =
      endDate || today.toISOString().slice(0, 10);

    const data = await getBillingSummary(
      req.user.id,
      start,
      end
    );

    res.json(data);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Billing summary error" });
  }
};