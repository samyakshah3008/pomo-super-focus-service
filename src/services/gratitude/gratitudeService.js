import moment from "moment";
import mongoose from "mongoose";
import { GratitudeList } from "../../models/gratitude.model.js";
import { ApiResponse } from "../../utils/ApiResponse.js";
import { ApiError } from "../../utils/apiError.js";

const getGratitudeListItemsOfUserService = async (user) => {
  const userId = new mongoose.Types.ObjectId(user?._id);

  const gratitudeList = await GratitudeList.findOne({ userId });

  return new ApiResponse(
    200,
    { gratitudeItems: gratitudeList?.gratitudeItems || [] },
    "Successfully fetched gratitude items"
  );
};

const addItemToGratitudeListOfUserService = async (user, gratitudeItem) => {
  const { title, description } = gratitudeItem;
  let formattedDate = moment(new Date()).format("DD-MM-YYYY");

  const newGratitudeItem = {
    title,
    description,
    dateOfCreation: formattedDate,
  };

  let gratitudeList = await GratitudeList.findOne({ userId: user?._id });

  if (!gratitudeList) {
    gratitudeList = new GratitudeList({
      userId: user?._id,
      gratitudeItems: [newGratitudeItem],
    });
  } else {
    gratitudeList.gratitudeItems.push(newGratitudeItem);
  }

  await gratitudeList.save();

  return new ApiResponse(
    201,
    { message: "Successfully added item to gratitude list" },
    "Successfully added item to gratitude list"
  );
};

const updateParticularItemFromGratitudeListOfUserService = async (
  user,
  gratitudeItem,
  gratitudeItemId
) => {
  const { title, description } = gratitudeItem;

  const gratitudeList = await GratitudeList.findOne({ userId: user?._id });

  if (!gratitudeList) {
    throw new ApiError(404, {
      message: "Gratitude list is empty for this user.",
    });
  }

  const particularGratitudeItem =
    gratitudeList.gratitudeItems.id(gratitudeItemId);

  if (!particularGratitudeItem) {
    throw new ApiError(404, { message: "Gratitude item not found!" });
  }

  if (title !== undefined) particularGratitudeItem.title = title;
  if (description !== undefined)
    particularGratitudeItem.description = description;

  await gratitudeList.save();

  return new ApiResponse(
    200,
    { message: "Successfully updated item in gratitude list" },
    "Successfully updated item in gratitude list"
  );
};

const deleteParticularItemFromGratitudeListOfUserService = async (
  user,
  gratitudeItemId
) => {
  const gratitudeList = await GratitudeList.findOne({ userId: user?._id });

  if (!gratitudeList) {
    throw new ApiError(404, {
      message: "Gratitude list is empty for this user.",
    });
  }

  const particularGratitudeItem =
    gratitudeList.gratitudeItems.id(gratitudeItemId);

  if (!particularGratitudeItem) {
    throw new ApiError(404, { message: "Gratitude item not found!" });
  }

  await particularGratitudeItem.deleteOne();
  await gratitudeList.save();

  return new ApiResponse(
    200,
    { message: "Successfully deleted item in gratitude list" },
    "Successfully deleted item in gratitude list"
  );
};

export {
  addItemToGratitudeListOfUserService,
  deleteParticularItemFromGratitudeListOfUserService,
  getGratitudeListItemsOfUserService,
  updateParticularItemFromGratitudeListOfUserService,
};
