import express from "express";
import cors from "cors";
import morgan from "morgan";
import tenantRoutes from "./routes/tenantRoutes.js";

const app = express();
app.use(cors());
app.use(express.json());
app.use(morgan("dev"));

app.use("/api/v1/tenant", tenantRoutes);

export default app;
