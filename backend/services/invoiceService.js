import ApiKey from "../models/ApiKey.js";
import Invoice from "../models/Invoice.js";
import { calculateBilling } from "./billingService.js";

export const generateInvoice = async (apiKeyId, startDate, endDate) => {
  const apiKey = await ApiKey.findById(apiKeyId);

  if (!apiKey) {
    throw new Error("Invalid apiKey");
  }

  const billing = await calculateBilling(apiKeyId, startDate, endDate);

  const invoice = await Invoice.create({
    user: apiKey.user,
    apiKey: apiKeyId,
    totalRequests: billing.totalRequests,
    totalAmount: billing.totalAmount,
    periodStart: startDate,
    periodEnd: endDate,
  });

  return invoice;
};

export const getUserInvoices = async (userId) => {
  const invoices = await Invoice.find({ user: userId }).sort({ createdAt: -1 });

  return invoices.map((inv) => ({
    id: inv._id,
    totalRequests: inv.totalRequests,
    totalAmount: inv.totalAmount,
    status: inv.status,
    period: `${inv.periodStart} → ${inv.periodEnd}`,
    createdAt: new Date(inv.createdAt).toISOString().split("T")[0],
  }));
};
