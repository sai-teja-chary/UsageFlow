import { calculateBilling } from "../services/billingService.js";

export const getBilling = async (req, res) => {
  try {
    const { apiKey } = req.query; // or from auth later

    const data = await calculateBilling(
      apiKey,
      "2026-04-01",
      "2026-04-30"
    );

    res.json(data);
  } catch (err) {
    res.status(500).json({ message: "Billing error" });
  }
};