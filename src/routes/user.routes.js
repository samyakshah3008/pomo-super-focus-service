import { Router } from "express";
import {
  createGoalController,
  deleteGoalController,
  getGoalsController,
  updateGoalController,
} from "../controllers/goals/goal.controller.js";
import {
  logoutUserController,
  refreshAccessTokenController,
  signinUserController,
  signupGuestController,
  signupUserController,
  verifyOTPAndRegisterUserController,
  verifyOTPAndSigninUserController,
} from "../controllers/user/auth.controller.js";
import { getDailyProgressStats } from "../controllers/user/daily-progress.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = Router();

router.route("/signup").post(signupUserController);
router.route("/signup/verify-otp").post(verifyOTPAndRegisterUserController);
router.route("/signup/guest").post(signupGuestController);
router.route("/signin").post(signinUserController);
router.route("/signin/verify-otp").post(verifyOTPAndSigninUserController);

// secured routes
router.route("/logout").post(verifyJWT, logoutUserController);
router.route("/refresh-access-token").post(refreshAccessTokenController);

router.route("/goals").get(verifyJWT, getGoalsController);
router.route("/goals").post(verifyJWT, createGoalController);
router.route("/goals").put(verifyJWT, updateGoalController);
router.route("/goals").delete(verifyJWT, deleteGoalController);

router.route("/daily-progress").get(verifyJWT, getDailyProgressStats);

export default router;
