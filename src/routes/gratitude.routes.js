import { Router } from "express";
import {
  addItemToGratitudeListOfUser,
  deleteParticularItemFromGratitudeListOfUser,
  getGratitudeListItemsOfUser,
  updateParticularItemFromGratitudeListOfUser,
} from "../controllers/gratitude/gratitude.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = Router();

router.get("/", verifyJWT, getGratitudeListItemsOfUser);
router.post("/", verifyJWT, addItemToGratitudeListOfUser);
router.route("/").put(verifyJWT, updateParticularItemFromGratitudeListOfUser);
router
  .route("/")
  .delete(verifyJWT, deleteParticularItemFromGratitudeListOfUser);

export default router;
