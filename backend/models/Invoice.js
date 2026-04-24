import mongoose from "mongoose";

const invoiceSchema = new mongoose.Schema({
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
    totalRequests: Number,
    totalAmount: Number,
    currency: {
        type: String,
        default: "INR",
    },
    status: {
        type: String,
        enum: ["pending", "paid"],
        default: "pending",
    },
    periodStart: String,
    periodEnd: String,
}, {timestamps: true});

export default mongoose.model("Invoice", invoiceSchema);