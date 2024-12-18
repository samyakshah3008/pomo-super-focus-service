import { Router } from "express";
import {
  logoutUserController,
  refreshAccessTokenController,
  signinUserController,
  signupGuestController,
  signupUserController,
  verifyOTPAndRegisterUserController,
  verifyOTPAndSigninUserController,
} from "../controllers/user/auth.controller.js";
import { getDailyProgressStatsController } from "../controllers/user/daily-progress.controller.js";
import {
  activateWorkingFrameworkController,
  confirmOTPAndUpdateUserEmailInformationController,
  getUserDetailsController,
  reportBugController,
  updateUserBasicInformationController,
  updateUserDetailsController,
  updateUserEmailInformationController,
  updateUserLifeSpanController,
} from "../controllers/user/user.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = Router();

router.route("/signup").post(signupUserController);
router.route("/signup/verify-otp").post(verifyOTPAndRegisterUserController);
router.route("/signup/guest").post(signupGuestController);
router.route("/signin").post(signinUserController);
router.route("/signin/verify-otp").post(verifyOTPAndSigninUserController);

// secured routes
router.route("/").get(verifyJWT, getUserDetailsController);
router.route("/").post(verifyJWT, updateUserDetailsController);

router.route("/logout").post(verifyJWT, logoutUserController);
router.route("/refresh-access-token").post(refreshAccessTokenController);

router.route("/daily-progress").get(verifyJWT, getDailyProgressStatsController);
router
  .route("/activate-working-framework")
  .post(verifyJWT, activateWorkingFrameworkController);

router.route("/my-life").post(verifyJWT, updateUserLifeSpanController);
router
  .route("/update-basic-information")
  .post(verifyJWT, updateUserBasicInformationController);
router
  .route("/update-email")
  .post(verifyJWT, updateUserEmailInformationController);

router
  .route("/update-email/verify")
  .post(verifyJWT, confirmOTPAndUpdateUserEmailInformationController);

router.route("/report-bug").post(verifyJWT, reportBugController);

export default router;
