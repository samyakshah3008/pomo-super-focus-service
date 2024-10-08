import express from "express";
import {
  createHabit,
  deleteHabit,
  getTodaysHabits,
  markHabitComplete,
  updateHabit,
} from "../controllers/habits/habits.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = express.Router();

router.post("/", verifyJWT, createHabit);
router.get("/", verifyJWT, getTodaysHabits);
router.put("/:habitId", verifyJWT, updateHabit);
router.delete("/:habitId", verifyJWT, deleteHabit);
router.patch("/:habitId/mark-complete", verifyJWT, markHabitComplete);

export default router;
