import express from "express";
import {
  createHabit,
  deleteHabit,
  getAllHabits,
  getTodaysHabits,
  updateHabit,
} from "../controllers/habits/habits.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = express.Router();

router.get("/", verifyJWT, getAllHabits);
router.get("/today", verifyJWT, getTodaysHabits);
router.post("/create", verifyJWT, createHabit);
router.post("/update", verifyJWT, updateHabit);
router.delete("/", verifyJWT, deleteHabit);

export default router;
