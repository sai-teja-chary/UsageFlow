import mongoose from "mongoose";

const logSchema = new mongoose.Schema(
  {
    apiKey: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "ApiKey",
      required: true,
    },
    api: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Api",
      required: true,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    endpoint: {
      type: String,
    },
    method: {
      type: String,
    },
    status: {
      type: Number,
    },
  },
  { timestamps: true },
);

export default mongoose.model("Log", logSchema);
