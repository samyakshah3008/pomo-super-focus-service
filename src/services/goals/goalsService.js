import { Goal } from "../../models/goal.model.js";
import { User } from "../../models/user.model.js";
import { ApiError } from "../../utils/apiError.js";
import { ApiResponse } from "../../utils/ApiResponse.js";

export const getGoals = async (userId) => {
  if (!userId) {
    throw new ApiError(400, "Please provide user ID");
  }
  const goalsList = await Goal.find({ userId });

  return new ApiResponse(200, { goalsList });
};

export const createGoal = async (userId, goalDetails) => {
  const { title, description = "", completed = false } = goalDetails;

  if (!userId) {
    throw new ApiError(400, "Please provide user ID");
  }
  if (!title) {
    throw new ApiError(400, "Please provide a title");
  }

  const user = await User.findById({ _id: userId });

  if (!user) {
    throw new ApiError(404, "User not found");
  }

  const newGoal = new Goal({ userId, title, description, completed });

  try {
    await newGoal.save();
    return new ApiResponse(201, {}, "Goal created successfully");
  } catch (error) {
    throw new ApiError(
      500,
      error,
      "Something went wrong while creating a new goal"
    );
  }
};

export const updateGoal = async (userId, goalDetails) => {
  const { goalId, title, description, completed = false } = goalDetails;

  if (!userId) {
    throw new ApiError(400, "Please provide user ID");
  }
  if (!goalId) {
    throw new ApiError(400, "Please provide goal ID");
  }
  if (!title) {
    throw new ApiError(400, "Please provide a title");
  }
  if (!description) {
    throw new ApiError(400, "Description is required");
  }

  const user = await User.findById(userId);
  if (!user) {
    throw new ApiError(404, "User not found");
  }

  const updatedGoal = { userId, title, description, completed };

  await Goal.findByIdAndUpdate(goalId, updatedGoal, {
    new: true,
    runValidators: true,
  });

  return new ApiResponse(200, {}, "Goal updated successfully");
};

export const deleteGoal = async (goalId) => {
  if (!goalId) {
    throw new ApiError(400, "Goal ID is required");
  }

  await Goal.findByIdAndDelete(goalId);
  return new ApiResponse(200, "Goal deleted successfully");
};
