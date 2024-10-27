import { Router } from "express";
import {
  addItemToBucketListOfUser,
  deleteParticularItemFromBucketListOfUser,
  getBucketListItemsOfUser,
  updateParticularItemFromBucketListOfUser,
} from "../controllers/bucket-list/bucketList.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = Router();

router.get("/", verifyJWT, getBucketListItemsOfUser);
router.post("/", verifyJWT, addItemToBucketListOfUser);
router.route("/").put(verifyJWT, updateParticularItemFromBucketListOfUser);
router.route("/").delete(verifyJWT, deleteParticularItemFromBucketListOfUser);

export default router;
