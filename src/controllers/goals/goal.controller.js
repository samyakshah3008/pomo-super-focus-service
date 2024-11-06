import {
  addItemToGoalListOfUserService,
  deleteParticularItemFromGoalListOfUserService,
  getGoalListItemsOfUserService,
  updateParticularItemFromGoalListOfUserService,
} from "../../services/goals/goalsService.js";
import { ApiError } from "../../utils/ApiError.js";
import { asyncHandler } from "../../utils/asyncHandler.js";

const getGoalListItemsOfUser = asyncHandler(async (req, res) => {
  const user = req?.user;
  try {
    const response = await getGoalListItemsOfUserService(user);
    return res.status(200).json(response);
  } catch (error) {
    if (error instanceof ApiError) {
      return res.status(error.statusCode).json(error);
    }
    return res
      .status(500)
      .json(
        new ApiError(
          500,
          { message: error?.message },
          "something went wrong fetching get goal list items of user"
        )
      );
  }
});

const addItemToGoalListOfUser = asyncHandler(async (req, res) => {
  const { goalItem } = req.body;
  const user = req?.user;
  const { title, doAbleActions, category, estimatedTimeToComplete, status } =
    goalItem;

  if (
    !title?.length ||
    !doAbleActions?.length ||
    !category?.length ||
    !estimatedTimeToComplete?.length
  ) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  try {
    const response = await addItemToGoalListOfUserService(user, goalItem);
    return res.status(200).json(response);
  } catch (error) {
    if (error instanceof ApiError) {
      return res.status(error.statusCode).json(error);
    }
    return res
      .status(500)
      .json(
        new ApiError(
          500,
          { message: error?.message },
          "something went wrong adding item to goal list"
        )
      );
  }
});

const updateParticularItemFromGoalListOfUser = asyncHandler(
  async (req, res) => {
    const { goalItem, goalId } = req.body;
    const user = req?.user;
    const { title, doAbleActions, category, estimatedTimeToComplete, status } =
      goalItem;

    if (
      !title?.length ||
      !doAbleActions?.length ||
      !category?.length ||
      !estimatedTimeToComplete?.length
    ) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    try {
      const response = await updateParticularItemFromGoalListOfUserService(
        user,
        goalItem,
        goalId
      );
      return res.status(200).json(response);
    } catch (error) {
      if (error instanceof ApiError) {
        return res.status(error.statusCode).json(error);
      }
      return res
        .status(500)
        .json(
          new ApiError(
            500,
            { message: error?.message },
            "something went wrong updating item to goal list"
          )
        );
    }
  }
);

const deleteParticularItemFromGoalListOfUser = asyncHandler(
  async (req, res) => {
    const { goalId } = req.query;
    const user = req?.user;

    try {
      const response = await deleteParticularItemFromGoalListOfUserService(
        user,
        goalId
      );
      return res.status(200).json(response);
    } catch (error) {
      if (error instanceof ApiError) {
        return res.status(error.statusCode).json(error);
      }
      return res
        .status(500)
        .json(
          new ApiError(
            500,
            { message: error?.message },
            "something went wrong updating item to goal list"
          )
        );
    }
  }
);

export {
  addItemToGoalListOfUser,
  deleteParticularItemFromGoalListOfUser,
  getGoalListItemsOfUser,
  updateParticularItemFromGoalListOfUser,
};
