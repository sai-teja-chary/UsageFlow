import axios from "axios";
import Api from "../models/Api.js";
import ApiKey from "../models/ApiKey.js";
import Log from "../models/Log.js";
import Usage from "../models/Usage.js";

export const gatewayHandler = async (req, res) => {
  let apiKey;
  let api;
  let endpoint = "";
  const today = new Date().toISOString().slice(0, 10);
  console.log(today);

  try {
    const apiKeyValue = req.headers["x-api-key"];

    if (!apiKeyValue) {
      return res.status(401).json({ message: "API key required" });
    }

    apiKey = await ApiKey.findOne({ key: apiKeyValue });

    if (!apiKey) {
      return res.status(403).json({ message: "Invalid API key" });
    }

    if (apiKey.status !== "active") {
      return res.status(403).json({ message: "API key revoked" });
    }

    api = await Api.findById(apiKey.api);

    if (!api) {
      return res.status(404).json({ message: "API not found" });
    }

    endpoint = req.path.replace("/gateway", "");

    const cleanBaseUrl = api.baseUrl.replace(/\/$/, "");
    const url = `${cleanBaseUrl}/${endpoint}`;

    const response = await axios({
      method: req.method,
      url,
      params: req.query,
      data: req.body,
      timeout: 5000,
    });

    // 🔥 Non-blocking log
    Log.create({
      apiKey: apiKey._id,
      api: api._id,
      user: apiKey.user,
      endpoint,
      method: req.method,
      status: response.status,
    }).catch(console.error);

    Usage.updateOne(
      {
        apiKey: apiKey._id,
        api: api._id,
        date: today,
      },
      {
        $inc: { requestCount: 1 },
      },
      { upsert: true },
    ).catch(console.error);

    return res.status(response.status).json(response.data);
  } catch (error) {
    console.error(error.message);

    if (error.response) {
      if (apiKey && api) {
        Log.create({
          apiKey: apiKey._id,
          api: api._id,
          user: apiKey.user,
          endpoint,
          method: req.method,
          status: error.response.status,
        }).catch(console.error);
        Usage.updateOne(
          {
            apiKey: apiKey._id,
            api: api._id,
            date: today,
          },
          {
            $inc: { requestCount: 1 },
          },
          { upsert: true },
        ).catch(console.error);
      }

      return res.status(error.response.status).json(error.response.data);
    }

    return res.status(500).json({ message: "Gateway error" });
  }
};
