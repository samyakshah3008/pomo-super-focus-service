import mongoose from "mongoose";
import { SelfReviewList } from "../../models/self-review.model.js";
import { ApiError } from "../../utils/ApiError.js";
import { ApiResponse } from "../../utils/ApiResponse.js";

const getSelfReviewListItemsOfUserService = async (user) => {
  const userId = new mongoose.Types.ObjectId(user?._id);

  const selfReviewList = await SelfReviewList.findOne({ userId });

  if (!selfReviewList) {
    return new ApiResponse(
      200,
      { selfReviewListItems: {} },
      "No self review items found for this user."
    );
  }

  const selfReviewItemsByYear = selfReviewList.selfReviewItems.reduce(
    (acc, item) => {
      const year = new Date(item.date).getFullYear();
      if (!acc[year]) {
        acc[year] = [];
      }
      acc[year].push(item);
      return acc;
    },
    {}
  );

  return new ApiResponse(
    200,
    { selfReviewListItems: selfReviewItemsByYear },
    "Successfully fetched self review items, organized by year"
  );
};

const addItemToSelfReviewListOfUserService = async (user, selfReviewItem) => {
  const { title, description, date } = selfReviewItem;

  const newSelfReviewItem = {
    title,
    description,
    date,
  };

  let selfReviewItemsList = await SelfReviewList.findOne({ userId: user?._id });

  if (!selfReviewItemsList) {
    selfReviewItemsList = new SelfReviewList({
      userId: user?._id,
      selfReviewItems: [newSelfReviewItem],
    });
  } else {
    selfReviewItemsList.selfReviewItems.push(newSelfReviewItem);
  }

  await selfReviewItemsList.save();

  return new ApiResponse(
    201,
    { message: "Successfully added item to self review list" },
    "Successfully added item to self review list"
  );
};
const updateParticularItemFromSelfReviewListOfUserService = async (
  user,
  selfReviewItem,
  selfReviewItemId
) => {
  const { title, description, date } = selfReviewItem;

  const selfReviewItemList = await SelfReviewList.findOne({
    userId: user?._id,
  });

  if (!selfReviewItemList) {
    throw new ApiError(404, {
      message: "Self Review list is empty for this user.",
    });
  }

  const particularSelfReviewItem =
    selfReviewItemList.selfReviewItems.id(selfReviewItemId);

  if (!particularSelfReviewItem) {
    throw new ApiError(404, { message: "Self Review item not found!" });
  }

  if (title !== undefined) particularSelfReviewItem.title = title;
  if (description !== undefined)
    particularSelfReviewItem.description = description;
  if (date !== undefined) particularSelfReviewItem.date = date;

  await selfReviewItemList.save();

  return new ApiResponse(
    200,
    { message: "Successfully updated item in self review list" },
    "Successfully updated item in self review list"
  );
};

const deleteParticularItemFromSelfReviewListOfUserService = async (
  user,
  selfReviewItemId
) => {
  const selfReviewList = await SelfReviewList.findOne({ userId: user?._id });

  if (!selfReviewList) {
    throw new ApiError(404, {
      message: "Self review list is empty for this user.",
    });
  }

  const particularSelfReviewItem =
    selfReviewList.selfReviewItems.id(selfReviewItemId);

  if (!particularSelfReviewItem) {
    throw new ApiError(404, { message: "Self review item not found!" });
  }

  await particularSelfReviewItem.deleteOne();
  await selfReviewList.save();

  return new ApiResponse(
    200,
    { message: "Successfully deleted item in self review list" },
    "Successfully deleted item in self review list"
  );
};

export {
  addItemToSelfReviewListOfUserService,
  deleteParticularItemFromSelfReviewListOfUserService,
  getSelfReviewListItemsOfUserService,
  updateParticularItemFromSelfReviewListOfUserService,
};
