import { Router } from "express";
import {
  createGoal,
  deleteGoal,
  getGoals,
  updateGoal,
} from "../controllers/goal.controller.js";
import {
  loginUser,
  logoutUser,
  refreshAccessToken,
  registerUser,
  verifyOTP,
} from "../controllers/user.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = Router();

router.route("/register").post(registerUser);
router.route("/login").post(loginUser);
router.route("/verify-otp").post(verifyOTP);

// secured routes
router.route("/logout").post(verifyJWT, logoutUser);
router.route("/refresh-access-token").post(refreshAccessToken);

router.route("/goals").get(verifyJWT, getGoals);
router.route("/goals").post(verifyJWT, createGoal);
router.route("/goals").put(verifyJWT, updateGoal);
router.route("/goals").delete(verifyJWT, deleteGoal);

export default router;
