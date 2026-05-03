import { getUsageSummary } from "../services/usageService.js";

export const usageSummary = async (req, res) => {
  try {
    const { startDate, endDate } = req.query;

    const data = await getUsageSummary(
      req.user.id, // 🔥 use logged-in user
      startDate || "2026-04-01",
      endDate || new Date().toISOString().slice(0, 10)
    );

    res.json(data);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Usage summary error" });
  }
};