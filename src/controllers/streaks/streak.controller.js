import {
  logDailyStreakService,
  updateDailyGoalFocusMinutesService,
} from "../../services/streaks/streaksService.js";
import { ApiError } from "../../utils/apiError.js";
import { asyncHandler } from "../../utils/asyncHandler.js";

const logDailyStreak = asyncHandler(async (req, res) => {
  const { userId, currentDate } = req.query;

  if (!userId) {
    return res.status(400).json(new ApiError(400, null, "User ID required. "));
  }

  if (!currentDate) {
    return res
      .status(400)
      .json(new ApiError(400, null, "Current Date required. "));
  }

  try {
    const response = await logDailyStreakService(userId, currentDate);
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
          "something went wrong while logging daily streak. "
        )
      );
  }
});

const updateDailyGoalFocusMinutes = asyncHandler(async (req, res) => {
  const { userId, newGoalFocusTimeInHours } = req.body;

  if (!userId) {
    return res
      .status(400)
      .json(
        new ApiError(400, { error: "userId required. " }, "userId required. ")
      );
  }

  if (!newGoalFocusTimeInHours) {
    return res
      .status(400)
      .json(
        new ApiError(
          400,
          { error: "focus minutes are required." },
          "focus minutes are required."
        )
      );
  }

  try {
    const response = await updateDailyGoalFocusMinutesService(
      userId,
      newGoalFocusTimeInHours
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
          "something went wrong while updating daily progress stats. "
        )
      );
  }
});

export { logDailyStreak, updateDailyGoalFocusMinutes };
