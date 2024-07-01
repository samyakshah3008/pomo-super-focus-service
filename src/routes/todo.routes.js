import { Router } from "express";
import {
  createNewTodo,
  deleteParticularTodo,
  getTodo,
  getTodosOfParticularUser,
  updateParticularTodo,
} from "../controllers/todo.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = Router();

router.route("/:id").get(verifyJWT, getTodo);
router.route("/").get(verifyJWT, getTodosOfParticularUser);
router.route("/").post(verifyJWT, createNewTodo);
router.route("/").put(verifyJWT, updateParticularTodo);
router.route("/").delete(verifyJWT, deleteParticularTodo);

export default router;
