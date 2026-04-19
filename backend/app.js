import express from "express";
import cors from "cors";
import connectDB from "./config/db.js";
import cookieParser from 'cookie-parser';
import userRoutes from './routes/userRoutes.js'

const app = express();

app.use(cors());
app.use(express.json());
app.use(cookieParser());
app.use("/api/users", userRoutes);

export default app;