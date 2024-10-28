import mongoose from "mongoose";
import { GoalList } from "../../models/goal.model.js";
import { ApiResponse } from "../../utils/ApiResponse.js";
import { ApiError } from "../../utils/apiError.js";

const getGoalListItemsOfUserService = async (user) => {
  const userId = new mongoose.Types.ObjectId(user?._id);

  const goalList = await GoalList.findOne({ userId });

  return new ApiResponse(
    200,
    { goalItems: goalList?.goalItems || [] },
    "Successfully fetched goal items"
  );
};

const addItemToGoalListOfUserService = async (user, goalItem) => {
  const { title, doAbleActions, category, estimatedTimeToComplete, status } =
    goalItem;

  const newGoalItem = {
    title,
    doAbleActions,
    category,
    estimatedTimeToComplete,
    status,
  };

  let goalList = await GoalList.findOne({ userId: user?._id });

  if (!goalList) {
    goalList = new GoalList({
      userId: user?._id,
      goalItems: [newGoalItem],
    });
  } else {
    goalList.goalItems.push(newGoalItem);
  }

  await goalList.save();

  return new ApiResponse(
    201,
    { message: "Successfully added item to goal list" },
    "Successfully added item to goal list"
  );
};

const updateParticularItemFromGoalListOfUserService = async (
  user,
  goalItem,
  goalItemId
) => {
  const { title, doAbleActions, category, estimatedTimeToComplete, status } =
    goalItem;

  const goalList = await GoalList.findOne({ userId: user?._id });

  if (!goalList) {
    throw new ApiError(404, {
      message: "Goal list is empty for this user.",
    });
  }

  const particularGoalItem = goalList.goalItems.id(goalItemId);

  if (!particularGoalItem) {
    throw new ApiError(404, { message: "Goal item not found!" });
  }

  if (title !== undefined) particularGoalItem.title = title;
  if (doAbleActions !== undefined)
    particularGoalItem.doAbleActions = doAbleActions;
  if (estimatedTimeToComplete !== undefined)
    particularGoalItem.estimatedTimeToComplete = estimatedTimeToComplete;
  if (category !== undefined) particularGoalItem.category = category;
  if (status !== undefined) particularGoalItem.status = status;
  await goalList.save();

  return new ApiResponse(
    200,
    { message: "Successfully updated item in goal list" },
    "Successfully updated item in goal list"
  );
};

const deleteParticularItemFromGoalListOfUserService = async (
  user,
  goalItemId
) => {
  const goalList = await GoalList.findOne({ userId: user?._id });

  if (!goalList) {
    throw new ApiError(404, {
      message: "Goal list is empty for this user.",
    });
  }

  const particularGoalItem = goalList.goalItems.id(goalItemId);

  if (!particularGoalItem) {
    throw new ApiError(404, { message: "Goal item not found!" });
  }

  await particularGoalItem.deleteOne();
  await goalList.save();

  return new ApiResponse(
    200,
    { message: "Successfully deleted item in goal list" },
    "Successfully deleted item in goal list"
  );
};

export {
  addItemToGoalListOfUserService,
  deleteParticularItemFromGoalListOfUserService,
  getGoalListItemsOfUserService,
  updateParticularItemFromGoalListOfUserService,
};
