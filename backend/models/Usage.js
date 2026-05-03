import mongoose from "mongoose";

const usageSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
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
    date: {
      type: String,
      required: true,
    },
    requestCount: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true },
);

usageSchema.index({ apiKey: 1, api: 1, date: 1 }, { unique: true });

export default mongoose.model("Usage", usageSchema);
