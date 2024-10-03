import { Router } from "express";

import {
  getLeaderboardOfTheWeek,
  getUserRankOfTheWeek,
} from "../controllers/leaderboard/leaderboard.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = Router();

router.route("/weekly").get(verifyJWT, getLeaderboardOfTheWeek);
router.route("/weekly/:id").get(verifyJWT, getUserRankOfTheWeek);

export default router;
