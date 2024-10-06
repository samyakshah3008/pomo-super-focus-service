import { Router } from "express";
import { getWorkingFrameworkTemplatesController } from "../controllers/working-framework/working-framework.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = Router();

router.route("/").get(verifyJWT, getWorkingFrameworkTemplatesController);

export default router;
