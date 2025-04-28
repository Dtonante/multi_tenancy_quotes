import express from "express";
import cors from "cors";
import morgan from "morgan";
import tenantRoutes from "./routes/tenantRoutes.js";
import rolesRoutesTenant from "./routes/rolesRoutesTenant.js";
import usersRolesTenant from "./routes/usersRoutesTenant.js";
import quotesRoutesTenant from "./routes/quotesRoutesTenant.js";
import scheduleConfigRoutesTenant from "./routes/scheduleConfigRoutesTenant.js";

const app = express();
app.use(cors());
app.use(express.json());
app.use(morgan("dev"));

app.use("/api/v1/tenant", tenantRoutes);
// Endpoints
app.use("/api/v1/tenant/roles", rolesRoutesTenant);
app.use("/api/v1/tenant/users", usersRolesTenant);
app.use("/api/v1/tenant/quotes", quotesRoutesTenant);
app.use("/api/v1/tenant/scheduleConfig", scheduleConfigRoutesTenant);

export default app;
