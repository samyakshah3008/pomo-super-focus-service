import { Router } from "express";

import { logDailyStreak } from "../controllers/streaks/streak.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = Router();

router.route("/log-streak").get(verifyJWT, logDailyStreak);

export default router;
