import mongoose from "mongoose";
import { BucketList } from "../../models/bucket-list.model.js";
import { ApiError } from "../../utils/ApiError.js";
import { ApiResponse } from "../../utils/ApiResponse.js";

const getBucketListItemsOfUserService = async (user) => {
  const userId = new mongoose.Types.ObjectId(user?._id);

  const bucketList = await BucketList.findOne({ userId });

  return new ApiResponse(
    200,
    { bucketItems: bucketList?.bucketItems || [] },
    "Successfully fetched bucket items"
  );
};

const addItemToBucketListOfUserService = async (user, bucketItem) => {
  const { title, description, isCompleted } = bucketItem;

  const newBucketItem = {
    title,
    description,
    isCompleted,
  };

  let bucketList = await BucketList.findOne({ userId: user?._id });

  if (!bucketList) {
    bucketList = new BucketList({
      userId: user?._id,
      bucketItems: [newBucketItem],
    });
  } else {
    bucketList.bucketItems.push(newBucketItem);
  }

  await bucketList.save();

  return new ApiResponse(
    201,
    { message: "Successfully added item to bucket list" },
    "Successfully added item to bucket list"
  );
};

const updateParticularItemFromBucketListOfUserService = async (
  user,
  bucketItem,
  bucketItemId
) => {
  const { title, description, isCompleted } = bucketItem;

  const bucketList = await BucketList.findOne({ userId: user?._id });

  if (!bucketList) {
    throw new ApiError(404, { message: "Bucket list is empty for this user." });
  }

  const particularBucketItem = bucketList.bucketItems.id(bucketItemId);

  if (!particularBucketItem) {
    throw new ApiError(404, { message: "Bucket item not found!" });
  }

  if (title !== undefined) particularBucketItem.title = title;
  if (description !== undefined) particularBucketItem.description = description;
  if (isCompleted !== undefined) particularBucketItem.isCompleted = isCompleted;

  await bucketList.save();

  return new ApiResponse(
    200,
    { message: "Successfully updated item in bucket list" },
    "Successfully updated item in bucket list"
  );
};

const deleteParticularItemFromBucketListOfUserService = async (
  user,
  bucketItemId
) => {
  const bucketList = await BucketList.findOne({ userId: user?._id });

  if (!bucketList) {
    throw new ApiError(404, { message: "Bucket list is empty for this user." });
  }

  const particularBucketItem = bucketList.bucketItems.id(bucketItemId);

  if (!particularBucketItem) {
    throw new ApiError(404, { message: "Bucket item not found!" });
  }

  await particularBucketItem.deleteOne();
  await bucketList.save();

  return new ApiResponse(
    200,
    { message: "Successfully deleted item in bucket list" },
    "Successfully deleted item in bucket list"
  );
};

export {
  addItemToBucketListOfUserService,
  deleteParticularItemFromBucketListOfUserService,
  getBucketListItemsOfUserService,
  updateParticularItemFromBucketListOfUserService,
};
