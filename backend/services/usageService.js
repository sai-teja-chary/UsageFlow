import Usage from "../models/Usage.js";
import mongoose from "mongoose";

export const getUsageSummary = async (userId, startDate, endDate) => {
  if (!mongoose.Types.ObjectId.isValid(userId)) {
    throw new Error("Invalid user");
  }

  const userIdObj = new mongoose.Types.ObjectId(userId);

  const result = await Usage.aggregate([
    // 🔹 1. Match date (FAST filter first)
    {
      $match: {
        date: {
          $gte: startDate,
          $lte: endDate,
        },
      },
    },

    // 🔹 2. Join apiKey → get user
    {
      $lookup: {
        from: "apikeys",
        localField: "apiKey",
        foreignField: "_id",
        as: "apiKeyData",
      },
    },
    { $unwind: "$apiKeyData" },

    // 🔹 3. Filter by logged-in user (consumer)
    {
      $match: {
        "apiKeyData.user": userIdObj,
      },
    },

    // 🔹 4. Compute everything in one go
    {
      $facet: {
        // 📊 Daily usage (for chart)
        daily: [
          {
            $group: {
              _id: "$date",
              requests: { $sum: "$requestCount" },
            },
          },
          { $sort: { _id: 1 } },
        ],

        // 📦 Summary stats (for cards)
        summary: [
          {
            $group: {
              _id: null,
              totalRequests: { $sum: "$requestCount" },
            },
          },
        ],
      },
    },
  ]);

  const dailyUsage = result[0].daily.map((d) => ({
    date: d._id,
    requests: d.requests,
  }));

  const summary = result[0].summary[0] || {
    totalRequests: 0,
  };

  return {
    totalRequests: summary.totalRequests,
    dailyUsage,
  };
};
