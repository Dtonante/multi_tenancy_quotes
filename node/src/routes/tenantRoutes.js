import express from "express";
import { registerTenant } from "../controllers/tenantControllers.js";

const router = express.Router();
router.post("/", registerTenant);

export default router;
