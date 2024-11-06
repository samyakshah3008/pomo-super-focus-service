import { Router } from "express";

import {
  addTaskToTasksListOfUser,
  deleteParticularItemFromTaskListOfUser,
  getTasksOfUser,
  onChangePriority,
  onChangeStatus,
  updateParticularTaskFromTaskListOfUser,
} from "../controllers/tasks/tasks.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = Router();

router.get("/", verifyJWT, getTasksOfUser);
router.post("/", verifyJWT, addTaskToTasksListOfUser);
router.route("/").put(verifyJWT, updateParticularTaskFromTaskListOfUser);
router.route("/").delete(verifyJWT, deleteParticularItemFromTaskListOfUser);

router.post("/change-status", verifyJWT, onChangeStatus);
router.post("/change-priority", verifyJWT, onChangePriority);

export default router;
