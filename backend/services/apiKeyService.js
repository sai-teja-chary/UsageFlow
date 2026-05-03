import ApiKey from "../models/ApiKey.js";

export const getUserApiKeys = async (userId) => {
  const keys = await ApiKey.find({ user: userId })
    .select("key status createdAt api")
    .populate("api", "name");

  return keys.map(k => ({
    id: k._id,
    key: k.key.slice(0,6) + "...." + k.key.slice(-4),
    status: k.status,
    apiName: k.api?.name || "Unknown",
    createdAt: new Date(k.createdAt).toISOString().split("T")[0],
  }));
};