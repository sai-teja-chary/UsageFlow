import mongoose from "mongoose";

const apiSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    name:{
        type: String,
        required: true,
    },
    baseUrl: {
        type: String,
        required: true,
    },
}, {timestamps: true});

export default mongoose.model("Api", apiSchema);