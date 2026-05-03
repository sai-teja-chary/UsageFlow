import mongoose from "mongoose";

const apiKeySchema = new mongoose.Schema(
  {
    name: {
      type: String,
    },

    key: {
      type: String,
      required: true,
      unique: true, // ✅ simpler, no need partial here
    },

    prefix: {
      type: String,
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

    status: {
      type: String,
      enum: ["active", "revoked"],
      default: "active",
    },

    lastUsedAt: {
      type: Date,
    },
  },
  { timestamps: true }
);

// 🔒 ONLY ONE ACTIVE KEY PER API PER USER
apiKeySchema.index(
  { user: 1, api: 1, status: 1 },
  {
    unique: true,
    partialFilterExpression: { status: "active" },
  }
);

export default mongoose.model("ApiKey", apiKeySchema);