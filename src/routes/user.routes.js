import { Router } from "express";
import {
  logoutUserController,
  refreshAccessTokenController,
  signinUserController,
  signupUserController,
  verifyOTPAndRegisterUserController,
  verifyOTPAndSigninUserController,
} from "../controllers/user/auth.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = Router();

router.route("/signup").post(signupUserController);
router.route("/signup/verify-otp").post(verifyOTPAndRegisterUserController);
router.route("/signin").post(signinUserController);
router.route("/signin/verify-otp").post(verifyOTPAndSigninUserController);

// secured routes
router.route("/logout").post(verifyJWT, logoutUserController);
router.route("/refresh-access-token").post(refreshAccessTokenController);

router.route("/goals").get(verifyJWT, getGoals);
router.route("/goals").post(verifyJWT, createGoal);
router.route("/goals").put(verifyJWT, updateGoal);
router.route("/goals").delete(verifyJWT, deleteGoal);

export default router;
