import Api from "../models/Api.js";
import ApiKey from "../models/ApiKey.js";
import { generateApiKey } from "../utils/generateApiKey.js";

export const createApiKey = async (req, res) => {
  try {
    const { apiId } = req.body;

    if (!apiId) {
      return res.status(400).json({ message: "API ID required" });
    }

    const api = await Api.findById(apiId);
    if (!api) {
      return res.status(404).json({ message: "API not found" });
    }

    const existingKey = await ApiKey.findOne({
      api: apiId,
      user: req.user.id,
      status:"active",
    });

    if (existingKey) {
      return res
        .status(400)
        .json({ message: "Api key already exists for tis API" });
    }

    const key = generateApiKey();

    const apiKey = await ApiKey.create({
        key,
        api: apiId,
        user: req.user.id,
    });

    res.status(201).json(apiKey);
  } catch (error) {
    console.error(error);
    res.status(500).json({message: "Server error"})
  }
};

export const revokeApiKey = async (req, res) => {
  try {
    const { keyId } = req.params;

    const apiKey = await ApiKey.findById(keyId);

    if(!apiKey){
      return res.status(404).json({message: "API key not found"});
    }

    if(apiKey.user.toString() !== req.user.id){
      return res.status(403).json({message: "Not your API key"})
    }

    apiKey.status = "revoked";
    await apiKey.save();

    res.json({message: "API key revoked successfully"});

  } catch (error) {
    console.error(error);
    res.status(500).json({message: "Server error"});    
  }
}
