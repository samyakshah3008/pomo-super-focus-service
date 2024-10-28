import { Router } from "express";

import {
  addItemToGoalListOfUser,
  deleteParticularItemFromGoalListOfUser,
  getGoalListItemsOfUser,
  updateParticularItemFromGoalListOfUser,
} from "../controllers/goals/goal.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = Router();

router.get("/", verifyJWT, getGoalListItemsOfUser);
router.post("/", verifyJWT, addItemToGoalListOfUser);
router.route("/").put(verifyJWT, updateParticularItemFromGoalListOfUser);
router.route("/").delete(verifyJWT, deleteParticularItemFromGoalListOfUser);

export default router;
