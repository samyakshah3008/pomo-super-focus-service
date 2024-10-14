import { Router } from "express";
import {
  createCustomWorkingFrameworkController,
  deleteCustomWorkingFrameworkController,
  getCustomWorkingFrameworkByIdController,
  getCustomWorkingFrameworkTemplatesController,
  updateCustomWorkingFrameworkController,
} from "../controllers/customWorkingFramework/customWorkingFramework.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = Router();

router.route("/").get(verifyJWT, getCustomWorkingFrameworkTemplatesController);
router
  .route("/get-framework-by-id")
  .get(verifyJWT, getCustomWorkingFrameworkByIdController);
router.route("/").post(verifyJWT, createCustomWorkingFrameworkController);
router.route("/delete").post(verifyJWT, deleteCustomWorkingFrameworkController);
router.route("/update").post(verifyJWT, updateCustomWorkingFrameworkController);

export default router;
