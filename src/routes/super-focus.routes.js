import { Router } from "express";
import {
  addPomodoro,
  deleteActivePomodoro,
  fetchSuperFocusDetails,
  getActivePomodoro,
  initializePomodoro,
  pauseOrResumePomodoro,
  updateSuperFocusSettings,
} from "../controllers/super-focus/super-focus.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = Router();

router.get("/", verifyJWT, fetchSuperFocusDetails);
router.get("/active-pomodoro", verifyJWT, getActivePomodoro);
router.post("/add-pomodoro", verifyJWT, addPomodoro);
router.post("/update-settings", verifyJWT, updateSuperFocusSettings);
router.route("/initialize-active-pomodoro").post(verifyJWT, initializePomodoro);
router.post("/active-pomodoro", verifyJWT, pauseOrResumePomodoro);
router.delete("/active-pomodoro", verifyJWT, deleteActivePomodoro);

export default router;
