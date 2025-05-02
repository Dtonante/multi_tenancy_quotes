import { Router } from "express";
import { getScheduleConfigByDate, createScheduleConfig } from "../controllers/scheduleConfigControllersTenant.js";
import verificarToken from "../middlewares/authMiddleware.js";

const router = Router();

router.get("/config", verificarToken, getScheduleConfigByDate);
router.post("/createSchedule", verificarToken, createScheduleConfig);

export default router;
