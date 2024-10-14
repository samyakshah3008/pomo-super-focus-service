import {
  activateWorkingFrameworkService,
  getUserDetailsService,
  updateUserDetailsService,
} from "../../services/user/userData/userDataService.js";
import { ApiError } from "../../utils/apiError.js";
import { asyncHandler } from "../../utils/asyncHandler.js";

const getUserDetailsController = asyncHandler(async (req, res) => {
  const { userId } = req.query;

  if (!userId) {
    return res
      .status(400)
      .json(
        new ApiError(
          400,
          { error: "User Id is required" },
          "User ID is required."
        )
      );
  }

  try {
    const response = await getUserDetailsService(userId);
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
          "something went wrong while getting daily progress stats. "
        )
      );
  }
});

const updateUserDetailsController = asyncHandler(async (req, res) => {
  const { userId, isGreetingModalShown } = req.body;

  if (!userId) {
    return res
      .status(400)
      .json(
        new ApiError(
          400,
          { error: "User Id is required" },
          "User ID is required."
        )
      );
  }

  try {
    const response = await updateUserDetailsService(
      userId,
      isGreetingModalShown
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
          "something went wrong while getting daily progress stats. "
        )
      );
  }
});

const activateWorkingFrameworkController = asyncHandler(async (req, res) => {
  const { userId, workingFramework } = req.body;

  if (!userId || !Object.keys(workingFramework)?.length) {
    return res.status(400).json(
      new ApiError(
        400,
        {
          error:
            "Missing fields, both user id and working framework is required. ",
        },
        "User ID is required."
      )
    );
  }

  try {
    const response = await activateWorkingFrameworkService(
      userId,
      workingFramework
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
          "something went wrong while activating working framework! "
        )
      );
  }
});

export {
  activateWorkingFrameworkController,
  getUserDetailsController,
  updateUserDetailsController,
};
