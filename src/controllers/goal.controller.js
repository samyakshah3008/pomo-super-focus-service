import { Goal } from "../models/goal.model.js";
import { User } from "../models/user.model.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { ApiError } from "../utils/apiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";

// get all goals of a particular user

const getGoals = asyncHandler(async (req, res) => {
  const { userId } = req.query;
  if (!userId) {
    throw new ApiError(400, "Please provide user ID");
  }
  try {
    const goalsList = await Goal.find({ userId });
    return res.status(200).json(new ApiResponse(200, goalsList));
  } catch (e) {
    throw new ApiError(500, "Something went wrong while retrieving goals");
  }
});

// create a new goal

const createGoal = asyncHandler(async (req, res) => {
  const { userId, title, description = "", completed = false } = req.body;
  if (!userId) {
    throw new ApiError(400, "Please provide user ID");
  }
  if (!title) {
    throw new ApiError(400, "Please provide a title");
  }

  const user = await User.findById(userId);

  if (!user) {
    throw new ApiError(404, "User not found");
  }

  const newGoal = new Goal({ userId, title, description, completed });

  try {
    await newGoal.save();

    return res
      .status(200)
      .json(new ApiResponse(200, "Goal created successfully"));
  } catch (e) {
    throw new ApiError(500, "Something went wrong while creating a new goal");
  }
});

const updateGoal = asyncHandler(async (req, res) => {
  const { userId, goalId, title, description, completed } = req.body;

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
  try {
    await Goal.findByIdAndUpdate(goalId, updatedGoal, {
      new: true,
      runValidators: true,
    });

    return res
      .status(200)
      .json(new ApiResponse(200, "Goal updated successfully"));
  } catch (e) {
    throw new ApiError(500, "Something went wrong while updating goal");
  }
});

const deleteGoal = asyncHandler(async (req, res) => {
  const { goalId } = req.body;
  if (!goalId) {
    throw new ApiError(400, "Goal ID is required");
  }

  try {
    await Goal.findByIdAndDelete(goalId);

    return res
      .status(200)
      .json(new ApiResponse(200, "Goal deleted successfully"));
  } catch (e) {
    throw new ApiError(500, "Something went wrong while deleting the goal");
  }
});

export { createGoal, deleteGoal, getGoals, updateGoal };
