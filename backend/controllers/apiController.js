import Api from "../models/Api.js";

export const createApi = async (req, res) => {
  try {
    const { name, baseUrl } = req.body;

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

    const api = await Api.create({
      user: req.user.id,
      name,
      baseUrl,
    });

    res.status(201).json(api);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};
