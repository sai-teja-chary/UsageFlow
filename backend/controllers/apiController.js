import mongoose from "mongoose";
import Api from "../models/Api.js";
import Pricing from "../models/Pricing.js";

export const createApi = async (req, res) => {
  try {
    const { name, baseUrl, pricePerRequest } = req.body;

    if (!name || !baseUrl || pricePerRequest == null) {
      return res.status(400).json({ message: "All fields required" });
    }

    if (!baseUrl.startsWith("http")) {
      return res.status(400).json({ message: "Invalid base URL" });
    }

    const existingApi = await Api.findOne({
      user: req.user.id,
      baseUrl,
    });

    if (existingApi) {
      return res.status(400).json({ message: "API already registered" });
    }

    // ✅ Create API
    const api = await Api.create({
      user: req.user.id,
      name,
      baseUrl,
    });

    // ✅ Create Pricing
    await Pricing.create({
      api: api._id,
      pricePerRequest,
      currency: "INR",
    });

    res.status(201).json({
      message: "API created successfully",
      api,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

export const getMyApis = async (req, res) => {
  try {
    const userId = new mongoose.Types.ObjectId(req.user.id);

    const apis = await Api.aggregate([
      // 🔹 1. Match user's APIs
      {
        $match: {
          user: userId,
        },
      },

      // 🔹 2. Join Pricing
      {
        $lookup: {
          from: "pricings",
          localField: "_id",
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

      // 🔹 3. Join Usage
      {
        $lookup: {
          from: "usages",
          localField: "_id",
          foreignField: "api",
          as: "usage",
        },
      },

      // 🔹 4. Calculate totals safely
      {
        $addFields: {
          totalRequests: {
            $sum: {
              $map: {
                input: { $ifNull: ["$usage", []] }, // ✅ FIX
                as: "u",
                in: "$$u.requestCount",
              },
            },
          },
          price: {
            $ifNull: ["$pricing.pricePerRequest", 0],
          },
        },
      },

      // 🔹 5. Earnings
      {
        $addFields: {
          totalEarnings: {
            $multiply: ["$totalRequests", "$price"],
          },
        },
      },

      // 🔹 6. Final shape
      {
        $project: {
          _id: 1,
          name: 1,
          baseUrl: 1,
          createdAt: 1,
          price: 1,
          totalRequests: 1,
          totalEarnings: 1,
        },
      },
    ]);

    res.json(apis);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error fetching APIs" });
  }
};

export const getAllApis = async (req, res) => {
  try {
    const apis = await Api.aggregate([
      {
        $lookup: {
          from: "pricings",
          localField: "_id",
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
      {
        $project: {
          _id: 1,
          name: 1,
          baseUrl: 1,
          description: 1,
          pricePerRequest: {
            $ifNull: ["$pricing.pricePerRequest", 0],
          },
          currency: {
            $ifNull: ["$pricing.currency", "INR"],
          },
        },
      },
    ]);

    res.json(apis);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error fetching APIs" });
  }
};