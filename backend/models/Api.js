import mongoose from "mongoose";

const apiSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    name: {
      type: String,
      required: true,
    },

    baseUrl: {
      type: String,
      required: true,
      validate: {
        validator: function (v) {
          return v.startsWith("http");
        },
        message: "Invalid URL",
      },
    },

    // 🔥 Optional but useful
    description: {
      type: String,
    },

    status: {
      type: String,
      enum: ["active", "inactive"],
      default: "active",
    },
  },
  { timestamps: true }
);

// ✅ Indexes
apiSchema.index({ user: 1 });
apiSchema.index({ user: 1, baseUrl: 1 }, { unique: true });

export default mongoose.model("Api", apiSchema);