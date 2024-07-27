import { Router } from "express";

import { getLeaderboardOfTheWeek } from "../controllers/leaderboard/leaderboard.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = Router();

router.route("/weekly").get(verifyJWT, getLeaderboardOfTheWeek);

export default router;
