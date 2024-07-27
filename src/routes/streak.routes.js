import { Router } from "express";

import {
  logDailyStreak,
  updateDailyGoalFocusMinutes,
} from "../controllers/streaks/streak.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = Router();

router.route("/log-streak").get(verifyJWT, logDailyStreak);
router.route("/daily-goal").patch(verifyJWT, updateDailyGoalFocusMinutes);

export default router;
