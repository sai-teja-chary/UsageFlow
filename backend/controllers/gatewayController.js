import axios from "axios";
import Api from "../models/Api.js";
import ApiKey from "../models/ApiKey.js";

export const gatewayHandler = async (req, res) => {
  try {
    const apiKeyValue = req.headers["x-api-key"];

    if (!apiKeyValue) {
      return res.status(401).json({ message: "API key required" });
    }

    const apiKey = await ApiKey.findOne({ key: apiKeyValue });

    if (!apiKey) {
      return res.status(403).json({ message: "Inavlid API key" });
    }

    if (apiKey.status != "active") {
      return res
        .status(403)
        .json({ message: "API key revoked, create another one" });
    }

    const api = await Api.findById(apiKey.api);

    if (!api) {
      return res.status(404).json({ message: "API not found" });
    }

    const endpoint = req.originalUrl.replace("/gateway/", "");
    const cleanBaseUrl = api.baseUrl.replace(/\/$/, "");
    const url = `${cleanBaseUrl}/${endpoint}`;

    console.log("Base URL:", api.baseUrl);
    console.log("Endpoint:", endpoint);
    console.log("Final URL:", url); // <-- check this

    const response = await axios({
      method: req.method,
      url,
      params: req.query,
      data: req.body,
      headers: {},
    });

    console.log("API HIT:", {
      apiKey: apiKey._id,
      endpoint,
      status: response.status,
    });

    res.status(response.status).json(response.data);
  } catch (error) {
    console.error(error.message);
    if (error.response) {
      return res.status(error.response.status).json(error.response.data);
    }
    res.status(500).json({ message: "Gateway error" });
  }
};
