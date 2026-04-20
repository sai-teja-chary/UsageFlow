import mongoose from "mongoose";

const apiKeySchema = new mongoose.Schema({
    key: {
        type: String,
        required: true,
        unique: true,
        index: true,
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
}, { timestamps: true});

export default mongoose.model("ApiKey", apiKeySchema);