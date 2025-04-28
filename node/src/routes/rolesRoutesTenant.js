import { Router } from "express";
import { getRoles, getRoleForID, createRole, updateRole, deleteRole } from "../controllers/roleControllersTenant.js";
import verificarToken from "../middlewares/authMiddleware.js";

const router = Router();

router.get("/", verificarToken, getRoles);
router.get("/:id_rolePK", verificarToken, getRoleForID);
router.post("/", verificarToken, createRole);
router.put("/:id_rolePK", verificarToken, updateRole);
router.delete("/:id_rolePK", verificarToken, deleteRole);

export default router;
