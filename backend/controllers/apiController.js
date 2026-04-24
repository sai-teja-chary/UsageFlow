import Api from "../models/Api.js";
import Pricing from "../models/Pricing.js";

export const createApi = async (req, res) => {
  try {
    const { name, baseUrl, pricePerRequest } = req.body;

    if (!name || !baseUrl) {
      return res.status(400).json({ message: "All fields required" });
    }

    const existingApi = await Api.findOne({
      user: req.user.id,
      baseUrl,
    });

    if (existingApi) {
      return res.status(400).json({ message: "API already registered" });
    }

    // 1. Create API
    const api = await Api.create({
      user: req.user.id,
      name,
      baseUrl,
    });

    // 2. create Pricing
    await Pricing.create({
      api: api._id,
      pricePerRequest,
      current: "INR",
    });

    res.status(201).json({
      api,
      pricing: {
        pricePerRequest,
      },
    });

  } catch (error) {
    console.log(error)
    res.status(500).json({ message: "Server error" });
  }
};
