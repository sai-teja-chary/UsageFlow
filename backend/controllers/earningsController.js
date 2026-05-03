import Usage from "../models/Usage.js";
import mongoose from "mongoose";

export const getEarningsOverTime = async (req, res) => {
  try {
    const userId = new mongoose.Types.ObjectId(req.user.id);

    const data = await Usage.aggregate([
      // 🔹 1. Join API (IMPORTANT)
      {
        $lookup: {
          from: "apis",
          localField: "api",
          foreignField: "_id",
          as: "apiData",
        },
      },
      { $unwind: "$apiData" },

      // 🔥 2. Filter OWNER (CRITICAL FIX)
      {
        $match: {
          "apiData.user": userId,
        },
      },

      // 🔹 3. Join Pricing
      {
        $lookup: {
          from: "pricings",
          localField: "api",
          foreignField: "api",
          as: "pricing",
        },
      },
      {
        $unwind: {
          path: "$pricing",
          preserveNullAndEmptyArrays: true,
        },
      },

      // 🔹 4. Calculate earnings safely
      {
        $addFields: {
          price: { $ifNull: ["$pricing.pricePerRequest", 0] },
        },
      },
      {
        $addFields: {
          earning: {
            $multiply: ["$requestCount", "$price"], // ✅ FIXED
          },
        },
      },

      // 🔹 5. Group by date
      {
        $group: {
          _id: "$date",
          totalEarnings: { $sum: "$earning" },
        },
      },

      { $sort: { _id: 1 } },
    ]);

    res.json(
      data.map((d) => ({
        date: d._id,
        earnings: Number((d.totalEarnings || 0).toFixed(2)),
      }))
    );
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error fetching earnings" });
  }
};