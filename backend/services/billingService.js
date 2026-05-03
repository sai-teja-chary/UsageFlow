import mongoose from "mongoose";
import Pricing from "../models/Pricing.js";
import Usage from "../models/Usage.js";

export const calculateBilling = async (apiKey, startDate, endDate) => {

  const apiKeyObj = new mongoose.Types.ObjectId(apiKey);
  console.log(apiKeyObj);

  const usage = await Usage.aggregate([
    {
      $match: {
        apiKey: apiKeyObj,
        date: { $gte: startDate, $lte: endDate },
      },
    },
    {
      $group: {
        _id: "$api",
        totalRequests: { $sum: "$requestCount" },
      },
    },
  ]);

  const apiIds = usage.map((u) => u._id);

  const pricingList = await Pricing.find({
    api: { $in: apiIds },
  });

  const pricingMap = {};

  pricingList.forEach((p) => {
    pricingMap[p.api.toString()] = p.pricePerRequest;
  });

  console.log(apiIds);
  console.log(pricingList);
  console.log(pricingMap);

  let totalAmount = 0;

  for (const item of usage) {
    const price = pricingMap[item._id.toString()] || 0;
    totalAmount += item.totalRequests * price;
  }

  console.log(totalAmount)

  return {
    totalRequests: usage.reduce((sum, u) => sum + u.totalRequests, 0),
    totalAmount,
  };
};
