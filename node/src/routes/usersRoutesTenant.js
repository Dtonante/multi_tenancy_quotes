import { Router } from "express";
import { getUsers, getUser, createUser,  login,  } from "../controllers/userControllersTenant.js";
import verificarToken from "../middlewares/authMiddleware.js";

const router = Router();

router.get("/", verificarToken, getUsers);
router.get("/:id_userPK", verificarToken, getUser);
router.post("/", createUser);
// router.put("/:id_userPK", verificarToken, updateUser);
router.post("/login", login);
// router.delete("/:id_userPK", verificarToken, deleteUser);

export default router;
