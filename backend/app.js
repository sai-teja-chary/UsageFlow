import express from "express";
import cors from "cors";
import connectDB from "./config/db.js";
import cookieParser from 'cookie-parser';
import userRoutes from './routes/userRoutes.js'
import apiRoutes from './routes/apiRoutes.js'
import apiKeyRoutes from './routes/apiKeyRoutes.js'
import gatewayRoutes from './routes/gatewayRoutes.js'

const app = express();

app.use(cors());
app.use(express.json());
app.use(cookieParser());

app.use("/api/users", userRoutes);
app.use("/api/apis", apiRoutes);
app.use("/api/keys", apiKeyRoutes);
app.use("/", gatewayRoutes);

export default app;