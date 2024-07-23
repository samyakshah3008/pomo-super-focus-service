import {
  createGoal,
  deleteGoal,
  getGoals,
  updateGoal,
} from "../../services/goals/goalsService.js";
import { ApiError } from "../../utils/apiError.js";
import { asyncHandler } from "../../utils/asyncHandler.js";

// get all goals of a particular user

const getGoalsController = asyncHandler(async (req, res) => {
  const { userId } = req.query;

  try {
    const response = await getGoals(userId);
    return res.status(200).json(response);
  } catch (error) {
    throw new ApiError(
      500,
      error,
      "Something went wrong while retrieving goals"
    );
  }
});

// create a new goal

const createGoalController = asyncHandler(async (req, res) => {
  const { userId, goalDetails } = req.body;
  try {
    const response = await createGoal(userId, goalDetails);

    return res.status(201).json(response);
  } catch (error) {
    console.log(error);
    throw new ApiError(
      500,
      error,
      "Something went wrong while creating a new goal"
    );
  }
});

const updateGoalController = asyncHandler(async (req, res) => {
  const { userId, goalDetails } = req.body;

  try {
    const response = await updateGoal(userId, goalDetails);

    return res.status(200).json(response);
  } catch (e) {
    throw new ApiError(500, "Something went wrong while updating goal");
  }
});

const deleteGoalController = asyncHandler(async (req, res) => {
  const { goalId } = req.query;

  try {
    const response = await deleteGoal(goalId);
    return res.status(200).json(response);
  } catch (error) {
    throw new ApiError(
      500,
      error,
      "Something went wrong while deleting the goal"
    );
  }
});

export {
  createGoalController,
  deleteGoalController,
  getGoalsController,
  updateGoalController,
};
