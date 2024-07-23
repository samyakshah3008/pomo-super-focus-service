import { Router } from "express";
import {
  deleteActivePomodoro,
  initializePomodoro,
  pauseOrResumePomodoro,
} from "../controllers/pomodoros/activePomodoro.controller.js";
import {
  getPomodoroReport,
  logPomodoroSession,
} from "../controllers/pomodoros/pomodoro.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = Router();

router.route("/active-pomodoro").post(verifyJWT, initializePomodoro);
router.route("/active-pomodoro").patch(verifyJWT, pauseOrResumePomodoro);
router.route("/active-pomodoro").delete(verifyJWT, deleteActivePomodoro);

router.route("/log-session").post(verifyJWT, logPomodoroSession);
router.route("/report").get(verifyJWT, getPomodoroReport);

export default router;
