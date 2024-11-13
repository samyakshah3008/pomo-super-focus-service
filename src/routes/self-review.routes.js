import { Router } from "express";

import {
  addItemToSelfReviewListOfUser,
  deleteParticularItemFromSelfReviewListOfUser,
  getSelfReviewListItemsOfUser,
  updateParticularItemFromSelfReviewListOfUser,
} from "../controllers/self-review/self-review.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = Router();

router.get("/", verifyJWT, getSelfReviewListItemsOfUser);
router.post("/", verifyJWT, addItemToSelfReviewListOfUser);
router.route("/").put(verifyJWT, updateParticularItemFromSelfReviewListOfUser);
router
  .route("/")
  .delete(verifyJWT, deleteParticularItemFromSelfReviewListOfUser);

export default router;
