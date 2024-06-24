import { Router } from "express";
import { createNewTodo, getTodos } from "../controllers/todo.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = Router();

router.route("/").get(verifyJWT, getTodos);
router.route("/").post(verifyJWT, createNewTodo);

export default router;
