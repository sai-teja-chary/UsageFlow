import mongoose from "mongoose";

const pricingSchema = new mongoose.Schema({
    api: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Api",
        required: true,
    },
    pricePerRequest: {
        type: Number,
        required: true,
    },
    currency: {
        type: String,
        default: "INR",
    },
});

export default mongoose.model("Pricing", pricingSchema);