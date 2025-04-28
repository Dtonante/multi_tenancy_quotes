import { Router } from "express";
import { getScheduleConfigByDate, createScheduleConfig } from "../controllers/scheduleConfigControllersTenant.js";

const router = Router();

router.get("/config", getScheduleConfigByDate);
router.post("/createSchedule", createScheduleConfig);

export default router;
