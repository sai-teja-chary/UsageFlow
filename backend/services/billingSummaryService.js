import Usage from "../models/Usage.js";
import mongoose from "mongoose";

export const getBillingSummary = async (userId, startDate, endDate) => {
  const userIdObj = new mongoose.Types.ObjectId(userId);

  const result = await Usage.aggregate([
    // 🔹 1. Date filter (IMPORTANT FIRST)
    {
      $match: {
        date: {
          $gte: startDate,
          $lte: endDate,
        },
      },
    },

    // 🔹 2. Join apiKey → filter user
    {
      $lookup: {
        from: "apikeys",
        localField: "apiKey",
        foreignField: "_id",
        as: "apiKeyData",
      },
    },
    { $unwind: "$apiKeyData" },

    {
      $match: {
        "apiKeyData.user": userIdObj,
      },
    },

    // 🔹 3. Join API
    {
      $lookup: {
        from: "apis",
        localField: "api",
        foreignField: "_id",
        as: "apiData",
      },
    },
    { $unwind: "$apiData" },

    // 🔹 4. Join Pricing
    {
      $lookup: {
        from: "pricings",
        localField: "api",
        foreignField: "api",
        as: "pricingData",
      },
    },
    {
      $unwind: {
        path: "$pricingData",
        preserveNullAndEmptyArrays: true,
      },
    },

    // 🔹 5. Calculate cost
    {
      $addFields: {
        price: { $ifNull: ["$pricingData.pricePerRequest", 0] },
        cost: {
          $multiply: [
            "$requestCount",
            { $ifNull: ["$pricingData.pricePerRequest", 0] },
          ],
        },
      },
    },

    // 🔥 6. FACET → summary + breakdown
    {
      $facet: {
        summary: [
          {
            $group: {
              _id: null,
              totalCost: { $sum: "$cost" },
              totalRequests: { $sum: "$requestCount" },
            },
          },
        ],

        breakdown: [
          {
            $group: {
              _id: "$apiData._id",
              apiName: { $first: "$apiData.name" },
              totalRequests: { $sum: "$requestCount" },
              totalCost: { $sum: "$cost" },
            },
          },
          { $sort: { totalCost: -1 } },
        ],
      },
    },
  ]);

  const summary = result[0].summary[0] || {
    totalCost: 0,
    totalRequests: 0,
  };

  const breakdown = (result[0]?.breakdown || []).map((b) => ({
    apiId: b._id,
    apiName: b.apiName,
    totalRequests: b.totalRequests,
    totalCost: Number(b.totalCost.toFixed(2)),
  }));

  return {
    totalCost: Number(summary.totalCost.toFixed(2)),
    totalRequests: summary.totalRequests,
    currency: "INR",
    plan: "Pro",
    breakdown,
  };
};
