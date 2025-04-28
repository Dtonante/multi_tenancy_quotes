import express from "express";
import { registerTenant, listTenants } from "../controllers/tenantControllers.js";

const router = express.Router();
router.post("/", registerTenant);
// Listar todos los tenants
router.get('/', listTenants);

export default router;
