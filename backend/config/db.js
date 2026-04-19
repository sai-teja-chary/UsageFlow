import dotenv from 'dotenv';
import mongoose from "mongoose";
dotenv.config();

const connectDB = async () => {
    console.log(process.env.MONGO_URI);
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log("MongoDB Connected")
    } catch (error) {
        console.error(error);
        process.exit(1);
    }
};


export default connectDB;