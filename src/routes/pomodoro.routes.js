import { Router } from "express";
import {
  getPomodoroReport,
  logPomodoroSession,
} from "../controllers/pomodoros/pomodoro.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = Router();

router.route("/log-session").post(verifyJWT, logPomodoroSession);
router.route("/report").get(verifyJWT, getPomodoroReport);

export default router;
